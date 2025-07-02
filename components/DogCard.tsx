'use client';

import Link from "next/link";
import { Heart } from "lucide-react";

interface Dog {
    _id: string;
    name: string;
    photo: string;
    breed: string;
    location: string;
    status: string;
    price: number;
}

export default function DogCard({ dog }: { dog: Dog }) {

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(`favorite ${dog.name}`)
    }

    return (
        <Link href={`/dogs/${dog._id}`} key={dog._id.toString()}>
            <li className="border p-4 rounded shadow hover:shadow-lg hover:bg-gray-50 transition relative">
                {/* Favorite icon */}
                <div onClick={handleFavoriteClick} className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
                    <Heart className="w-5 h-5 text-red-500 cursor-pointer" />
                </div>

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
            </li>
        </Link>
    )

}