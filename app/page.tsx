// import Image from "next/image";
import { mockData } from "@/db/mock-data";

export default function Home() {
  const dogs = mockData.dogs;

  return (
    <div className="">
      <h1 className="text-3xl">Welcome to purepaws</h1>
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
