import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import MapWrapper from "@/components/MapWrapper";

interface RawBreeder {
    _id: any; // MongoDB ObjectId
    [key: string]: any; // Add additional fields as needed
}

export default async function MapView() {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Retrieve approved breeders from the database
    const breeders = await db.
        collection("breeders")
        .find({ status: "approved" })
        .toArray();

    // Convert _id to string and map to the expected structure
    const breedersData = (breeders as RawBreeder[]).map((breeder) => ({
        id: breeder._id.toString(),
        name: breeder.name || "",
        address: breeder.address || "",
        city: breeder.city || "",
        state: breeder.state || "",
        zip: breeder.zip || "",
        breeds: breeder.breeds || [],
        latitude: breeder.latitude || 0,
        longitude: breeder.longitude || 0,
    }));


    return (
        <div className="relative w-full">
            <MapWrapper breeders={breedersData} />
        </div>
    )
}