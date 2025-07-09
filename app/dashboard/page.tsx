import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";
import { User as UserIcon } from "lucide-react";

import AddEditDogDialog from "@/components/AddEditDogDialog";
import DogCard from "@/components/DogCard";
import BreederApprovalBanner from "@/components/breeders/BreederApprovalBanner";

interface SerializedDog {
    _id: string;
    photos: { path: string;[key: string]: any }[];
    name: string;
    breed: string;
    status: string;
    price: number;
    location: string;
    description: string;
    createdAt: string | null;
    updatedAt: string | null;
    [key: string]: any;
}

export default async function BreederDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const user = await db.collection("users").findOne({ email: session.user?.email });
    const role = user?.role || "";
    const breederId = user?.breederId ? user.breederId.toString() : null;

    if (role !== "breeder" || !breederId) {
        redirect("/profile"); // only breeders allowed
    }

    const breeder = await db.collection("breeders").findOne({ _id: new ObjectId(breederId) });

    const serializedBreeder = breeder
        ? {
            ...breeder,
            status: breeder.status || "pending",
            _id: breeder._id.toString(),
            approvedAt: breeder.approvedAt ? breeder.approvedAt.toString() : null,
        }
        : null;

    const dogs = await db
        .collection("dogs")
        .find({ breederId: new ObjectId(breederId) })
        .toArray();

    // Serialize the dogs to ensure compatibility with client side components
    const serializedDogs: SerializedDog[] = JSON.parse(JSON.stringify(dogs)).map((dog: IDog): SerializedDog => ({
        ...dog,
        _id: dog._id.toString(), // convert ObjectId to a string
        photos: dog.photos || [], // ensure photos property exists
        name: dog.name || "Unknown", // ensure name property exists
        breed: dog.breed || "Unknown", // ensure breed property exists
        status: dog.status || "Unknown", // ensure status property exists
        price: dog.price || 0, // ensure price property exists
        location: dog.location || "Unknown", // ensure location property exists
        dob: dog.dob || "Unknown", // ensure dob property exists
        gender: dog.gender || "Unknown", // ensure gender property exists
        description: dog.description || "No description available", // ensure description property exists
        createdAt: dog.createdAt ? dog.createdAt.toString() : null,
        updatedAt: dog.updatedAt ? dog.updatedAt.toString() : null
    }));

    return (
        <main className="max-w-5xl mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-3xl font-bold">
                    <UserIcon className="w-8 text-gray-700" /> Breeder Dashboard
                </div>
            </div>

            {serializedBreeder && serializedBreeder?.status === "approved" && (
                <BreederApprovalBanner breeder={serializedBreeder} />
            )}

            {/* ✅ My Dogs */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">My Dogs</h2>
                    <AddEditDogDialog mode="add" breederId={breederId} />
                </div>

                {serializedDogs.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {serializedDogs.map((dog) => (
                            <DogCard key={dog._id} dog={dog} loggedInUser={breederId} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">
                        You haven't listed any dogs yet. Click "Add Dog" to get started!
                    </p>
                )}
            </div>

            {/* ✅ Upcoming Litters */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-2">Upcoming Litters</h2>
                <p className="text-gray-500">
                    Coming soon: Manage upcoming litters with estimated due dates and notify families.
                </p>
            </div>
        </main>
    );
}