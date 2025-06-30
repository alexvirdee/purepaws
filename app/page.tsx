// import Image from "next/image";
import { mockData } from "@/db/mock-data";
import dynamic from "next/dynamic";
import MapWrapper from "@/components/MapWrapper";


export default function Home() {
  const breeders = mockData.breeders;
  // const dogs = mockData.dogs;

  return (
    <div className="">
      <h1 className="text-3xl">Welcome to purepaws</h1>

    {/* Mapbox package testing */}
    <MapWrapper breeders={breeders} />

      {/* Breeders */}
      {/* <h2 className="text-2xl font-bold mb-4">Breeders</h2>
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
      </ul> */}

    </div>
  );
}
