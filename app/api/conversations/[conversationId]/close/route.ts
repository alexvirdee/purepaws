import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request, { params }: { params: { conversationId: string } }) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const { conversationId } = await params;

   if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 });
    }

  await db.collection("conversations").updateOne(
    { _id: new ObjectId(conversationId) },
    { $set: { closed: true, closedAt: new Date() } }
  );

  return NextResponse.json({ success: true });
}
