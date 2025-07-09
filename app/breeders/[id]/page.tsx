import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getUserFavorites } from "@/lib/db/getUserFavorites";
import DogCardList from "@/components/DogCardList";
import { IDog } from "@/interfaces/dog";
import { DB_NAME } from "@/lib/constants";
import { notFound } from "next/navigation";

interface BreederParams {
    params: {
        id: string;
    };
}

const Breeder = async ({ params }: BreederParams) => {
    const session = await getServerSession(authOptions);

    // The ID in the URL params is the breeder id 
    const { id } = await params;
    const breederId = id;

    // Connect to the database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get the breeder by ID
    const breeder = await db.collection("breeders").findOne({
        _id: new ObjectId(breederId)
    });

    // If breeder not found, return 404
    if (!breeder) {
        return notFound();
    }

    // If breeder has not been approved yet only admin users can view the individual breeder page to vet them
    if (breeder.status !== "approved") {
        // If they are NOT approved, only admins can view
        if (!session || session.user?.role !== "admin") {
            return notFound();
        }
    }

    // Otherwise breeder has been approved and can be viewed by anyone (also will be shown on the homepage map)


    const userFromDb = await db.collection("users").findOne({
        email: session?.user?.email
    })

    let favoriteDogs: IDog[] = [];
    let loggedInUserBreederId: string = "";

    // If logged in check if user has favorites
    if (session?.user?.email) {
        const user = await db.collection("users").findOne({ email: session.user.email });
        // Store logged in user if they have a breederId attached to their user collection 
        loggedInUserBreederId = userFromDb?.breederId ? userFromDb?.breederId.toString() : null;
        favoriteDogs = await getUserFavorites(userFromDb?.email);
    }

    // Get the dogs for this breeder by id
    const dogs = await db
        .collection("dogs")
        .find({ breederId: ObjectId.isValid(breederId) ? new ObjectId(breederId) : breederId })
        .toArray();

    // Find if the logged in user has a puppy application
    let puppyApplication = null;
    let hasPuppyApplication = false;
    puppyApplication = await db.collection("puppyApplications").findOne({
        userId: userFromDb?._id
    })

    // Serialize the puppy application to ensure compatibility with client side components
    let serializedPuppyApplication = null;
    if (puppyApplication) {
        hasPuppyApplication = true;
        serializedPuppyApplication = {
            ...puppyApplication,
            _id: puppyApplication._id?.toString() || null,
            userId: puppyApplication.userId?.toString() || null,
            createdAt: puppyApplication.createdAt ? puppyApplication.createdAt.toString() : null,
            updatedAt: puppyApplication.updatedAt ? puppyApplication.updatedAt.toString() : null,
        };
    }

    // Serialize the dogs to ensure compatibility with Client Components
    const serializedDogs = dogs.map((dog) => ({
        ...dog,
        _id: dog._id.toString(), // Convert ObjectId to string
        breederId: dog.breederId.toString(), // Convert breederId to string
        name: dog.name || "Unknown Name",
        photos: dog.photos || ["/default-photo.jpg"],
        breed: dog.breed || "Unknown Breed",
        location: dog.location || "Unknown Location",
        dob: dog.dob || "Unknown", // ensure dob property exists
        gender: dog.gender || "Unknown", // ensure gender property exists
        age: dog.age || "Unknown Age",
        status: dog.status || "Unknown Status",
        price: dog.price || "Unknown Price",
        description: dog.description || "No description available",
    }));

    return (
        <div>
            {/* Breeder information */}
            {breeder ? (
                <div className="my-4 pl-4">
                    <h1 className="text-3xl font-bold mb-4">{breeder.name}</h1>
                    <p className="text-gray-600 mb-1">Breeds focused on: {breeder.breeds}</p>
                    <p className="text-gray-600">{breeder.about}</p>
                    {/* TODO: Add breeder website */}
                    {/* <p className="text-blue-600">{breeder.website}</p> */}
                </div>
            ) : (
                <h1 className="text-3xl font-bold mb-4">Breeder Not Found</h1>
            )}
            {/* Available Dogs */}
            <h2 className="text-2xl font-bold mb-4 mx-auto text-center">Available Dogs</h2>
            {dogs.length > 0 ? (
                // Note to future self - I am passing in the loggedInUser here so I don't show the favorite button if it's the breeder on the page
                <DogCardList dogs={serializedDogs} favorites={favoriteDogs.map(dog => dog._id)} loggedInUser={loggedInUserBreederId} hasPuppyApplication={hasPuppyApplication} />
            ) : (
                <p className="text-gray-500">No dogs available for this breeder.</p>
            )}
        </div>
    );
}

export default Breeder;