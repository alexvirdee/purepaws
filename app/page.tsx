// import Image from "next/image";
import { mockData } from "@/db/mock-data";

export default function Home() {
  const breeders = mockData.breeders;
  const dogs = mockData.dogs;

  return (
    <div className="">
      <h1 className="text-3xl">Welcome to purepaws</h1>
      {/* Breeders */}
      <h2 className="text-2xl font-bold mb-4">Breeders</h2>
  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
    {breeders.map((breeder) => (
      <li key={breeder.id} className="border p-4 rounded shadow">
        <h3 className="text-xl font-semibold">{breeder.name}</h3>
        <p className="text-gray-600">{breeder.location}</p>
        <p className="text-sm text-gray-500">{breeder.breeds.join(", ")}</p>
        <p className="text-sm mt-2">{breeder.about}</p>
        <a
          href={breeder.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline block mt-2"
        >
          Visit Website
        </a>
      </li>
    ))}
  </ul>

      {/* Dogs */}
      <h1 className="text-2xl font-bold mb-4">Available Dogs</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.map((dog) => (
          <li key={dog.id} className="border p-4 rounded shadow">
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
        ))}
      </ul>
    </div>
  );
}
