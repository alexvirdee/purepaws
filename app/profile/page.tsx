import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getUserFavorites } from "@/lib/db/getUserFavorites";
import { User as UserIcon, Dog as DogIcon } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import EditProfileDialog from "@/components/EditProfileDialog";
import EditPuppyApplicationDialog from "@/components/EditPuppyApplicationDialog";
import AddEditDogDialog from "@/components/AddEditDogDialog";
import { ObjectId } from "mongodb";
import DogCard from "@/components/DogCard";
import { IDog } from "@/interfaces/dog";
import FavoriteDogsSection from "@/components/FavoriteDogsSection";
import Link from "next/link";
import { DB_NAME } from "@/lib/constants";
import DeletePuppyApplicationDialog from "@/components/DeletePuppyApplicationDialog";
import BreederApprovalBanner from "@/components/breeders/BreederApprovalBanner";

interface SerializedDog {
    _id: string;
    photos: { path: string;[key: string]: any }[];
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


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        // Redirect to sign-in page if not authenticated
        redirect('/auth/signin');
    }

    let puppyApplication = null;

    // connect to the db
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Resolve name not updating on edit since session token doesn't change on profile updates
    const userFromDb = await db.collection("users").findOne({
        email: session?.user?.email
    });

    // User details fresh from the database
    const name = userFromDb?.name || "";
    const email = userFromDb?.email;
    const role = userFromDb?.role;
    const breederId = userFromDb?.breederId ? userFromDb?.breederId.toString() : null;

    // Fetch the breeder details using user email
    const breeder = await db.collection("breeders").findOne({ email: email });

    // Serialize the breeder to ensure compatibility with client side components
    let serializedBreeder = null;
    
    if (breeder) {
        serializedBreeder = {
            ...breeder,
            _id: breeder._id.toString(), // convert ObjectId to a string
            approvedAt: breeder.approvedAt ? breeder.approvedAt.toString() : null,
            createdAt: breeder.createdAt ? breeder.createdAt.toString() : null,
            updatedAt: breeder.updatedAt ? breeder.updatedAt.toString() : null,
        };
    }

    // Fetch the list of dogs for the breeder if any
    const dogs = breederId
        ? await db
            .collection("dogs")
            .find({ breederId: ObjectId.isValid(breederId) ? new ObjectId(breederId) : breederId })
            .toArray()
        : [];

    const favoriteDogs = await getUserFavorites(email);

    // Get the users puppy application (TODO: Check if can avoid looking for this collection if it does not exist)
    puppyApplication = await db.collection("puppyApplications").findOne({
        userId: userFromDb?._id
    })

    // Serialize the puppy application to ensure compatibility with client side components
    let serializedPuppyApplication = null;
    if (puppyApplication) {
        serializedPuppyApplication = {
            ...puppyApplication,
            _id: puppyApplication._id?.toString() || null,
            userId: puppyApplication.userId?.toString() || null,
            createdAt: puppyApplication.createdAt ? puppyApplication.createdAt.toString() : null,
            updatedAt: puppyApplication.updatedAt ? puppyApplication.updatedAt.toString() : null,
        };
    }


    // Serialize the dogs to ensure compatibility with client side components
    const serializeDogs: SerializedDog[] = JSON.parse(JSON.stringify(dogs)).map((dog: IDog): SerializedDog => ({
        ...dog,
        _id: dog._id.toString(), // convert ObjectId to a string
        photos: dog.photos || [], // ensure photos property exists
        name: dog.name || "Unknown", // ensure name property exists
        breed: dog.breed || "Unknown", // ensure breed property exists
        status: dog.status || "Unknown", // ensure status property exists
        price: dog.price || 0, // ensure price property exists
        location: dog.location || "Unknown", // ensure location property exists
        dob: dog.dob || "Unknown", // ensure dob property exists
        gender: dog.gender || "Unknown", // ensure gender property exists
        description: dog.description || "No description available", // ensure description property exists
        createdAt: dog.createdAt ? dog.createdAt.toString() : null,
        updatedAt: dog.updatedAt ? dog.updatedAt.toString() : null
    }));

    return (
        <main className="max-w-5xl mx-auto p-8 space-y-8">
            <div className="flex flex-row justify-between mb-4">
                <div className="flex items-center gap-2 text-3xl font-bold">
                    <UserIcon className="w-8 text-gray-700" /> Profile
                </div>
                {userFromDb?.role === "admin" && (
                    <Link className="text-blue-600" href="/admin">Admin Dashboard</Link>
                )}
            </div>

            {/* Breeder approval banner */}
            {breederId &&
                breeder &&
                breeder.status === "approved" && (
                <BreederApprovalBanner breeder={serializedBreeder} />
            )}

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

            {/* Puppy Application Details
                Note - Only showing this section for regular users i.e. not breeders since they won't be submitting puppy applications
            */}
            {session?.user?.role !== "breeder" ? (
                puppyApplication ? (
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative">
                        <div className="p-2">
                            <h2 className="text-xl font-semibold mb-4">Your Puppy Application</h2>
                            <p><strong>Name:</strong> {puppyApplication.name}</p>
                            <p><strong>Email:</strong> {puppyApplication.email}</p>
                            <p><strong>City:</strong> {puppyApplication.city}</p>
                            <p><strong>State:</strong> {puppyApplication.state}</p>
                            <p><strong>Zip:</strong> {puppyApplication.zip}</p>
                            <p><strong>Age:</strong> {puppyApplication.age}</p>
                            <p><strong>Pets Owned:</strong> {puppyApplication.petsOwned}</p>
                            <p><strong>Has Children:</strong>{puppyApplication.hasChildren === true ? 'Yes' : 'No'}</p>
                            <p><strong>Puppy Preference:</strong>{puppyApplication.puppyPreference}</p>
                            <p><strong>Gender Preference:</strong>{puppyApplication.genderPreference}</p>
                            <p><strong>Training Planned:</strong>{puppyApplication.trainingPlanned === true ? 'Yes' : 'No'}</p>
                            <p><strong>Desired Traits:</strong>{puppyApplication.desiredTraits}</p>
                            <p><strong>Additional Comments:</strong>{puppyApplication.additionalComments}</p>
                            <p><strong>Approvals:</strong> {puppyApplication.approvals?.length || 0}</p>

                            {/* Puppy Application action buttons */}
                            <div className="flex flex-row justify-between absolute top-4 right-4 gap-4">

                                {/* Edit puppy application */}
                                <EditPuppyApplicationDialog puppyApplication={serializedPuppyApplication} />

                                {/* Delete application */}
                                <DeletePuppyApplicationDialog applicationId={serializedPuppyApplication?._id || ""} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-2">
                        <p className="mb-4">You have not submitted a puppy application yet.</p>
                        <a
                            href="/puppy-application"
                            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            Submit Puppy Application
                        </a>
                    </div>
                )
            ) : null}


            {/* Breeder Profile */}
            {/* TODO: Breeder CRUD functionality
                1. Add dogs - Done
                2. Edit dogs - Mostly done
                3. Remove dogs - in-progress
                4. Display dogs added to db 
                5. Add "Upcoming Litters" section with following details
                        - Estimated Due Date
                        - Expected dogs/breeds 
                        - Contact interest form (on breeder detail page)
            */}
            {breederId &&
                breeder &&
                breeder.status === "approved" && (
                    <>
                        {/* Breeder litters */}
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Litters</h2>
                                {/* TODO: Add/Edit litter buttons */}
                                {/* {<AddEditDogDialog mode="add" breederId={breederId} />} */}
                            </div>

                            {/* List of litters */}
                            {serializeDogs.length > 0 ? (
                                <ul className="space-y-4">
                                    {Array.from(new Set(serializeDogs
                                        .map(dog => dog.litter)
                                        .filter(Boolean) // remove undefined/null
                                    )).map((litterName, index) => (
                                        <li className="border p-4 rounded shadow hover:shadow-md hover:bg-gray-200 transition" key={index}>
                                            <Link
                                                href={`/profile/litters/${encodeURIComponent(litterName)}`}

                                            >
                                                <h3 className="text-lg font-semibold">{litterName}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {
                                                        serializeDogs.filter(dog => dog.litter === litterName).length
                                                    } puppies in this litter
                                                </p>
                                                {/* TODO: Add link to view litter details */}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    You have no litters yet.
                                </p>
                            )}
                        </div>
                        {/* All dogs for breeder */}
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">My Dogs</h2>
                                {<AddEditDogDialog mode="add" breederId={breederId} />}
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
                    </>
                )
            }

            {/* For breeder profile who are not approved yet display that information in the profile */}
            {breeder && breeder.status !== "approved" && (
                <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-bold">
                            Breeder application status:&nbsp;
                            <span className={breeder.status === 'rejected' ? 'text-red-600' : 'text-blue-500'}>
                                {breeder.status.charAt(0).toUpperCase() + breeder.status.slice(1)}
                            </span>
                        </h2>
                    </div>

                    {breeder.status === "pending" && (
                        <p className="text-gray-600">
                            Our team is currently reviewing your breeder application. You’ll receive an email once approved!
                        </p>
                    )}

                    {breeder.status === "rejected" && (
                        <p className="text-gray-600">
                            Unfortunately, your breeder application was rejected. If you believe this was in error,
                            please email    <a href="mailto:woofpurepaws@gmail.com">woofpurepaws@gmail.com</a>  for assistance.
                        </p>
                    )}
                </div>
            )}

            {/* User Favorites */}
            {favoriteDogs.length > 0 ? (
                <div className="bg-white rounded shadow p-6">
                    <h3 className="text-lg font-bold mb-4">Your Favorite Dogs</h3>
                    <FavoriteDogsSection initialDogs={favoriteDogs} favorites={favoriteDogs} />
                </div>
            ) : (
                <p className="text-gray-500">You have no favorite dogs yet.</p>
            )}
        </main>
    );
}