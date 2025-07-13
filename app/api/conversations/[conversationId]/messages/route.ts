import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;

    if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Optional: Check if conversation exists
    const conversation = await db.collection("conversations").findOne({
      _id: new ObjectId(conversationId)
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Optional: Verify that this user is part of this conversation
    // Example for breeder:
    if (session.user?.role === "breeder" && conversation.breederId.toString() !== session.user?.breederId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Example for buyer:
    if (session.user?.role === "viewer" && conversation.buyerId.toString() !== session.user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Find messages for this conversation
    const messages = await db.collection("messages")
      .find({ conversationId: new ObjectId(conversationId) })
      .sort({ createdAt: 1 })
      .toArray();

    // Map to plain JSON
    const serializedMessages = messages.map(msg => ({
      _id: msg._id.toString(),
      conversationId: msg.conversationId.toString(),
      senderId: msg.senderId?.toString(),
      senderRole: msg.senderRole,
      text: msg.text,
      createdAt: msg.createdAt?.toISOString(),
    }));

    return NextResponse.json({ messages: serializedMessages });

  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    console.log('session:', session);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;

    console.log('Received conversationId:', conversationId);

    if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 });
    }

    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const conversation = await db.collection("conversations").findOne({
      _id: new ObjectId(conversationId)
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Determine sender role
    const senderRole = session.user?.role || "viewer"; // Default to viewer if no role is provided

    if (!senderRole || !["breeder", "viewer"].includes(senderRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Insert new message
    const result = await db.collection("messages").insertOne({
      conversationId: new ObjectId(conversationId),
      senderId: session.user?.id,
      senderRole: senderRole,
      text: text.trim(),
      createdAt: new Date(),
    });

    // Update lastMessageAt on the conversation
    await db.collection("conversations").updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { lastMessageAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: {
        _id: result.insertedId.toString(),
        conversationId,
        senderId: session.user?.id,
        senderRole: senderRole,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
