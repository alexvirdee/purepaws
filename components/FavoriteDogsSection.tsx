'use client';

import { useEffect, useState } from "react";
import DogCardList from "./DogCardList";
import { IDog } from "@/interfaces/dog";

interface FavoriteDogsSectionProps {
    puppyInterests?: any[]; // If you want to use puppy interests in the future
    puppyApplication?: any; // If you want to pass the puppy application data
    initialDogs: IDog[];
    favorites: any;
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
    onNewRequest
}: FavoriteDogsSectionProps) {
    const [dogs, setDogs] = useState(initialDogs);

    useEffect(() => {
        setDogs(initialDogs)
    }, [initialDogs])

    const handleUnfavorite: HandleUnfavorite = (dogId) => {
        setDogs(dogs.filter((dog: IDog) => dog._id !== dogId));
    };

    return (
        <DogCardList
            puppyInterests={puppyInterests}
            puppyApplication={puppyApplication}
            dogs={dogs}
            favorites={favorites}
            onUnfavorite={handleUnfavorite}
            onNewRequest={onNewRequest}
            gridClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
        />
    )
}