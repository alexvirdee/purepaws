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
            const updates: any = {};

            // Reopen conversation if previously closed
            if (existing.closed) {
                updates.closed = false;
                updates.closedAt = null;
            }

            // Add puppyInterestId if not already present
            const alreadyLinked = existing.puppyInterestIds?.some(
                (id: ObjectId) => id.toString() === puppyInterestId
            );

            if (!alreadyLinked) {
                updates.$addToSet = {
                    puppyInterestIds: new ObjectId(puppyInterestId),
                };
            }

            if (Object.keys(updates).length > 0) {
                await db.collection("conversations").updateOne(
                    { _id: existing._id },
                    {
                        ...(updates.closed !== undefined && {
                            $set: {
                                closed: updates.closed,
                                closedAt: null,
                            },
                        }),
                        ...(updates.$addToSet && { $addToSet: updates.$addToSet }),
                    }
                );
            }

            return NextResponse.json({
                conversationId: existing._id.toString(),
                message: existing.closed
                    ? "Conversation was reopened."
                    : alreadyLinked
                        ? "Conversation already exists for this puppy interest."
                        : "Conversation already exists. Added new puppy interest.",
            });
        }

        // 1. Lookup buyer
        const buyer = await db.collection("users").findOne({ _id: new ObjectId(buyerId) });
        if (!buyer) {
            return NextResponse.json({ error: "Buyer not found." }, { status: 404 });
        }

        // 2. Lookup breeder
        const breeder = await db.collection("breeders").findOne({ _id: new ObjectId(breederId) });
        if (!breeder) {
            return NextResponse.json({ error: "Breeder not found." }, { status: 404 });
        }

        // 3. Lookup the puppyInterest and dog
        const puppyInterest = await db.collection("puppyInterests").findOne({ _id: new ObjectId(puppyInterestId) });
        if (!puppyInterest) {
            return NextResponse.json({ error: "Puppy interest not found." }, { status: 404 });
        }

        const dog = await db.collection("dogs").findOne({ _id: new ObjectId(puppyInterest.dogId) });
        if (!dog) {
            return NextResponse.json({ error: "Dog not found." }, { status: 404 });
        }

        // Create new conversation
        const result = await db.collection("conversations").insertOne({
            breederId: new ObjectId(breederId),
            buyerId: new ObjectId(buyerId),
            puppyInterestIds: [new ObjectId(puppyInterestId)],
            buyerEmail: buyer.email,
            buyerName: buyer.name,
            breederName: breeder.name,
            dogName: dog.name,
            newlyCreated: true,
            createdAt: new Date(),
            lastMessageAt: null,
        });

        return NextResponse.json({
            conversationId: result.insertedId.toString(),
            buyerEmail: buyer.email,
            buyerName: buyer.name,
            breederName: breeder.name,
            dogName: dog.name,
            message: "Conversation started successfully!",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}