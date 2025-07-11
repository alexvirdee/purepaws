import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IDog } from "@/interfaces/dog";
import { isValidImage } from "@/utils/isValidImage";
import { Dog as DogIcon, TagIcon, MapPinIcon } from "lucide-react";
import { DB_NAME } from "@/lib/constants";
import FavoriteButton from "@/components/FavoriteButton";
import { getServerSession } from "next-auth";
import { Badge } from "@/components/ui/badge";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DogImageGallery from "@/components/DogImageGallery";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

type StatusStyle = {
    label: string;
    variant: BadgeVariant;
    className?: string;
};


const STATUS_STYLES: Record<string, StatusStyle> = {
    Available: {
        label: "Available",
        variant: "secondary",
        className: "bg-green-300 border border-green-300"
    },
    Pending: {
        label: "Pending",
        variant: "outline",
    },
    Sold: {
        label: "Sold",
        variant: "destructive",
    },
};


export default async function DogDetailsPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const { id } = await params;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let isFavorited = false;
    let requestedPuppy = false;

    const user = await db.collection("users").findOne({ email: session?.user?.email });
    const userBreederId = user?.breederId?.toString();

    // Fetch the dog by _id
    const dog = await db.collection("dogs").findOne<IDog>({
        _id: new ObjectId(id),
    });

    const dogBreederId = dog?.breederId?.toString();

    // Check if user has an active adoption request for this dog and display information
    const existingRequest = await db.collection("puppyInterests").findOne({
        userId: user?._id,
        dogId: dog?._id,
        status: { $ne: "cancelled" }
    });

    if (existingRequest) {
        requestedPuppy = !!existingRequest;
    }

    if (!dog) {
        notFound(); // 404 if no dog found
    }

    if (session?.user?.email) {
        const user = await db.collection("users").findOne({ email: session.user.email });

        if (user?.favorites && Array.isArray(user.favorites)) {
            isFavorited = user.favorites.includes(dog._id.toString())
        }
    }

    // Optionally fetch breeder details if needed
    const breeder = await db.collection("breeders").findOne({ _id: new ObjectId(dog.breederId) });

    const statusKey = dog.status?.charAt(0).toUpperCase() + dog.status?.slice(1).toLowerCase();

    console.log('isFavorited:', isFavorited);


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT: Image gallery */}
                <DogImageGallery
                    images={dog.photos ?? []}
                    dogName={dog.name}
                    dogId={dog._id.toString()}
                    userBreederId={userBreederId}
                    dogBreederId={dogBreederId}
                    isFavorited={isFavorited}
                    requestedPuppy={requestedPuppy}
                />

                {/* Overview Card */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold">{dog.name}</h1>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">

                        <div><strong>Breed:</strong> {dog.breed}</div>
                        <div><strong>Location:</strong> {dog.location ? dog.location : "N/A"}</div>
                        <Badge
                            className={`${STATUS_STYLES[statusKey]?.className} mb-2`}
                            variant={STATUS_STYLES[statusKey]?.variant}
                        >
                            {dog.status}
                        </Badge>
                        <div><strong>Price:</strong> ${dog.price}</div>
                    </div>

                    <p className="text-gray-700">{dog.description}</p>

                    {breeder && (
                        <div className="border-t pt-4 mt-4">
                            <h2 className="text-xl font-semibold mb-2">Breeder Information</h2>
                            <p><strong>Kennel:</strong> {breeder.name}</p>
                            <p><strong>Email:</strong> {breeder.email}</p>
                            <p><strong>Location:</strong> {breeder.location}</p>
                            <Link
                                href={`/breeders/${breeder._id}`}
                                className="text-blue-600 underline mt-2 inline-block"
                            >
                                View Breeder Profile →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}