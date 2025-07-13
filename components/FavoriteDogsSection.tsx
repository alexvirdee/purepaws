'use client';

import { useEffect, useState } from "react";
import DogCardList from "./dog-card/DogCardList";
import { IDog } from "@/interfaces/dog";

interface FavoriteDogsSectionProps {
    puppyInterests?: any[]; // If you want to use puppy interests in the future
    puppyApplication?: any; // If you want to pass the puppy application data
    initialDogs: IDog[];
    favorites: any;
    breederId?: string | null; // Optional breederId prop for future use
    userId?: string | null; // Optional userId prop for future use
    onNewRequest: (newRequest: any) => void
}

interface HandleUnfavorite {
    (dogId: string): void;
}

export default function FavoriteDogsSection({ 
    puppyInterests,
    puppyApplication, 
    initialDogs, 
    favorites,
    breederId = null, 
    userId = null, // Optional userId prop for future use
    onNewRequest
}: FavoriteDogsSectionProps) {
    return (
        <DogCardList
            puppyInterests={puppyInterests}
            puppyApplication={puppyApplication}
            dogs={initialDogs}
            favorites={favorites}
            onNewRequest={onNewRequest}
            breederId={breederId} // Pass breederId if needed
            userId={userId}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
        />
    )
}