import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";
import { Message } from "@/interfaces/message";
import { v2 as cloudinary } from "cloudinary";

const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3; // 3 days

export function generateSignedUrl(publicId: string, resourceType = "raw") {
  return cloudinary.url(publicId, {
    type: "authenticated",
    resource_type: resourceType,
    sign_url: true,
    expires_at: expiresAt
  });
}

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

    // Check that the conversation belongs to the user
    if (session?.user?.role === "viewer") {
      if (conversation?.buyerId.toString() !== session.user.id) {
        return NextResponse.json({ errror: "Unauthorized" }, { status: 401 });
      }
    } else if (session.user?.role === "breeder") {
      if (conversation?.breederId.toString() !== session.user.breederId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

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
      createdAt: msg.createdAt.toISOString(),
      fileName: msg.fileName || null,
      fileType: msg.fileType || null,
      filePublicId: msg.filePublicId,
      fileUrl: msg.filePublicId
        ? generateSignedUrl(msg.filePublicId, "raw")
        : null
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

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = await params;

    if (!ObjectId.isValid(conversationId)) {
      return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 });
    }

    const { text, fileUrl, fileName, fileType, filePublicId } = await req.json();

    // Basic validation: must have text OR fileUrl
    if (
      (!text || text.trim() === "") &&
      (!fileUrl || fileUrl.trim() === "")
    ) {
      return NextResponse.json(
        { error: "Message must have text or file" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const conversation = await db.collection("conversations").findOne({
      _id: new ObjectId(conversationId)
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Check that the conversation belongs to the user
    if (session?.user?.role === "viewer") {
      if (conversation?.buyerId.toString() !== session.user.id) {
        return NextResponse.json({ errror: "Unauthorized" }, { status: 401 });
      }
    } else if (session.user?.role === "breeder") {
      if (conversation?.breederId.toString() !== session.user.breederId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Determine sender role
    const senderRole = session.user?.role || "viewer"; // Default to viewer if no role is provided

    if (!senderRole || !["breeder", "viewer"].includes(senderRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const createdAt = new Date();

    // Insert new message
    const result = await db.collection("messages").insertOne({
      conversationId: new ObjectId(conversationId),
      senderId: session.user?.id,
      senderRole: senderRole,
      text: text.trim(),
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileType: fileType || null,
       filePublicId: filePublicId || null,
      createdAt
    });

    // Update lastMessageAt on the conversation
    await db.collection("conversations").updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { lastMessageAt: new Date() } }
    );

    // Return response using Message type
    const message: Message = {
      _id: result.insertedId.toString(),
      conversationId,
      senderId: session.user?.id,
      senderRole: senderRole,
      text: text.trim(),
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileType: fileType || null,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
