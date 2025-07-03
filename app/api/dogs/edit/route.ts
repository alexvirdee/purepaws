import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const dogId = params.id;

        if (!ObjectId.isValid(dogId)) {
            return NextResponse.json({ error: "Invalid dog ID" }, { status: 400 });
        }

        // Validate dog JSON structure 
        const {
            name,
            breed,
            dob,
            photo,
            description,
            price,
            status,
            location
        } = await req.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (!breed || breed.trim().length === 0) {
            return NextResponse.json({ error: "Breed is required" }, { status: 400 });
        }

        if (dob && isNaN(Date.parse(dob))) {
            return NextResponse.json({ error: "Invalid date of birth" }, { status: 400 });
        }

        if (photo && !photo.startsWith("http")) {
            return NextResponse.json({ error: "Invalid photo URL" }, { status: 400 });
        }

        if (price && (typeof price !== "number" || price < 0)) {
            return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
        }

        if (status && !["Available", "Pending", "Sold"].includes(status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }


        const client = await clientPromise;
        const db = client.db("purepaws");
        const dogs = db.collection("dogs");

        const updateFields: any = {
            name: name.trim(),
            breed: breed.trim(),
            dob: dob || null,
            photo: photo || "",
            description: description?.trim() || "",
            price: price || 0,
            status: status || "Available",
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