import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";
import { User as UserIcon } from "lucide-react";

import AddEditDogDialog from "@/components/AddEditDogDialog";
import BreederApprovalBanner from "@/components/breeders/BreederApprovalBanner";
import BreederDogsTable from "@/components/breeder-dashboard/BreederDogsTable";

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
            name: breeder.name || "Unknown Breeder",
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

    const puppyInterests = await db
        .collection("puppyInterests")
        .find({ breederId: new ObjectId(breederId) })
        .toArray();

    // Get unique dog IDs in these requests
    const puppyInterestDogIds = puppyInterests.map(interest => interest.dogId);

    const dogsForInterests = await db.collection("dogs")
        .find({ _id: { $in: puppyInterestDogIds } })
        .toArray();

    const puppyInterestUserIds = puppyInterests.map(interest => interest.userId);

    const usersForInterests = await db.collection("users")
        .find({ _id: { $in: puppyInterestUserIds } })
        .toArray();

    const adoptionRequests = puppyInterests.map(interest => {
        const dog = dogsForInterests.find(d => d._id.toString() === interest.dogId.toString());
        const buyer = usersForInterests.find(u => u._id.toString() === interest.userId.toString());

        return {
            _id: interest._id.toString(),
            dog: dog ? {
                _id: dog._id.toString(),
                name: dog.name || "Unknown",
                photos: dog.photos || [],
                breed: dog.breed || "Unknown",
            } : null,
            buyer: buyer ? {
                _id: buyer._id.toString(),
                name: buyer.name || "Unknown Buyer",
                email: buyer.email || "",
            } : null,
            message: interest.message || "",
            status: interest.status || "pending",
            createdAt: interest.createdAt ? interest.createdAt.toISOString() : null,
        };
    });

    return (
        <main className="max-w-5xl mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-3xl font-bold">
                    <UserIcon className="w-8 text-gray-700" /> Breeder Dashboard
                </div>
                {/* Breeder action buttons */}
                <div className="flex flex-row justify-end">
                    <AddEditDogDialog mode="add" breederId={breederId} />
                </div>
            </div>

            {serializedBreeder && serializedBreeder?.status === "approved" && (
                <BreederApprovalBanner breeder={serializedBreeder} />
            )}


            {/* My Dogs - using dog card with actions currently */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{serializedBreeder?.name} Dogs</h2>
                </div>

                {serializedDogs.length > 0 ? (
                    <BreederDogsTable breederName={serializedBreeder?.name} dogs={serializedDogs} />
                ) : (
                    <p className="text-gray-500">
                        You haven't listed any dogs yet. Click "Add Dog" to get started!
                    </p>
                )}
            </div>

            {/* Adoption Requests */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-2">Adoption Requests</h2>
                {adoptionRequests.length > 0 ? (
                    adoptionRequests.map((request) => (
                        <div key={request._id} className="border p-4 rounded">
                            <div className="flex items-center gap-4">
                                {request.dog?.photos?.[0]?.path && (
                                    <img src={request.dog.photos[0].path} alt={request.dog.name} className="w-20 h-20 object-cover rounded" />
                                )}
                                <div>
                                    <h3 className="font-semibold">{request.dog?.name}</h3>
                                    <p className="text-sm text-gray-500">From: {request.buyer?.name} ({request.buyer?.email})</p>
                                    <p className="text-sm text-gray-500">Status: {request.status}</p>
                                    <p className="text-sm">{request.message}</p>
                                    <p className="text-xs text-gray-400">Submitted: {request.createdAt?.split('T')[0]}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No adoption requests yet.</p>
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