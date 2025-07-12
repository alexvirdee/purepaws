import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function getBreederDashboardData({
    includeDogs = false,
    includeInterests = false,
}: {
    includeDogs?: boolean;
    includeInterests?: boolean;
} = {}) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin");

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const user = await db.collection("users").findOne({ email: session.user?.email });
    const breederId = user?.breederId?.toString();

    if (!user || !breederId) redirect("/profile");

    // Always fetch the breeder 
    const breeder = await db.collection("breeders").findOne({ _id: new ObjectId(breederId) });

    const serializedBreeder = {
        ...breeder,
        name: breeder?.name || "Unknown Breeder",
        status: breeder?.status || "pending",
        _id: breeder?._id.toString(),
        approvedAt: breeder?.approvedAt ? breeder.approvedAt.toString() : null,
    };

    const result: any = {
        breeder: serializedBreeder,
    };


    // Dogs
    if (includeDogs) {
        const dogs = await db.collection("dogs").find({ breederId: new ObjectId(breederId) }).toArray();
        const serializedDogs = JSON.parse(JSON.stringify(dogs)).map((dog: any) => ({
            ...dog,
            _id: dog._id.toString(),
        }));

        result.dogs = serializedDogs;
        result.totalDogs = serializedDogs.length;
    }

    if (includeInterests) {
        // Puppy Interests
        const puppyInterests = await db
            .collection("puppyInterests")
            .find({ breederId: new ObjectId(breederId) })
            .toArray();

        // Adoption Requests
        const adoptionRequests = await db
            .collection("adoptionRequests")
            .find({ breederId: new ObjectId(breederId) })
            .toArray();

        // Dog & User refs for interests
        const puppyInterestDogIds = puppyInterests.map((interest) => interest.dogId);
        const puppyInterestUserIds = puppyInterests.map((interest) => interest.userId);

        const dogsForInterests = await db.collection("dogs").find({ _id: { $in: puppyInterestDogIds } }).toArray();
        const usersForInterests = await db.collection("users").find({ _id: { $in: puppyInterestUserIds } }).toArray();

        // Users puppy application 
        const puppyApplications = await db.collection("puppyApplications")
            .find({ userId: { $in: puppyInterestUserIds } })
            .toArray();

        const interests = puppyInterests.map((interest) => {
            const dog = dogsForInterests.find((d) => d._id.toString() === interest.dogId.toString());

            const buyerInterest = usersForInterests.find((u) => u._id.toString() === interest.userId.toString());

            const buyerApp = puppyApplications.find(
                (app) => app.userId.toString() === interest.userId.toString()
            );

            const adoptionRequest = adoptionRequests.find(
                (ar) => ar.interestId.toString() === interest._id.toString()
            );

            return {
                _id: interest._id.toString(),
                adoptionRequestId: adoptionRequest?._id.toString() || null,
                dog: dog
                    ? {
                        _id: dog._id.toString(),
                        name: dog.name || "Unknown",
                        photos: dog.photos || [],
                        breed: dog.breed || "Unknown",
                    }
                    : null,
                buyer: buyerInterest
                    ? {
                        _id: buyerInterest._id.toString(),
                        name: buyerInterest.name || "Unknown Buyer",
                        email: buyerInterest.email || "",
                        city: buyerApp?.city || "",
                        state: buyerApp?.state || "",
                        age: buyerApp?.age || "",
                        petsOwned: buyerApp?.petsOwned || "",
                        hasChildren: buyerApp?.hasChildren || "",
                        puppyPreference: buyerApp?.puppyPreference || "",
                        genderPreference: buyerApp?.genderPreference || "",
                        trainingPlanned: buyerApp?.trainingPlanned || "",
                        desiredTraits: buyerApp?.desiredTraits || "",
                        additionalComments: buyerApp?.additionalComments || "",
                    }
                    : null,
                message: interest.message || "",
                status: interest.status || "pending",
                createdAt: interest.createdAt ? interest.createdAt.toISOString() : null,
            };
        });

        result.interests = interests;
        result.totalPuppyInterests = puppyInterests.length;
        result.totalRequestsSent = adoptionRequests.length;
    }

    return result;
}