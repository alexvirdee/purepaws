import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, breed, status, price, photo, breederId } = body;

        console.log('did we get all the details')
        console.log('name', name)
        console.log('breed', breed)
        console.log('status', status)
        console.log('price', price)
        console.log('photo', photo)
        console.log('breederId', breederId)

        if (!name || !breed || !status || !price || !breederId) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("purepaws");
        const dogs = db.collection("dogs");

        // Insert a new dog
        const result = await dogs.insertOne({
            name: name.trim(),
            breed: breed.trim(),
            status: status.trim(),
            price: Number(price),
            photo: photo || "",
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