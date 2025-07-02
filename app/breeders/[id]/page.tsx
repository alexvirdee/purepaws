import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DogCardList from "@/components/DogCardList";

interface BreederParams {
    params: {
        id: string;
    };
}

const Breeder = async ({ params }: BreederParams) => {
    const session = await getServerSession(authOptions);

    const { id } = await params;
    const breederId = id;

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("purepaws");

    // Get the breeder by ID
    const breeder = await db.collection("breeders").findOne({
        _id: new ObjectId(breederId)
    });

    const userFromDb = await db.collection("users").findOne({
        email: session?.user?.email
    })

    console.log('userFromDb', userFromDb?._id)

    let userFavorites: string[] = [];
    let loggedInUserBreederId: string = "";

    // If logged in check if user has favorites
    if (session?.user?.email) {
        const user = await db.collection("users").findOne({ email: session.user.email });
        loggedInUserBreederId = userFromDb?.breederId;
        userFavorites = user?.favorites || [];
    }

    // Get the dogs for this breeder by id
    const dogs = await db
        .collection("dogs")
        .find({ breederId: ObjectId.isValid(breederId) ? new ObjectId(breederId) : breederId })
        .toArray();

    // Serialize the dogs to ensure compatibility with Client Components
    const serializedDogs = dogs.map((dog) => ({
        ...dog,
        _id: dog._id.toString(), // Convert ObjectId to string
        breederId: dog.breederId.toString(), // Convert breederId to string
        name: dog.name || "Unknown Name",
        photo: dog.photo || "/default-photo.jpg",
        breed: dog.breed || "Unknown Breed",
        location: dog.location || "Unknown Location",
        age: dog.age || "Unknown Age",
        status: dog.status || "Unknown Status",
        price: dog.price || "Unknown Price",
        description: dog.description || "No description available",
    }));

    return (
        <div>
            {/* Display breeder name */}
            <h1 className="text-3xl font-bold mb-4">
                {breeder ? breeder.name : "Breeder Not Found"}
            </h1>

            {/* Available Dogs */}
            <h2 className="text-2xl font-bold mb-4 mx-auto text-center">Available Dogs</h2>
            {dogs.length > 0 ? (
                <DogCardList dogs={serializedDogs} favorites={userFavorites} loggedInUser={loggedInUserBreederId} />
            ) : (
                <p className="text-gray-500">No dogs available for this breeder.</p>
            )}
        </div>
    );
}

export default Breeder;