'use client';

import DogCard from "@/components/DogCard";
import {IDog } from "@/interfaces/dog";

export default function DogCardList({ dogs, favorites, loggedInUser }: { dogs: IDog[]; favorites: string[]; loggedInUser?: string }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dogs.map((dog) => (
        <DogCard key={dog._id.toString()} dog={dog} isFavorited={favorites.includes(dog._id.toString())} loggedInUser={loggedInUser} />
      ))}
    </ul>
  )
}