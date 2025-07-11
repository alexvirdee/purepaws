import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid adoption request ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const adoptionRequest = await db.collection("adoptionRequests").findOne({
      _id: new ObjectId(id),
    });

    if (!adoptionRequest) {
      return NextResponse.json({ message: "Adoption request not found." }, { status: 404 });
    }

    // Option 1: Soft-cancel → mark status
    await db.collection("adoptionRequests").updateOne(
      { _id: adoptionRequest._id },
      { $set: { status: "cancelled", cancelledAt: new Date() } }
    );

    // Option 2: If you prefer to fully delete:
    // const cancelResult = await db.collection("adoptionRequests").deleteOne({ _id: adoptionRequest._id });

    // Restore puppy interest to "pending"
    await db.collection("puppyInterests").updateOne(
      { _id: adoptionRequest.interestId },
      { $set: { status: "pending" } }
    );

    // Restore dog status to "available"
    await db.collection("dogs").updateOne(
      { _id: new ObjectId(adoptionRequest.dogId) },
      { $set: { status: "available" } }
    );

    return NextResponse.json(
      { message: "Deposit request cancelled successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CancelDeposit API] Error:", error);
    return NextResponse.json(
      { message: "Server error while cancelling deposit request." },
      { status: 500 }
    );
  }
}
