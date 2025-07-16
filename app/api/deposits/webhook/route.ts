import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { DB_NAME } from "@/lib/constants";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        const rawBody = await req.text();

        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error("Webhook signature verification failed:", error.message);
        return NextResponse.json(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Update db after checkout is complete 
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const requestId = session.metadata?.requestId;
        const paymentIntentId = session.payment_intent as string;
        const paymentMethod = session.payment_method_types?.[0];
        
        if (!requestId || !paymentIntentId) {
            console.error("Missing metadata in session:", session);
            return NextResponse.json("Missing metadata in session", { status: 400 });
        }

        try {
            const client = await clientPromise;
            const db = client.db(DB_NAME);

            const result = await db.collection('adoptionRequests').updateOne(
                { _id: new ObjectId(requestId) },
                {
                    $set: {
                        status: "deposit-paid",
                        paymentIntentId: paymentIntentId,
                        paymentMethod: paymentMethod,
                        depositPaidAt: new Date(),
                    },
                }
            );

            if (result.modifiedCount === 1) {
                console.log(`Updated adoptionRequest ${requestId} to deposit-paid`)
            } else {
                console.warn(`No adoptionRequest found for ${requestId}`);
            }
        } catch (error) {
            console.error(`DB Update Error`, error);
        }
    }

    // Handle the event
    return NextResponse.json({ received: true });
}