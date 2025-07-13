import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const breederId = session.user?.breederId;
  if (!breederId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const conversations = await db
      .collection("conversations")
      .find({ breederId: new ObjectId(breederId) })
      .toArray();

    const buyerIds = conversations.map(c => c.buyerId);
    const puppyInterestIds = conversations.map(c => c.puppyInterestId);

    const buyers = await db.collection("users")
      .find({ _id: { $in: buyerIds } })
      .toArray();

    const puppyInterests = await db.collection("puppyInterests")
      .find({ _id: { $in: puppyInterestIds } })
      .toArray();

    const dogIds = puppyInterests.map(pi => pi.dogId);
    const dogs = await db.collection("dogs")
      .find({ _id: { $in: dogIds } })
      .toArray();

    const result = conversations.map(c => {
      const buyer = buyers.find(b => b._id.equals(c.buyerId));
      const interest = puppyInterests.find(pi => pi._id.equals(c.puppyInterestId));
      const dog = dogs.find(d => d._id.equals(interest?.dogId));

      return {
        _id: c._id.toString(),
        breederId: c.breederId.toString(),
        buyerId: c.buyerId.toString(),
        puppyInterestId: interest?._id.toString() || null,
        buyerName: buyer?.name || "Unknown",
        dogName: dog?.name || "Unknown",
        lastMessageAt: c.lastMessageAt ? c.lastMessageAt.toISOString() : null,
      };
    });

    return NextResponse.json({ conversations: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
