import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dogId } = await req.json();

    if (!dogId) {
        return NextResponse.json({ error: "Missing dogId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Toggle logic: add if not exists, remove if it does
    const user = await db.collection("users").findOne({ email: session.user.email });

    const favorites = user?.favorites || [];

    let updatedFavorites;

    if (favorites.includes(dogId)) {
        // Remove Favorite
        updatedFavorites = favorites.filter((id: string) => id !== dogId);
    } else {
        // Add Favorite
        updatedFavorites = [...favorites, dogId];
    }

    await db.collection("users").updateOne(
        { email: session.user.email },
        { $set: { favorites: updatedFavorites } }
    )

    return NextResponse.json({ success: true, favorites: updatedFavorites })
}