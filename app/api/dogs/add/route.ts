import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, litter, breed, dob, gender, status, description, price, photos, breederId } = body;

        // Collect missing fields in an array for a clear response
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!breed) missingFields.push("breed");
        if (!dob) missingFields.push("dob");
        if (!gender) missingFields.push("gender");
        if (!status) missingFields.push("status");
        if (!price) missingFields.push("price");
        if (!description) missingFields.push("description");
        if (!breederId) missingFields.push("breederId");

        if (name.length > 30) {
            return NextResponse.json(
                { error: "Dog name cannot be longer than 30 characters." },
                { status: 400 }
            );
        }

        if (missingFields.length > 0) {
            console.warn("[API] Add Dog: Missing required fields:", missingFields);
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        if (photos && !Array.isArray(photos)) {
            return NextResponse.json(
                { error: "Photos must be an array." },
                { status: 400 }
            );
        }


        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const dogs = db.collection("dogs");

        const newDog = {
            name: name.trim(),
            litter: litter?.trim() || "",
            breed: breed.trim(),
            dob,
            gender,
            status: status.trim(),
            price: Number(price),
            description: description.trim(),
            photos: photos || [],
            breederId: new ObjectId(breederId),
            createdAt: new Date(),
        };

        console.log("[API] Add Dog:", JSON.stringify(newDog, null, 2));

        // Insert a new dog
        const result = await dogs.insertOne(newDog);

        return NextResponse.json({
            success: true,
            id: result.insertedId,
            message: "Dog added successfully!"
        })
    } catch (error) {
        console.error("[API] Add Dog:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}