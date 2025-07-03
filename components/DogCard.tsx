'use client';

import Link from "next/link";
import { IDog } from "@/interfaces/dog";
import { Dog as DogIcon } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { isValidImage } from "@/utils/isValidImage";
import { Button } from "@/components/ui/button";


interface DogCardProps {
    dog: IDog;
    isFavorited?: boolean;
    loggedInUser?: string;
}

export default function DogCard({ dog, isFavorited, loggedInUser }: DogCardProps) {
    return (
        <li key={dog._id.toString()} className="border p-4 rounded shadow hover:shadow-lg hover:bg-gray-50 transition relative">
            {/* Favorite a dog */}
            {/* Only show favorite button for either
                1. Guests on application
                2. Users logged in who are not the breeders who currently own the dogs
            */}
            {loggedInUser !== dog.breederId && (
                <FavoriteButton dogId={dog._id.toString()} initiallyFavorited={isFavorited} />
            )}

            <Link href={`/dogs/${dog._id}`} >
                {isValidImage(dog.photo) ? (
                    <img
                        src={dog.photo}
                        alt={dog.name}
                        className="w-full h-48 object-cover mb-2 rounded"
                    />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded mb-2">
                        <DogIcon className="w-16 h-16 text-gray-500" />
                    </div>
                )}
                <h2 className="text-xl font-semibold">{dog.name}</h2>
                <p className="text-gray-600">{dog.breed}</p>
                <p className="text-gray-500">{dog.location}</p>
                <p className="text-green-600 font-bold">
                    {dog.status} - ${dog.price}
                </p>

                {/* Breeder actions for dogs i.e Edit/Delete */}
                {loggedInUser === dog.breederId && (
                    <div className="flex gap-2 mt-2">
                        <Button className="text-sm text-blue-600 bg-gray-200 hover:bg-gray-300 cursor-pointer">
                            Edit
                        </Button>
                        <Button className="text-sm bg-red-500 hover:bg-red-600 cursor-pointer">
                            Delete
                        </Button>
                    </div>
                )}
            </Link>
        </li>
    )

}