import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-06-30.basil",
});


export async function POST(req: NextRequest) {
    try {
        const { requestId, dogName, amount, buyerEmail, breederStripeAccountId } = await req.json();

        const PLATFORM_FEE_PERCENT = 0; // Update to 0.05 when ready to charge platform fee of 5%
        // Calculate the application fee if platform fee is enabled
        const applicationFee = Math.round(amount * PLATFORM_FEE_PERCENT);

        if (!requestId || !dogName || !amount || !buyerEmail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Create the Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: buyerEmail,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: amount, // amount in cents
                        product_data: {
                            name: `Deposit for ${dogName}`,
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                requestId, // Critical for your webhook to link payment to the adoptionRequest
            },
            payment_intent_data: {
                ...(PLATFORM_FEE_PERCENT > 0 && { application_fee_amount: applicationFee }),
                //  Always required to route the funds to the breeders account
                transfer_data: {
                    destination: breederStripeAccountId, // Breeder's Stripe account ID
                }
            },
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success/deposit?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile/requests`,
        });

        console.log("Created Checkout Session:", session.id);

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("❌ Error creating checkout session:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}