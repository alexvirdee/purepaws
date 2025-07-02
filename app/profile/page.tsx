import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import DogCardList from "@/components/DogCardList";
import { User } from "@/interfaces/user";
import { getUserFavorites } from "@/lib/db/getUserFavorites";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import clientPromise from "@/lib/mongodb";
import EditProfileDialog from "@/components/EditProfileDialog";


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        // Redirect to sign-in page if not authenticated
        redirect('/auth/signin');
    }

    const user = session?.user as User;

    // connect to the db
    const client = await clientPromise;
    const db = client.db("purepaws");

    // Fetch the breeder details using user email
    const breeder = await db.collection("breeders").findOne({ email: user.email })

    const favorites = user?.email ? await getUserFavorites(user.email) : [];

    return (
        <main className="max-w-5xl mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative">
                {/* Profile Image Placeholder */}
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                    {user?.name?.[0] || user?.email?.[0]}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">
                        {user?.name || user?.email}
                    </h2>
                    <p className="text-sm text-gray-500 mb-1">
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                        {user?.email}
                    </p>
                    {user.role === 'breeder' && (
                        <p className="text-sm text-gray-500">
                            {breeder?.about}
                        </p>
                    )}
                </div>
                {/* Edit Profile */}
                <EditProfileDialog user={{ name: user.name || "", email: user.email, role: user.role  }} />
            </div>


            {/* User Favorites */}
            {favorites.length > 0 ? (
                <div className="bg-white rounded shadow p-6">
                    <h3 className="text-lg font-bold mb-4">Your Favorite Dogs</h3>
                    <DogCardList
                        dogs={favorites}
                        favorites={favorites.map((dog) => dog._id.toString())}
                    />
                </div>
            ) : (
                <p className="text-gray-500">You have no favorite dogs yet.</p>
            )}
        </main>
    );
}