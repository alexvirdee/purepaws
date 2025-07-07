import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import BreederList from "@/components/admin/BreederList";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect('/'); // Redirect to home if not authenticated or not an admin
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Fetch breeders from the database
    const breeders = await db.collection("breeders").find().toArray();

    // Serialize the breeders to JSON and ensure all IBreeder fields are included
    const serializedBreeders = breeders.map(breeder => ({
        _id: breeder._id.toString(), // stays ObjectId because IBreeder expects ObjectId
        name: breeder.name,
        email: breeder.email,
        breeds: breeder.breeds,
        address: breeder.address,
        city: breeder.city,
        state: breeder.state,
        zip: breeder.zip,
        latitude: breeder.latitude,
        longitude: breeder.longitude,
        website: breeder.website || "",  // fallback if optional
        about: breeder.about,
        status: breeder.status,
        submittedAt: breeder.submittedAt,
    }));

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <h3 className="text-xl mb-4">Welcome, {session?.user?.name || 'Admin'}!</h3>
            <BreederList breeders={serializedBreeders} />
        </div>
    );
}