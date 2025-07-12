import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  User must be a breeder to start a conversation currently
    const breederId = session.user?.breederId;

    if (!breederId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { buyerId, puppyInterestId } = await req.json();

        if (!breederId || !buyerId || !puppyInterestId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Does conversation already exist for this interest?
        const existing = await db.collection("conversations").findOne({
            breederId: new ObjectId(breederId),
            buyerId: new ObjectId(buyerId),
            puppyInterestId: new ObjectId(puppyInterestId),
        });

        if (existing) {
            return NextResponse.json({ conversationId: existing._id.toString(), message: "Conversation already exists." });
        }

        // Create new conversation
        const result = await db.collection("conversations").insertOne({
            breederId: new ObjectId(breederId),
            buyerId: new ObjectId(buyerId),
            puppyInterestId: new ObjectId(puppyInterestId),
            createdAt: new Date(),
            lastMessageAt: null,
        });

        return NextResponse.json({
            conversationId: result.insertedId.toString(),
            message: "Conversation started successfully!",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}