import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import DogCard from "@/components/DogCard";
import { ObjectId } from "mongodb";

interface Params {
    params: { id: string }; // litterName from URL 
}

export default async function LitterDetailPage({ params }: Params) {
    const session = await getServerSession(authOptions);

    const { id } = await params;

    if (!session || session.user?.role !== "breeder") {
        // TODO: Throw unauthorized error
        return notFound();
    }

    const litterName = decodeURIComponent(id).trim();

    const client = await clientPromise;
    const db = client.db("purepaws");

    const userFromDb = await db.collection("users").findOne({
        email: session?.user?.email
    });

    const breederId = userFromDb?.breederId ? userFromDb?.breederId.toString() : null;

    // Find the dogs with this litter name and breederId
    // Fetch the list of dogs for the breeder if any
    const dogs = breederId
        ? await db
            .collection("dogs")
            .find({
                breederId: ObjectId.isValid(breederId) ? new ObjectId(breederId) : breederId,
                litter: litterName
            })
            .toArray()
        : [];

    const serializedDogs = dogs.map(dog => ({
        ...dog,
        _id: dog._id.toString(),
        breederId: dog.breederId?.toString?.() || null,
        createdAt: dog.createdAt?.toISOString?.() || null,
    }));

    if (!serializedDogs.length) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Litter: {litterName}</h1>
                <p className="text-gray-600">No dogs found for this litter.</p>
            </div>
        )
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Litter: {litterName}</h1>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serializedDogs.map((dog) => (
                    <DogCard
                        key={dog._id.toString()}
                        dog={{ ...(dog as any), _id: dog._id.toString() }}
                        loggedInUser={breederId}
                    />
                ))}
            </ul>
        </div>
    )
}