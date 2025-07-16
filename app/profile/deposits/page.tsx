import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getUserDeposits } from "@/lib/db/getUserDeposits";
import DepositsList from "@/components/profile/DepositsList";
import { DB_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function DepositsPage() {
  const session = await getServerSession();

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const user = await db.collection("users").findOne({
    email: session?.user.email
  });

  if (!user) {
    redirect("/auth/signin")
  }

  const userId = user._id.toString();

  const deposits = await getUserDeposits(userId);

  console.log('deposits', deposits);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link className="text-blue-500 hover:text-blue-600 flex items-center gap-2 mb-4" href="/profile">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Profile
      </Link>
      <h1 className="text-2xl font-bold mb-4">Your Reserved Puppies</h1>
      <DepositsList deposits={deposits} />
    </div>
  );
}
