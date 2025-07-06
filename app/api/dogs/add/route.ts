import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, litter, breed, dob, gender, status, price, photos, breederId } = body;

        // Note - litter name is not required 
        if (!name || !breed || !dob || !gender || !status || !price || !breederId) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const dogs = db.collection("dogs");

        // Insert a new dog
        const result = await dogs.insertOne({
            name: name.trim(),
            litter: litter.trim(),
            breed: breed.trim(),
            dob: dob || null,
            gender: gender || "",
            status: status.trim(),
            price: Number(price),
            photos: photos || [],
            breederId: new ObjectId(breederId),
            createdAt: new Date(),
        });

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