import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Find the puppy interest
  const interest = await db.collection("puppyInterests").findOne({ _id: new ObjectId(id) });

  if (!interest) {
    console.error("[RequestDeposit API] Puppy interest not found for ID:", id);

    return NextResponse.json({ message: "Puppy interest was not found." }, { status: 404 });
  }

  // Check if there is already an adoption request for this interest
  const existingRequest = await db.collection("adoptionRequests").findOne({
    interestId: interest._id,
  });

  if (existingRequest) {
    return NextResponse.json(
      {
        message: "Deposit already requested for this interest.",
        adoptionRequestId: existingRequest._id,
        expiresAt: existingRequest.expiresAt,
        status: existingRequest.status,
      },
      { status: 400 }
    );
  }

  const body = await req.json();

  const { depositAmount, expiresAt, note } = body;

  const expirationDate = new Date(expiresAt);
  const now = new Date();

  // Ensure expiresAt is in the future
  if (expirationDate <= now) {
    return NextResponse.json(
      { message: "Invalid expiration date. Please provide a future date." },
      { status: 400 }
    );
  }

  console.log('depositAmount:', depositAmount);
  console.log('expiresAt:', expiresAt);
  console.log('note:', note);

  if (!depositAmount || !expiresAt) {
    return NextResponse.json(
      { message: "Deposit amount and expiration date are required." },
      { status: 400 }
    );
  }

  // Giving the user 7 days to complete the deposit request so they can ask questions, etc.   
  // Start a new conversation for the user to contact breeder 
  let conversation = await db.collection("conversations").findOne({
    puppyInterestIds: { $in: [interest._id] }
  });

if (!conversation) {
    const newConversationRes = await db.collection("conversations").insertOne({
      breederId: interest.breederId,
      buyerId: interest.userId,
      puppyInterestIds: [interest._id],
      dogId: interest.dogId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    conversation = {
      _id: newConversationRes.insertedId,
    };
  }


  // Create a new adoption request
  const adoptionRequest = {
    interestId: interest._id,
    dogId: interest.dogId,
    breederId: interest.breederId,
    userId: interest.userId,
    status: "deposit-requested",
    depositAmount,
    paymentIntentId: null, 
    paymentMethod: null, 
    conversationId: conversation._id,
    note: note || "",
    createdAt: new Date(),
    expiresAt: new Date(expiresAt),
  };

  const insertResult = await db.collection("adoptionRequests").insertOne(adoptionRequest);

  // Update puppy interest status if you want
  // Uncomment this if you want to update the interest status to "deposit-requested"
  // await db.collection("puppyInterests").updateOne(
  //   { _id: interest._id },
  //   { $set: { status: "deposit-requested" } }
  // );

  // Update the dog status to reserved if a deposit is requested 
  await db.collection("dogs").updateOne(
    { _id: new ObjectId(interest.dogId) },
    { $set: { 
      status: "reserved", 
      reservedAt: new Date(),
    } }
  );

  return NextResponse.json(
    {
      message: "Deposit requested created successfully",
      adoptionRequestId: insertResult.insertedId,
      conversationId: conversation._id.toString(),
      expiresAt: adoptionRequest.expiresAt,
    },
    { status: 200 });
}
