'use client';

import DogCard from "@/components/DogCard";
import { Dog } from "@/interfaces/dog";

export default function DogCardList({ dogs }: { dogs: Dog[] }) {
    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dogs.map((dog) => (
        <DogCard key={dog._id} dog={dog} />
      ))}
    </ul>
    )
}