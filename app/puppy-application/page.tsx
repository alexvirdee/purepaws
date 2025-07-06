import PuppyApplicationForm from "@/components/PuppyApplicationForm";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import clientPromise from '@/lib/mongodb';
import { DB_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";

const PuppyApplication = async () => {
    const session = await getServerSession(authOptions);

     if (!session || !session.user?.email) {
    // If no session, redirect to sign in or home
    redirect("/auth/signin");
  }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let puppyApplication = null;

    // Check if logged in user has a puppy application and re-route them to /profile if so
    if (session?.user?.email) {
        puppyApplication = await db.collection("puppyApplications").findOne({
            email: session.user.email
        })
    }

    if (puppyApplication) {
        redirect('/profile');
    }

    return (
        <PuppyApplicationForm />
    );
};

export default PuppyApplication;