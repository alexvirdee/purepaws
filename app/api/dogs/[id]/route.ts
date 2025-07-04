import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        let param;
        param = await context.params;

        const dogId = param.id;

        console.log('do I have the dogId', dogId);

        // ✅ Validate ID
        if (!ObjectId.isValid(dogId)) {
            console.log('having an issue with the dogId it seems like..');
            
            return NextResponse.json(
                { error: "Invalid dog ID" },
                { status: 400 }
            );
        }

        // Validate dog JSON structure 
        const {
            name,
            breed,
            dob,
            gender,
            photo,
            description,
            price: rawPrice,
            status,
            location
        } = await req.json();

        const price = Number(rawPrice);

        console.log('dog details');
        console.log('name', name);
        console.log('breed', breed);
        console.log('dob', dob);
        console.log('gender', gender);
        console.log('photo', photo);
        console.log('price', price);
        console.log('status', status);

        if (!name || name.trim().length === 0) {
            console.log('issue with the name');

            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (!breed || breed.trim().length === 0) {
            console.log('issue with the breed');

            return NextResponse.json({ error: "Breed is required" }, { status: 400 });
        }

        if (dob && isNaN(Date.parse(dob))) {
            console.log('issue with the dob');

            return NextResponse.json({ error: "Invalid date of birth" }, { status: 400 });
        }

        if (!gender || gender.trim().length === 0) {
            console.log('issue with the gender edit');

            return NextResponse.json({ error: "Gender is required" }, { status: 400 });
        }

        // TODO: Handle issues with photo updates 
        // if (photo && !photo.startsWith("http")) {
        //     console.log('issue with the photo');

        //     return NextResponse.json({ error: "Invalid photo URL" }, { status: 400 });
        // }

        if (price && (typeof price !== "number" || price < 0)) {
            console.log('issue with the price');

            console.log('price', price);
            console.log('price type', typeof price);

            return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
        }

        if (status && !["available", "pending", "sold"].includes(status)) {
            console.log('issue with the status');

            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }


        const client = await clientPromise;
        const db = client.db("purepaws");
        const dogs = db.collection("dogs");

        const updateFields: any = {
            name: name.trim(),
            breed: breed.trim(),
            dob: dob || null,
            gender: gender.trim(),
            photo: photo || "",
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
        const db = client.db("purepaws");
        const dogs = db.collection("dogs");

        const result = await dogs.deleteOne({ _id: new ObjectId(dogId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Dog not found." }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Dog deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting dog:", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
    }
}