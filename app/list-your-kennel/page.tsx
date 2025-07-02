import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions"; // adjust path!
import { redirect } from "next/navigation";

import ListYourKennelForm from "@/components/ListYourKennelForm";


const ListYourKennel = async () => {
    const session = await getServerSession(authOptions);

    // If user is logged in and role is breeder → redirect to profile
    if (session?.user?.role === "breeder") {
        redirect("/profile");
    }

    return <ListYourKennelForm />
}

export default ListYourKennel;