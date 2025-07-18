import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import { IAdoptionRequest } from "@/interfaces/adoptionRequests";

export async function getAdminAdoptionRequests() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect("/auth/signin");
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const adoptionrequests = await db.collection("adoptionRequests").find().toArray();

    return adoptionrequests.map((a): IAdoptionRequest => ({
        _id: a._id.toString(),
        interestId: a.interestId ? a.interestId.toString() : null,
        dogId: a.dogId.toString(),
        breederId: a.breederId.toString(),
        userId: a.userId.toString(),
        depositAmount: a.depositAmount,
        paymentIntentId: a.paymentIntentId || null,
        paymentMethod: a.paymentMethod || null,
        note: a.note || "",
        status: a.status || "pending",
        expiresAt: a.expiresAt ? a.expiresAt.toString() : new Date().toISOString(),
        createdAt: a.createdAt ? a.createdAt.toString() : new Date().toISOString(),
        updatedAt: a.updatedAt ? a.updatedAt.toString() : new Date().toISOString()
    }));
}
