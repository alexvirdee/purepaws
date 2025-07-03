'use client';

import { useState } from "react";
import DogCardList from "./DogCardList";
import { IDog } from "@/interfaces/dog";

interface FavoriteDogsSectionProps {
    initialDogs: IDog[];
    favorites: any;
}

interface HandleUnfavorite {
    (dogId: string): void;
}

export default function FavoriteDogsSection({ initialDogs, favorites }: FavoriteDogsSectionProps) {
    const [dogs, setDogs] = useState(initialDogs);

    const handleUnfavorite: HandleUnfavorite = (dogId) => {
        setDogs(dogs.filter((dog: IDog) => dog._id !== dogId));
    };

    return (
        <DogCardList
            dogs={dogs}
            favorites={favorites}
            onUnfavorite={handleUnfavorite}
        />
    )
}