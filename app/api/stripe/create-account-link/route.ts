// /app/api/stripe/create-account-link/route.ts

import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { DB_NAME } from "@/lib/constants";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { IUser } from "@/interfaces/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-06-30.basil",
});

export async function POST() {
    const session = await getServerSession();
    const email = session?.user?.email;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('user', user)

    const breederObjectId = new ObjectId(user.breederId);

    console.log('breederObjectId', breederObjectId);

    if (!breederObjectId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const breedersCollection = db.collection('breeders');
    const breeder = await breedersCollection.findOne({ _id: breederObjectId });

    console.log('breeder', breeder);

    if (!breeder) {
        return NextResponse.json({ error: 'No breeder found' }, { status: 404 });
    }

    let stripeAccountId = breeder.stripeAccountId;
    let payoutsEnabled = breeder.payoutsEnabled;

    if (stripeAccountId && payoutsEnabled) {
        return NextResponse.json({ message: 'Account already onboarded' });
    }

    if (!stripeAccountId) {
        const account = await stripe.accounts.create({
            type: 'standard',
            email: breeder.email,
        });

        // Immediately retrieve to get payouts_enabled
        const retrievedAccount = await stripe.accounts.retrieve(account.id);
        payoutsEnabled = account.payouts_enabled;

        // Save account ID to breeder record
        await breedersCollection.updateOne(
            { _id: breederObjectId },
            {
                $set: {
                    stripeAccountId: account.id,
                    payoutsEnabled: retrievedAccount.payouts_enabled,
                }
            }
        );

        const updatedBreeder = await breedersCollection.findOne({ _id: breederObjectId });
        console.log('Updated breeder:', updatedBreeder);

        stripeAccountId = account.id;
    } else {
        // Refresh payoutsEnabled status if the account already exists 
        const account = await stripe.accounts.retrieve(stripeAccountId);
        payoutsEnabled = account.payouts_enabled;

        await breedersCollection.updateOne(
            { _id: breederObjectId },
            { $set: { payoutsEnabled: account.payouts_enabled } }
        )
    }

    const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
}
