'use client';

import { useState } from "react";
import DogCardList from "./DogCardList";
import { IDog } from "@/interfaces/dog";

interface FavoriteDogsSectionProps {
    puppyInterests?: any[]; // If you want to use puppy interests in the future
    puppyApplication?: any; // If you want to pass the puppy application data
    hasPuppyApplication?: boolean; // If the user has an application on their profile
    initialDogs: IDog[];
    favorites: any;
}

interface HandleUnfavorite {
    (dogId: string): void;
}

export default function FavoriteDogsSection({ 
    puppyInterests,
    puppyApplication, 
    hasPuppyApplication, 
    initialDogs, 
    favorites }: FavoriteDogsSectionProps) {
    const [dogs, setDogs] = useState(initialDogs);

    const handleUnfavorite: HandleUnfavorite = (dogId) => {
        setDogs(dogs.filter((dog: IDog) => dog._id !== dogId));
    };

    return (
        <DogCardList
            puppyInterests={puppyInterests}
            puppyApplication={puppyApplication}
            hasPuppyApplication={hasPuppyApplication ?? false}
            dogs={dogs}
            favorites={favorites}
            onUnfavorite={handleUnfavorite}
        />
    )
}