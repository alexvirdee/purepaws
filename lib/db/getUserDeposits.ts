import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";
import { ca } from "date-fns/locale";

export async function getUserDeposits(userId: string) {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/auth/signin");

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    console.log('userId:', userId);

    const deposits = await db
        .collection("adoptionRequests")
        .find({ userId: new ObjectId(userId), status: "deposit-paid" })
        .toArray();

    console.log('deposits:', deposits);

    const dogIds = deposits.map((d) => d.dogId);
    const dogs = await db.collection("dogs").find({ _id: { $in: dogIds } }).toArray();

    return deposits.map((deposit) => {
        const dog = dogs.find((d) => d._id.toString() === deposit.dogId.toString());

        return {
            ...deposit,
            _id: deposit._id.toString(),
            interestId: deposit.interestId ? deposit.interestId.toString() : null,
            dogId: deposit.dogId.toString(),
            breederId: deposit.breederId.toString(),
            userId: deposit.userId.toString(),
            status: deposit.status,
            paymentIntentId: deposit.paymentIntentId || null,
            paymentMethod: deposit.paymentMethod || null,
            createdAt: deposit.createdAt.toISOString(),
            expiresAt: deposit.expiresAt ? deposit.expiresAt.toISOString() : null,
            cancelledAt: deposit.cancelledAt ? deposit.cancelledAt.toISOString() : null,
            depositPaidAt: deposit.depositPaidAt ? deposit.depositPaidAt.toISOString() : null,
            dog: {
                _id: deposit.dogId.toString(),
                name: dog?.name || "Unknown",
                photoUrl: dog?.photos?.[0]?.path || "", // Safely grab first photo if exists
            },
            breederName: deposit.breederName || "",
            conversationId: deposit.conversationId || null,
        }
    })
}
