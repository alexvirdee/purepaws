import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getUserFavorites } from "@/lib/db/getUserFavorites";
import { User as UserIcon, Dog as DogIcon, } from "lucide-react";
import clientPromise from "@/lib/mongodb";
import EditProfileDialog from "@/components/EditProfileDialog";
import { ObjectId } from "mongodb";
import FavoriteDogsSection from "@/components/FavoriteDogsSection";
import Link from "next/link";
import { DB_NAME } from "@/lib/constants";
import BreederApprovalBanner from "@/components/breeders/BreederApprovalBanner";
import PuppyApplicationDetails from "@/components/PuppyApplicationDetails";
import AdoptionRequestsSection from "@/components/AdoptionRequestsSection";


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        // Redirect to sign-in page if not authenticated
        redirect('/auth/signin');
    }

    let puppyApplication = null;
    let hasPuppyApplication = false;

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
        hasPuppyApplication = true; // Set flag if puppy application exists

        serializedPuppyApplication = {
            ...puppyApplication,
            _id: puppyApplication._id?.toString() || null,
            userId: puppyApplication.userId?.toString() || null,
            createdAt: puppyApplication.createdAt ? puppyApplication.createdAt.toString() : null,
            updatedAt: puppyApplication.updatedAt ? puppyApplication.updatedAt.toString() : null,
        };
    }

    // Puppy interest requests for this user
    const puppyInterests = await db.collection("puppyInterests")
        .find({ userId: userFromDb?._id })
        .toArray();

    let serializedPuppyInterest = null;

    if (puppyInterests) {
        serializedPuppyInterest = puppyInterests.map(interest => ({
            ...interest,
            _id: interest._id.toString(),
            userId: interest.userId.toString(),
            breederId: interest.breederId?.toString() || null,
            puppyApplicationId: interest.puppyApplicationId?.toString() || null,
            dogId: interest.dogId.toString(),
            createdAt: interest.createdAt ? interest.createdAt.toISOString() : null,
            status: interest.status || "pending", // Default to "pending" if not present
            message: interest.message || "",      // Default to empty string if not present
        }));
    }

    // Get unique dog IDs to join with dogs collection
    const puppyInterestDogIds = puppyInterests.map(interest => interest.dogId);

    // Get the dog details in bulk
    const dogsForInterests = await db.collection("dogs")
        .find({ _id: { $in: puppyInterestDogIds } })
        .toArray();

    // Build final adoption requests array with dog + interest merged
    const adoptionRequests = puppyInterests.map(interest => {
        const dog = dogsForInterests.find(d => d._id.toString() === interest.dogId.toString());

        return {
            ...interest,
            _id: interest._id.toString(),
            userId: interest.userId.toString(),
            breederId: interest.breederId?.toString() || null,
            puppyApplicationId: interest.puppyApplicationId?.toString() || null,
            dogId: interest.dogId.toString(),
            createdAt: interest.createdAt?.toISOString() || null,
            dog: dog ? {
                _id: dog._id.toString(),
                name: dog.name || "Unknown",
                photos: dog.photos || [],
                breed: dog.breed || "Unknown",
                status: dog.status || "Unknown",
                price: dog.price || 0,
            } : null,
            status: interest.status || "pending", // Default to "pending" if not present
            message: interest.message || "",      // Default to empty string if not present
        }
    });


    return (
        <main className="max-w-5xl mx-auto p-8 space-y-8">
            <div className="flex flex-row justify-between mb-4">
                <div className="flex items-center gap-2 text-3xl font-bold">
                    <UserIcon className="w-8 text-gray-700" /> Profile
                </div>
                {userFromDb?.role === "admin" && (
                    <Link className="text-blue-600" href="/admin">Admin Dashboard</Link>
                )}

                {userFromDb?.role === "breeder" && (
                    <Link className="text-blue-600" href="/dashboard">View my Dashboard</Link>
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
                    {name?.[0].toUpperCase() || email?.[0].toUpperCase()}
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
            {serializedPuppyApplication ? (
                <PuppyApplicationDetails data={serializedPuppyApplication} />
            ) : (
                <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative p-2">
                    <p className="mb-4">You have not submitted a puppy application yet.</p>
                    <div>
                    <Link
                        href="/puppy-application"
                        className="inline-block bg-green-600 text-white text-sm px-3 py-1.5 rounded hover:bg-green-700 transition"
                    >
                        Submit Puppy Application
                    </Link>
                    </div>
                </div>
            )
            }

            {/* For breeders who've applied and are not approved yet display that information in the profile */}
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

            {/* User Adoption Interests/Requests */}
            <AdoptionRequestsSection requests={adoptionRequests} />


            {/* User Favorites */}
            {favoriteDogs.length > 0 ? (
                <div className="bg-white rounded shadow p-6">
                    <h3 className="text-lg font-bold mb-4">Your Favorite Dogs</h3>
                    <FavoriteDogsSection
                        puppyApplication={serializedPuppyApplication}
                        hasPuppyApplication={hasPuppyApplication}
                        initialDogs={favoriteDogs}
                        favorites={favoriteDogs}
                        puppyInterests={serializedPuppyInterest}
                    />
                </div>
            ) : (
                <p className="text-gray-500">You have no favorite dogs yet.</p>
            )}
        </main>
    );
}