import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";
import { redirect } from "next/navigation";
import { ObjectIdLike } from "bson";

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
    const allInterestIds = conversations.flatMap(c => c.puppyInterestIds || []);

    const puppyInterests = await db.collection("puppyInterests").find({
        _id: { $in: allInterestIds }
    }).toArray();

    const buyers = await db.collection("users")
        .find({ _id: { $in: buyerIds } })
        .toArray();

    const dogIds = puppyInterests.map(pi => pi.dogId);
    const dogs = await db.collection("dogs")
        .find({ _id: { $in: dogIds } })
        .toArray();

    // 4) Attach each conversation’s puppyInterests + dog details
    const enriched = conversations.map(c => {
        const interests = (c.puppyInterestIds || []).map(id =>
            puppyInterests.find(pi => pi._id.equals(id))
        ).filter(Boolean);

        const dogsForThis = interests.map((interest: { dogId: string | ObjectId | ObjectIdLike | null | undefined; }) =>
            dogs.find(d => d._id.equals(interest?.dogId))
        ).filter(Boolean);

        const buyer = buyers.find(b => b._id.equals(c.buyerId));

        return {
            _id: c._id.toString(),
            breederId: c.breederId.toString(),
            buyerId: c.buyerId.toString(),
            buyerName: buyer?.name || "Unknown",
            puppyInterestIds: (c.puppyInterestIds || []).map((id: { toString: () => any; }) => id.toString()),
            createdAt: c.createdAt?.toISOString() || null,
            lastMessageAt: c.lastMessageAt?.toISOString() || null,
            closed: c.closed || false,
            closedAt: c.closedAt ? new Date(c.closedAt).toISOString() : null,
            puppyInterests: interests.map((pi: { _id: { toString: () => any; }; dogId: { toString: () => any; }; message: any; status: any; }) => ({
                _id: pi._id.toString(),
                dogId: pi.dogId.toString(),
                message: pi.message,
                status: pi.status
            })),
            dogs: dogsForThis.map((dog: { _id: { toString: () => any; }; name: any; }) => ({
                _id: dog._id.toString(),
                name: dog.name
            }))
        }
    });

    return enriched;
}
