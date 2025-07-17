
import SignInOutToast from "@/components/SignInOutToast";

import clientPromise from "@/lib/mongodb";
import Hero from "@/components/Hero";
import FeaturedBreedersSection from "@/components/FeaturedBreedersSection";
import HowItWorksSection from "@/components/HowItWorks";
import WhyPurePaws from "@/components/WhyPurePaws";
import { DB_NAME } from "@/lib/constants";

interface RawBreeder {
  _id: any; // MongoDB ObjectId
  [key: string]: any; // Add additional fields as needed
}


export default async function Home() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Retrieve approved breeders from the database
  const breeders = await db.
    collection("breeders")
    .find({ status: "approved" })
    .toArray();

  // Convert _id to string and map to the expected structure
  const breedersData = (breeders as RawBreeder[]).map((breeder) => ({
    _id: breeder._id.toString(), // keep original ObjectId or convert to string if IBreeder expects string
    id: breeder._id.toString(),
    name: breeder.name || "",
    address: breeder.address || "",
    city: breeder.city || "",
    state: breeder.state || "",
    zip: breeder.zip || "",
    breeds: breeder.breeds || [],
    latitude: breeder.latitude || 0,
    longitude: breeder.longitude || 0,
    about: breeder.about || "",
    email: breeder.email || "",
    phone: breeder.phone || "", // Added phone property to match IBreeder
    status: breeder.status || "",
    submittedAt: breeder.submittedAt || null,
  }));

  return (
    <>
      <SignInOutToast />
      <Hero breeders={breedersData} />
      <div className="pb-18">
        <FeaturedBreedersSection breeders={breedersData} />
        <HowItWorksSection />
        <WhyPurePaws />
      </div>
    </>
  );
}
