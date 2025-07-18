import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server";
import { DB_NAME } from "@/lib/constants";

export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        let param;
        param = await context.params;

        const dogId = param.id;

        // ✅ Validate ID
        if (!ObjectId.isValid(dogId)) {

            return NextResponse.json(
                { error: "Invalid dog ID" },
                { status: 400 }
            );
        }

        // Validate dog JSON structure 
        const {
            name,
            litter,
            breed,
            dob,
            gender,
            photos,
            description,
            price: rawPrice,
            status,
            location
        } = await req.json();

        const price = Number(rawPrice);

        if (!name || name.trim().length === 0) {

            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (!breed || breed.trim().length === 0) {

            return NextResponse.json({ error: "Breed is required" }, { status: 400 });
        }

        if (dob && isNaN(Date.parse(dob))) {
            return NextResponse.json({ error: "Invalid date of birth" }, { status: 400 });
        }

        if (!gender || gender.trim().length === 0) {
            return NextResponse.json({ error: "Gender is required" }, { status: 400 });
        }

        if (price && (typeof price !== "number" || price < 0)) {

            return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
        }

        if (status && !["available", "pending-reservation", "deposit-requested", "reserved", "sold"].includes(status)) {

            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }


        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const dogs = db.collection("dogs");

        const existingDog = await dogs.findOne({ _id: new ObjectId(dogId) });

        if (!existingDog) {
            return NextResponse.json({ error: "Dog not found." }, { status: 404 });
        }

        if (["pending-reservation", "deposit-requested", "reserved"].includes(existingDog.status)) {
            if (
                (status && status !== existingDog.status) ||
                (price && price !== existingDog.price)
            ) {
                return NextResponse.json(
                    {
                        error:
                            "This dog is currently under a reservation or deposit request. Price or status changes are not allowed. Cancel the request first."
                    },
                    { status: 400 }
                );
            }
        }

        const updateFields: any = {
            name: name.trim(),
            litter: litter.trim(),
            breed: breed.trim(),
            dob: dob || null,
            gender: gender.trim(),
            photos: photos || [],
            description: description?.trim() || "",
            price: price || 0,
            status: status || "",
            location: location?.trim() || ""
        }

        const result = await dogs.updateOne(
            { _id: new ObjectId(dogId) },
            { $set: updateFields }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Dog not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Dog has been updated!" });
    } catch (error) {
        console.error("Error updating dog", error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        )
    }
}

// Note currently allowing the breeder to do a hard delete of a dog and casdcade/clean up any associated puppyInterests and adoptionRequests as well as messages.
// TODO: Consider soft delete instead of hard delete in the future.
// This would mean setting a deletedAt timestamp and not actually removing the dog from the database.
// This way we can keep historical data and prevent orphaned interests/requests/messages.
// This is useful for reporting and analytics purposes, as well as maintaining a complete history of interactions
// with the dog.
export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        let param;
        param = await context.params;

        const dogId = param.id;

        if (!ObjectId.isValid(dogId)) {
            return NextResponse.json({ error: "Invalid dog ID" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Stop with delete if the puppy has an in-progress adoption request
        const hasActiveRequests = await db.collection("adoptionRequests").findOne({
            dogId: new ObjectId(dogId),
            status: { $in: ["deposit-requested", "deposit-paid"] },
        });

        if (hasActiveRequests) {
            return NextResponse.json(
                { error: "Cannot delete this dog. There are active adoption requests or a deposit has been paid." },
                { status: 400 }
            );
        }

        // Collections
        const dogs = db.collection("dogs");
        const interests = db.collection("puppyInterests");
        const adoptionRequests = db.collection("adoptionRequests");
        const conversations = db.collection("conversations");
        const messages = db.collection("messages");

        const result = await dogs.deleteOne({ _id: new ObjectId(dogId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Dog not found." }, { status: 404 })
        }

        // Delete puppyInterests for this dog
        const interestsToDelete = await interests.find({
            dogId: new ObjectId(dogId)
        }).toArray();

        const interestIds = interestsToDelete.map(i => i._id);

        const interestResult = await interests.deleteMany({
            dogId: new ObjectId(dogId)
        });

        // Delete adoptionRequests for this dog
        const adoptionRequestResult = await adoptionRequests.deleteMany({
            dogId: new ObjectId(dogId)
        });

        // Handle related conversations + messages
        if (interestIds.length > 0) {
            const relatedConversations = await conversations.find({
                puppyInterestIds: { $in: interestIds }
            }).toArray();

            for (const convo of relatedConversations) {
                const updatedPuppyInterestIds = convo.puppyInterestIds.filter(
                    (id: ObjectId) =>
                        !interestIds.some(deletedId => deletedId.equals(id))
                );

                if (updatedPuppyInterestIds.length === 0) {
                    // No interests left => delete conversation & its messages
                    await messages.deleteMany({
                        conversationId: convo._id
                    });
                    await conversations.deleteOne({ _id: convo._id });

                    console.log(`Deleted orphaned conversation ${convo._id}`);
                } else {
                    // Still has other interests, just update it
                    await conversations.updateOne(
                        { _id: convo._id },
                        { $set: { puppyInterestIds: updatedPuppyInterestIds } }
                    );

                    console.log(
                        `Updated conversation ${convo._id} to remove deleted puppyInterests`
                    );
                }
            }
        }

        console.log(
            `Deleted dog ${dogId}. Removed ${interestResult.deletedCount} puppyInterests, ${adoptionRequestResult.deletedCount} adoptionRequests, and cleaned up related conversations/messages.`
        );

        return NextResponse.json({
            success: true,
            message: "Dog and related data deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting dog:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
    }
}