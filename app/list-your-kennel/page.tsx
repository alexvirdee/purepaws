import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions"; // adjust path!
import { redirect } from "next/navigation";

import ListYourKennelForm from "@/components/ListYourKennelForm";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";


const ListYourKennel = async () => {
    const session = await getServerSession(authOptions);

    let hasBreederApplication = false;
    let email = '';

    // If user is logged in and role is breeder → redirect to profile
    if (session?.user?.role === "breeder") {
        redirect("/profile");
    }

    if (session?.user?.email) {
        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const breeder = await db.collection("breeders").findOne({
            email: session.user.email
        });

        email = session.user.email;

        if (breeder) {
            hasBreederApplication = true;
        }
    }

    return <ListYourKennelForm email={email} hasBreederApplication={hasBreederApplication} />
}

export default ListYourKennel;