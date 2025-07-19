import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { DB_NAME } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-06-30.basil",
});

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = req.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        const requestId = stripeSession.metadata?.requestId;

        if (!requestId) {
            return NextResponse.json({ error: "Missing requestId in session metadata" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Find the adoptionRequest
        const adoptionRequest = await db.collection('adoptionRequests').findOne({
            _id: new ObjectId(requestId),
        });

        if (!adoptionRequest) {
            return NextResponse.json({ error: "Adoption request not found" }, { status: 404 });
        }

        // Check if the user is authorized to view this request
        if (adoptionRequest.userId.toString() !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Now fetch the dog by ID if not embedded
        const dog = await db.collection('dogs').findOne({
            _id: new ObjectId(adoptionRequest.dogId),
        });

        if (!dog) {
            return NextResponse.json({ error: "Dog not found" }, { status: 404 });
        }


        return NextResponse.json({
            dogName: dog.name,
            requestId: adoptionRequest._id.toString(),
        });
    } catch (err: any) {
        console.error("Error in /api/deposit-success:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
