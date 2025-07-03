import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DogCardList from "@/components/DogCardList";
import { getUserFavorites } from "@/lib/db/getUserFavorites";
import { User as UserIcon, Dog as DogIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import clientPromise from "@/lib/mongodb";
import EditProfileDialog from "@/components/EditProfileDialog";
import AddDogDialog from "@/components/AddDogDialog";
import { ObjectId } from "mongodb";
import { isValidImage } from "@/utils/isValidImage";
import DogCard from "@/components/DogCard";
import { IDog } from "@/interfaces/dog";



export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        // Redirect to sign-in page if not authenticated
        redirect('/auth/signin');
    }

    // connect to the db
    const client = await clientPromise;
    const db = client.db("purepaws");

    // Resolve name not updating on edit since session token doesn't change on profile updates
    const userFromDb = await db.collection("users").findOne({
        email: session?.user?.email
    })

    // User details fresh from the database
    const name = userFromDb?.name || "";
    const email = userFromDb?.email;
    const role = userFromDb?.role;
    const breederId = userFromDb?.breederId ? userFromDb?.breederId.toString() : null;

    // Fetch the breeder details using user email
    const breeder = await db.collection("breeders").findOne({ email: email });

    // Fetch the list of dogs for the breeder if any
    const dogs = breederId
        ? await db
            .collection("dogs")
            .find({ breederId: ObjectId.isValid(breederId) ? new ObjectId(breederId) : breederId })
            .toArray()
        : [];

    const favoriteDogs = await getUserFavorites(email);

    // Serialize the dogs to ensure compatibility with client side components
    interface SerializedDog {
        _id: string;
        photo: string;
        name: string;
        breed: string;
        status: string;
        price: number;
        location: string;
        description: string;
        createdAt: string | null;
        updatedAt: string | null;
        [key: string]: any;
    }

    const serializeDogs: SerializedDog[] = JSON.parse(JSON.stringify(dogs)).map((dog: IDog): SerializedDog => ({
        ...dog,
        _id: dog._id.toString(), // convert ObjectId to a string
        photo: dog.photo || "", // ensure photo property exists
        name: dog.name || "Unknown", // ensure name property exists
        breed: dog.breed || "Unknown", // ensure breed property exists
        status: dog.status || "Unknown", // ensure status property exists
        price: dog.price || 0, // ensure price property exists
        location: dog.location || "Unknown", // ensure location property exists
        description: dog.description || "No description available", // ensure description property exists
        createdAt: dog.createdAt ? dog.createdAt.toString() : null,
        updatedAt: dog.updatedAt ? dog.updatedAt.toString() : null
    }));

    return (
        <main className="max-w-5xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-2 text-3xl font-bold mb-4">
                <UserIcon className="w-8 text-gray-700" /> Profile
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative">
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                    {name?.[0] || email?.[0]}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">
                        {name}
                    </h2>
                    <p className="text-sm text-gray-500 mb-1">
                        {role?.charAt(0).toUpperCase() + role?.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                        {email}
                    </p>
                    {role === 'breeder' && (
                        <p className="text-sm text-gray-500">
                            {breeder?.about}
                        </p>
                    )}
                </div>
                {/* Edit Profile */}
                <EditProfileDialog user={{ name: name || "", email: email, about: breeder ? breeder.about : null, role: role }} />
            </div>

            {/* Breeder Dashboard */}
            {/* TODO: Breeder CRUD functionality
                1. Add dogs
                2. Edit dogs
                3. Remove dogs
                4. Display dogs added to db 
                5. Add "Upcoming Litters" section with following details
                        - Estimated Due Date
                        - Expected dogs/breeds 
                        - Contact interest form (on breeder detail page)
            */}
            {breeder && breeder.status === "approved" && (
                <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">My Dogs</h2>
                        {<AddDogDialog breederId={breederId} />}
                    </div>

                    {/* List of dogs */}
                    {serializeDogs.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {serializeDogs.map((dog, index) => (
                               <div key={index}>
                                   <DogCard key={index} dog={dog} loggedInUser={breederId} />
                               </div>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">You haven't listed any dogs yet. Click "Add Dog" to get started!</p>
                    )}

                    {/* 📅 Upcoming Litters Placeholder */}
                    <div className="mt-8 bg-gray-200">
                        <h2 className="text-xl font-bold mb-2">Upcoming Litters</h2>
                        <p className="text-gray-500">
                            Coming soon: Add feature for upcoming litters with estimated due dates and notify interested families.
                        </p>
                    </div>
                </div>
            )
            }

            {/* For breeder profile who are not approved yet display that information in the profile */}
            {breeder && breeder.status !== "approved" && (
                <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Breeder application status is <span className="text-blue-500">{breeder.status}</span></h2>
                        <p className="text-gray-500">
                            Team is currently reviewing your breeder application. You will receive an email once approved!
                        </p>
                    </div>
                </div>
            )}

            {/* User Favorites */}
            {favoriteDogs.length > 0 ? (
                <div className="bg-white rounded shadow p-6">
                    <h3 className="text-lg font-bold mb-4">Your Favorite Dogs</h3>
                    <DogCardList
                        dogs={favoriteDogs}
                        favorites={favoriteDogs.map((dog) => dog._id)}
                    />
                </div>
            ) : (
                <p className="text-gray-500">You have no favorite dogs yet.</p>
            )}
        </main>
    );
}