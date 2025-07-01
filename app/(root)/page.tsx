import clientPromise from "@/lib/mongodb";
import MapWrapper from "@/components/MapWrapper";

interface RawBreeder {
  _id: any; // MongoDB ObjectId
  [key: string]: any; // Add additional fields as needed
}


export default async function Home() {
  const client = await clientPromise;
  const db = client.db("purepaws");

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
    <div>
      <MapWrapper breeders={breedersData} />
    </div>
  );
}
