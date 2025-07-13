import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";
import { getUserFavorites } from "@/lib/db/getUserFavorites";

export async function getUserProfileData() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin");

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const user = await db.collection("users").findOne({
        email: session.user?.email,
    });

    if (!user) redirect("/auth/signin");

    // Parallel queries:
    const [breeder, favoriteDogs, puppyApplication, puppyInterests, adoptionRequests] = await Promise.all([
        db.collection("breeders").findOne({ email: user.email }),
        getUserFavorites(user.email),
        db.collection("puppyApplications").findOne({ userId: user._id }),
        db.collection("puppyInterests").find({ userId: user._id }).toArray(),
        db.collection("adoptionRequests").find({ userId: user._id }).toArray(),
    ]);

    // Dogs for adoptionRequests and puppyInterests
    const adoptionRequestDogIds = adoptionRequests.map((r) => r.dogId);
    const puppyInterestDogIds = puppyInterests.map((p) => p.dogId);
    const dogIds = [...new Set([...adoptionRequestDogIds, ...puppyInterestDogIds])];

    const dogs = dogIds.length > 0
        ? await db.collection("dogs").find({ _id: { $in: dogIds.map(id => new ObjectId(id)) } }).toArray()
        : [];

    // Serialize everything:
    const serializedBreeder = breeder ? {
        ...breeder,
        _id: breeder._id.toString(),
        status: breeder.status || "pending",
        about: breeder.about || "",
        approvedAt: breeder.approvedAt?.toString() || null,
        createdAt: breeder.createdAt?.toString() || null,
        updatedAt: breeder.updatedAt?.toString() || null,
    } : null;

    const serializedPuppyApplication = puppyApplication ? {
        ...puppyApplication,
        _id: puppyApplication._id.toString(),
        userId: puppyApplication.userId?.toString(),
        name: puppyApplication.name || "",
        email: puppyApplication.email || "",
        city: puppyApplication.city || "",
        state: puppyApplication.state || "",
        zip: puppyApplication.zip || "",
        createdAt: puppyApplication.createdAt?.toString(),
        updatedAt: puppyApplication.updatedAt?.toString(),
    } : null;

    const adoptionRequestsWithDogs = adoptionRequests.map((req) => {
        const dog = dogs.find(d => d._id.toString() === req.dogId.toString());
        return {
            ...req,
            _id: req._id.toString(),
            dog: dog ? {
                _id: dog._id.toString(),
                name: dog.name,
                photos: dog.photos || [],
                breed: dog.breed,
                status: dog.status,
                price: dog.price,
            } : null,
        };
    });

    const puppyInterestRequests = await Promise.all(
        puppyInterests.map(async (interest) => {
            const dog = dogs.find(d => d._id.toString() === interest.dogId.toString());

            const conversation = await db.collection("conversations").findOne({
                puppyInterestId: interest._id
            });

            return {
                ...interest,
                _id: interest._id.toString(),
                userId: interest.userId?.toString(),
                breederId: interest.breederId?.toString(),
                puppyApplicationId: interest.puppyApplicationId?.toString(),
                dogId: interest.dogId?.toString(),
                createdAt: interest.createdAt?.toString(),
                updatedAt: interest.updatedAt?.toString(),
                conversationId: conversation?._id.toString() || null,
                dog: dog ? {
                    _id: dog._id.toString(),
                    name: dog.name,
                    photos: dog.photos || [],
                    breed: dog.breed,
                    status: dog.status,
                    price: dog.price,
                } : null,
            };
        })
    )

    return {
        user,
        breeder: serializedBreeder,
        favoriteDogs,
        puppyApplication: serializedPuppyApplication,
        puppyInterests: puppyInterestRequests,
        adoptionRequests: adoptionRequestsWithDogs,
    };
}
