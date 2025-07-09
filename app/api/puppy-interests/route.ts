import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "You must be signed in to submit an application." },
                { status: 401 }
            );
        }

        const { dogId, breederId, puppyApplicationId, message } = await req.json();

        console.log("[API] Puppy Interest Request:", {
            dogId,
            breederId,
            puppyApplicationId,
            message
        });

        if (!dogId || !breederId || !puppyApplicationId) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Optional: check if user already submitted for this dog
        const user = await db.collection("users").findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const existing = await db.collection("puppyInterests").findOne({
            userId: user._id,
            dogId: new ObjectId(dogId)
        });

        if (existing) {
            return NextResponse.json(
                { error: "You have already submitted an application for this puppy." },
                { status: 400 }
            );
        }

        const result = await db.collection("puppyInterests").insertOne({
            userId: user._id,
            breederId: new ObjectId(breederId),
            puppyApplicationId: new ObjectId(puppyApplicationId),
            dogId: new ObjectId(dogId),
            message: message?.trim() || "",
            status: "pending",
            createdAt: new Date()
        });

        const hasFavorite = user.favorites?.includes(dogId);

        let removedFromFavorites = false;

        if (hasFavorite) {
            const updateResult = await db.collection("users").updateOne(
                { _id: user._id },
                { $pull: { favorites: dogId } }
            );

            if (updateResult.modifiedCount > 0) {
                removedFromFavorites = true;
            }
        }

        return NextResponse.json({ success: true, id: result.insertedId, removedFromFavorites }, { status: 201 });

    } catch (error) {
        console.error("[API] Puppy Interest Error:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}