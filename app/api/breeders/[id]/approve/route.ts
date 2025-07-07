import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import type { Session } from "next-auth";
import type { WithId, Document, UpdateResult } from "mongodb";

interface Breeder extends Document {
    _id: ObjectId;
    status: string;
    // add other breeder fields if needed
}

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

    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Connect to the database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Approve the breeder by updating their status
    const result: UpdateResult = await db.collection<Breeder>("breeders").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "approved" } }
    );

    if (result.modifiedCount === 0) {
        return NextResponse.json({ error: "Breeder not found or already approved" }, { status: 404 });
    }

    return NextResponse.json({ message: "Breeder approved successfully" });
}