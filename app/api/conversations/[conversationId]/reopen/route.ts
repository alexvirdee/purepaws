import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { DB_NAME } from "@/lib/constants";
import { ObjectId } from "mongodb";

export async function PATCH(req: Request, { params }: { params: { conversationId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const { conversationId } = params;

  if (!ObjectId.isValid(conversationId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const result = await db.collection("conversations").updateOne(
    { _id: new ObjectId(conversationId) },
    { $set: { closed: false }, $unset: { closedAt: "" } }
  );

  return NextResponse.json({ success: true });
}
