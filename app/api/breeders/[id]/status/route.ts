import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import { ObjectId } from "mongodb";
import type { Session } from "next-auth";
import type { UpdateResult } from "mongodb";

interface Params {
  id: string;
}

interface PostContext {
  params: Params;
}

export async function POST(
  req: NextRequest,
  { params }: PostContext
): Promise<NextResponse> {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { status } = await req.json();

  if (!["approved", "pending", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Update the breeder's status in the database
  const result: UpdateResult = await db
    .collection("breeders")
    .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { error: "Breeder not found or status unchanged" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: `Breeder status updated to ${status}.`,
  });
}