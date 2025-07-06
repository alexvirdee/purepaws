import clientPromise from "../mongodb";
import { ObjectId } from "mongodb";
import { IDog } from "@/interfaces/dog";
import { DB_NAME } from "../constants";

export async function getUserFavorites(userEmail: string): Promise<IDog[]> {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get the user doc
    const user = await db.collection("users").findOne({ email: userEmail });

    if (!user || !user.favorites || user.favorites.length === 0) {
        return [];
    }

    // Look up favorite dogs by their IDs
    const favorites = await db
        .collection("dogs")
        .find({ _id: { $in: user.favorites.map((id: string) => new ObjectId(id)) } })
        .toArray();

    // Make sure favorites is plain JSON before returning
    return favorites.map((dog) => ({
        _id: dog._id.toString(),
        name: dog.name || "",
        photos: dog.photos || [],
        breed: dog.breed || "",
        location: dog.location || "",
        status: dog.status || "",
        price: dog.price || 0,
        description: dog.description || "",
        breederId: dog.breederId?.toString?.() ?? null,
        dob: dog.dob ? dog.dob.toISOString?.() ?? dog.dob : null,
      }));
}