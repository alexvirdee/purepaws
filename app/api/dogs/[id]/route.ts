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

export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const dogId = context.params.id;

        if (!ObjectId.isValid(dogId)) {
            return NextResponse.json({ error: "Invalid dog ID" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const dogs = db.collection("dogs");

        // Check if the dog had any user interests or adoptionRequests and remove them 
        const interests = db.collection("puppyInterests");
        const adoptionRequests = db.collection("adoptionRequests");

        const result = await dogs.deleteOne({ _id: new ObjectId(dogId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Dog not found." }, { status: 404 })
        }

        // DB Cleanup associated with the dog being deleted 
        // Delete any puppyInterests tied to this dog
        const interestResult = await db
            .collection("puppyInterests")
            .deleteMany({ dogId: new ObjectId(dogId) });

        // Delete any adoptionRequests tied to this dog
        const adoptionRequestResult = await db
            .collection("adoptionRequests")
            .deleteMany({ dogId: new ObjectId(dogId) });

        console.log(
            `Deleted dog ${dogId}. Removed ${interestResult.deletedCount} puppyInterests and ${adoptionRequestResult.deletedCount} adoptionRequests.`
        );


        return NextResponse.json({
            success: true,
            message: "Dog deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting dog:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
    }
}