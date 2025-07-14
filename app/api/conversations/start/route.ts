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

        // Does conversation already exist between the breeder and buyer?
        const existing = await db.collection("conversations").findOne({
            breederId: new ObjectId(breederId),
            buyerId: new ObjectId(buyerId)
        });

        if (existing) {
            // Only add puppyInterestId if it's not already in the array
            const alreadyLinked = existing.puppyInterestIds?.some(
                (id: ObjectId) => id.toString() === puppyInterestId
            );

            if (!alreadyLinked) {
                await db.collection("conversations").updateOne(
                    { _id: existing._id },
                    { $addToSet: { puppyInterestIds: new ObjectId(puppyInterestId) } }
                );
                return NextResponse.json({
                    conversationId: existing._id.toString(),
                    message: "Conversation already exists. Added new puppy interest.",
                });
            } else {
                return NextResponse.json({
                    conversationId: existing._id.toString(),
                    message: "Conversation already exists for this puppy interest.",
                });
            }
        }

        // Create new conversation
        const result = await db.collection("conversations").insertOne({
            breederId: new ObjectId(breederId),
            buyerId: new ObjectId(buyerId),
            puppyInterestIds: [new ObjectId(puppyInterestId)],
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