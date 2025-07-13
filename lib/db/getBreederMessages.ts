import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";

export async function getBreederMessages() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin");

    const breederId = session.user?.breederId;
    if (!breederId) redirect("/dashboard");

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get all conversations for this breeder
    const conversations = await db.collection("conversations")
        .find({ breederId: new ObjectId(breederId) })
        .toArray();

    // For each, you might want to pull the buyer & dog data
    const buyerIds = conversations.map(c => c.buyerId);
    const puppyInterestIds = conversations.map(c => c.puppyInterestId);

    const buyers = await db.collection("users")
        .find({ _id: { $in: buyerIds } })
        .toArray();

    const puppyInterests = await db.collection("puppyInterests")
        .find({ _id: { $in: puppyInterestIds } })
        .toArray();

    const dogIds = puppyInterests.map(pi => pi.dogId);
    const dogs = await db.collection("dogs")
        .find({ _id: { $in: dogIds } })
        .toArray();

    return conversations.map(c => {
        const buyer = buyers.find(b => b._id.equals(c.buyerId));
        const interest = puppyInterests.find(pi => pi._id.equals(c.puppyInterestId));
        const dog = dogs.find(d => d._id.equals(interest?.dogId));

        return {
            _id: c._id.toString(),
            breederId: c.breederId.toString(),
            buyerId: c.buyerId.toString(),
            puppyInterestId: interest?._id.toString() || null,
            buyerName: buyer?.name || "Unknown",
            dogName: dog?.name || "Unknown",
            lastMessageAt: c.lastMessageAt ? c.lastMessageAt.toISOString() : null,
        };
    });
}
