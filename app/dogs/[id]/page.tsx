import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { IDog } from "@/interfaces/dog";
import { isValidImage } from "@/utils/isValidImage";
import { Dog as DogIcon } from "lucide-react";
import { DB_NAME } from "@/lib/constants";
import FavoriteButton from "@/components/FavoriteButton";


export default async function DogDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Fetch the dog by _id
    const dog = await db.collection("dogs").findOne<IDog>({
        _id: new ObjectId(id),
    });

    if (!dog) {
        notFound(); // 404 if no dog found
    }

    // Optionally fetch breeder details if needed
    const breeder = await db.collection("breeders").findOne({ _id: new ObjectId(dog.breederId) });

    return (
        <div className="max-w-4xl mx-auto p-8">
     
            <h1 className="text-3xl font-bold mb-4">{dog.name}</h1>
            <FavoriteButton dogId={dog._id.toString()} />
   

            {dog.photos && dog.photos.length > 0 && isValidImage(dog.photos[0].path) ? (
                    <Image
                        src={dog.photos[0].path}
                        alt={dog.name}
                        className="rounded mb-4"
                         width={600}
                     height={400}
                    />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded mb-2">
                        <DogIcon className="w-16 h-16 text-gray-500" />
                    </div>
                )}

            <p className="mb-2 text-lg">
                <strong>Breed:</strong> {dog.breed}
            </p>
            <p className="mb-2 text-lg">
                <strong>Location:</strong> {dog.location}
            </p>
            <p className="mb-2 text-lg">
                <strong>Status:</strong> {dog.status}
            </p>
            <p className="mb-2 text-lg">
                <strong>Price:</strong> ${dog.price}
            </p>
            <p className="mb-6">
                {dog.description}
            </p>

            {breeder && (
                <div className="border-t pt-4 mt-4">
                    <h2 className="text-2xl font-semibold mb-2">Breeder Information</h2>
                    <p className="mb-1">
                        <strong>Kennel:</strong> {breeder.name}
                    </p>
                    <p className="mb-1">
                        <strong>Email:</strong> {breeder.email}
                    </p>
                    <p className="mb-1">
                        <strong>Location:</strong> {breeder.location}
                    </p>
                    <Link
                        href={`/breeders/${breeder._id}`}
                        className="text-blue-600 underline mt-2 inline-block"
                    >
                        View Breeder Profile →
                    </Link>
                </div>
            )}
        </div>
    )
}