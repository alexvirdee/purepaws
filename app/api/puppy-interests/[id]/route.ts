import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const { status, message } = await req.json();

    const update: Record<string, any> = {};

    if (typeof status === 'string') {
        update.status = status;
    }

    if (typeof message === 'string') {
        update.message = message.trim();
    }

    if (status) update.status = status;
    if (message) update.message = message.trim();


    if (Object.keys(update).length === 0) {
        return NextResponse.json({ error: "No valid update fields provided." }, { status: 400 });
    }

    const interest = await db.collection("puppyInterests").findOne({ _id: new ObjectId(id) });
    if (!interest) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const userObjectId = user._id instanceof ObjectId ? user._id : new ObjectId(user._id);

    // Auth check:
    if (user.role === "breeder") {
        if (!interest.breederId.equals(user.breederId)) {
            console.log('issue is here..')
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    } else if (user.role === "buyer") {
        if (!interest.userId.equals(user._id)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    } else {
        return NextResponse.json({ error: "Unauthorized role" }, { status: 401 });
    }

    const result = await db.collection("puppyInterests").updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Puppy interest cancelled successfully." });
}