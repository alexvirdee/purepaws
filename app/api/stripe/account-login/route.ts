import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { DB_NAME } from '@/lib/constants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST() {
  const session = await getServerSession();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Find the user first
  const user = await db.collection('users').findOne({ email });

  if (!user?.breederId) {
    return NextResponse.json({ error: 'User is not a breeder' }, { status: 403 });
  }

  const breeder = await db.collection('breeders').findOne({ _id: user.breederId });

  if (!breeder?.stripeAccountId) {
    return NextResponse.json({ error: 'Breeder not connected to Stripe' }, { status: 400 });
  }

  const stripeAccount = await stripe.accounts.retrieve(breeder.stripeAccountId);

  if (!stripeAccount.payouts_enabled) {
    return NextResponse.json({
      error: 'Stripe account is connected but not fully verified. Please complete onboarding.',
    }, { status: 403 });
  }

  const loginLink = await stripe.accounts.createLoginLink(breeder.stripeAccountId);

  return NextResponse.json({ url: loginLink.url });
}
