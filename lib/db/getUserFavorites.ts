import clientPromise from "../mongodb";
import { ObjectId } from "mongodb";
import { Dog } from "@/interfaces/dog";

export async function getUserFavorites(userEmail: string): Promise<Dog[]> {
    const client = await clientPromise;
    const db = client.db("purepaws");

    // Get the user doc
    const user = await db.collection("users").findOne({ email: userEmail });

    if (!user || !user.favorites || user.favorites.length === 0) {
        return [];
    }

    // Look up favorite dogs by their IDs
    const favorites = await db
        .collection<Dog>("dogs")
        .find({ _id: { $in: user.favorites.map((id: string) => new ObjectId(id)) } })
        .toArray();

    // Make sure favorites is plain JSON before returning
    return favorites.map((dog) => ({
        ...dog,
        _id: dog._id.toString(),
    })) as Dog[];
}