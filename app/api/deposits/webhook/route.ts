import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-06-30.basil",
});

async function POST(req: NextRequest) {
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

    // Handle the event
    return NextResponse.json({ received: true });
}