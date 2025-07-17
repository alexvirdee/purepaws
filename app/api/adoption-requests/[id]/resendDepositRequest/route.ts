import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid adoption request ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const adoptionRequest = await db.collection("adoptionRequests").findOne({
    _id: new ObjectId(id)
  });

  if (!adoptionRequest) {
    return NextResponse.json({ message: "Adoption request not found." }, { status: 404 });
  }

  // Update the existing request (or create a new one if you prefer)
  const updatedFields = {
    status: "deposit-requested",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // TODO: Update this to be dynamic
  };

  await db.collection("adoptionRequests").updateOne(
    { _id: adoptionRequest._id },
    { $set: updatedFields }
  );

  // Also update related puppy interest if needed
  // await db.collection("puppyInterests").updateOne(
  //   { _id: adoptionRequest.interestId },
  //   { $set: { status: "deposit-requested" } }
  // );

  // Also update dog status if needed
  await db.collection("dogs").updateOne(
    { _id: adoptionRequest.dogId },
    { $set: { status: "reserved" } }
  );

  return NextResponse.json({
    message: "Deposit request re-sent successfully",
    expiresAt: updatedFields.expiresAt
  }, { status: 200 });
}