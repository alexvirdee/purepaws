import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Extend the Session type to include the role property
declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string | null; // Add role property
            breederId?: string | null; // Add breederId property
        };
    }
}


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        // Redirect to sign-in page if not authenticated
        redirect('/auth/signin');
    }

    const user = session?.user;

    return (
        <main className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>

            <div className="space-y-2">
                {user && (
                    <>
                        <p><strong>Email: </strong> {user.email}</p>
                        <p><strong>Role: </strong> {user.role || "No role assigned"}</p>
                    </>
                )}
            </div>

            {user.role === "breeder" && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-2">Breeder Dashboard</h2>
                    <p>Breeder ID: {user.breederId || "N/A"}</p>
                    {/* TODO: Fetch breeder details by ID */}
                    <p>Manage dogs, update information, etc.</p>
                </div>
            )}

            {user.role === "viewer" && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-2">Viewer Dashboard</h2>
                    <p>Saved dogs and favorites will show here (coming soon!)</p>
                </div>
            )}
        </main>
    );
}