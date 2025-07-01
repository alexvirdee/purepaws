import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import Header from "@/components/shared/header";

interface BreederParams {
    params: {
        id: string;
    };
}

const Breeder = async ({ params }: BreederParams) => {
    const { id } = await params;
    const breederId = id;

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("purepaws");

    // Get the breeder by ID
    const breeder = await db.collection("breeders").findOne({
        _id: new ObjectId(breederId)
    });

    // Get the dogs for this breeder (if using separate dogs collection)
    const dogs = await db
        .collection("dogs")
        .find({ breederId: breederId })
        .toArray();

    return (
        <div>
            <Header></Header>


            {/* Display breeder name */}
            <h1 className="text-3xl font-bold mb-4">
                {breeder ? breeder.name : "Breeder Not Found"}
            </h1>

            {/* Available Dogs */}
            <h2 className="text-2xl font-bold mb-4">Available Dogs</h2>
            {dogs.length > 0 ? (
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
            ) : (
                <p className="text-gray-500">No dogs available for this breeder.</p>
            )}
        </div>
    );
}

export default Breeder;