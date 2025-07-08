'use client';

import Link from "next/link";
import { IDog } from "@/interfaces/dog";
import { Dog as DogIcon } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { isValidImage } from "@/utils/isValidImage";
import AddEditDogDialog from "./AddEditDogDialog";
import DeleteDogDialog from "./DeleteDogDialog";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DogCardProps {
    dog: IDog;
    isFavorited?: boolean;
    onUnfavorite?: (dogId: string) => void;
    loggedInUser?: string;
}

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

export default function DogCard({ dog, isFavorited, onUnfavorite, loggedInUser }: DogCardProps) {
    const statusKey = dog.status?.charAt(0).toUpperCase() + dog.status?.slice(1).toLowerCase();

    if (dog && dog.photos) {
        console.log("DogCard - dog photos:", dog.photos[0].path);
    }

    return (
        <Card key={dog._id.toString()} className="transition relative hover:shadow-lg mb-4">
            <CardContent>
            {/* Favorite a dog */}
            {/* Only show favorite button for either
                1. Guests on application
                2. Users logged in who are not the breeders who currently own the dogs
            */}
                {loggedInUser !== dog.breederId && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
                    <FavoriteButton dogId={dog._id.toString()} initiallyFavorited={isFavorited} onUnfavorite={onUnfavorite} />
                </div>
            )}

            <Link href={`/dogs/${dog._id}`} >
                {dog.photos && dog.photos.length > 0 && isValidImage(dog.photos[0]) ? (
                    <Image
                        src={dog.photos[0]?.path}
                        alt={dog.name}
                        className="w-full h-48 object-cover mb-2 rounded"
                        width="400"
                        height="200"
                    />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded mb-2">
                        <DogIcon className="w-16 h-16 text-gray-500" />
                    </div>
                )}
                <h2 className="text-xl font-semibold">{dog.name}</h2>
                <p className="text-gray-600">{dog.litter}</p>
                <p className="text-gray-600">{dog.breed}</p>
                <p className="text-gray-500">dob: {dog.dob}</p>
                <p className="text-gray-500">{dog.gender}</p>
                {/* TODO: Add location once data is available
                    Can sync this up with the map in the main route
                */}
                {/* <p className="text-gray-500">{dog.location}</p> */}
                <Badge className={`${STATUS_STYLES[statusKey]?.className} mb-2`} variant={STATUS_STYLES[statusKey]?.variant}>
                    {dog.status}
                </Badge>
                <p className="text-green-700 font-semibold">{formatPrice(dog.price)}</p>
            </Link>

            {/* Breeder actions for dogs i.e Edit/Delete */}
            {loggedInUser === dog.breederId && (
                <div className="flex gap-2 mt-2">
                    <AddEditDogDialog mode="edit" initialData={dog} />
                    <DeleteDogDialog dogId={dog._id} dogName={dog.name} />
                </div>
            )}

            </CardContent>
            
        </Card>
    )

}