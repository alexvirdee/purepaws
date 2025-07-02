'use client';

import Link from "next/link";
import { Dog } from "@/interfaces/dog";
import FavoriteButton from "./FavoriteButton";


export default function DogCard({ dog }: { dog: Dog }) {

    return (
        <li key={dog._id.toString()} className="border p-4 rounded shadow hover:shadow-lg hover:bg-gray-50 transition relative">
            {/* Favorite a dog */}
            <FavoriteButton />

            <Link href={`/dogs/${dog._id}`} >
                <img
                    src={dog.photo}
                    alt={dog.name}
                    className="w-full h-48 object-cover mb-2 rounded"
                />
                <h2 className="text-xl font-semibold">{dog.name}</h2>
                <p className="text-gray-600">{dog.breed}</p>
                <p className="text-gray-500">{dog.location}</p>
                <p className="text-green-600 font-bold">
                    {dog.status} - ${dog.price}
                </p>
            </Link>
        </li>
    )

}