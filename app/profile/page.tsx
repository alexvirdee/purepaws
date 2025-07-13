import { User as UserIcon, Dog as DogIcon, ArrowRight } from "lucide-react";
import EditProfileDialog from "@/components/dialogs/EditProfileDialog";
import Link from "next/link";
import BreederApprovalBanner from "@/components/breeders/BreederApprovalBanner";
import PuppyApplicationDetails from "@/components/PuppyApplicationDetails";
import ProfileContent from "@/components/ProfileContent";
import { getUserProfileData } from "@/lib/db/getUserProfileData";


export default async function ProfilePage() {
    const {
    user,
    breeder,
    favoriteDogs,
    puppyApplication,
    puppyInterests,
    adoptionRequests,
  } = await getUserProfileData();

  const name = user?.name || "";
  const email = user?.email;
  const role = user?.role;
  const breederId = user?.breederId?.toString() || null;

    return (
        <main className="max-w-5xl mx-auto p-8 space-y-8">
            <div className="flex flex-row justify-between mb-4">
                <div className="flex items-center gap-2 text-3xl font-bold">
                    <UserIcon className="w-8 text-gray-700" /> Profile
                </div>
                {role === "admin" && (
                    <Link className="text-blue-600" href="/admin">Admin Dashboard</Link>
                )}

                {role === "breeder" && (
                    <Link className="text-blue-600" href="/dashboard">View my Dashboard</Link>
                )}
            </div>

            {/* Breeder approval banner */}
            {breederId &&
                breeder &&
                breeder.status === "approved" && (
                    <BreederApprovalBanner breeder={breeder} />
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
                Note - Both breeders and users can have a puppy application. (Breeders may want puppies from other breeders)
            */}
            {puppyApplication ? (
                <PuppyApplicationDetails data={puppyApplication} />
            ) : (
                <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex gap-6 relative p-2">
                    <p className="mb-4">You don't have a puppy application yet.</p>

                    <Link
                        href="/puppy-application"
                        className="inline-flex items-center text-blue-500 text-sm px-3 py-1.5 rounded hover:text-blue-600 transition"
                    >
                        <ArrowRight className="w-4 h-4 mr-2" /> <span>Complete Puppy Application</span>
                    </Link>

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

            <ProfileContent
                puppyInterests={puppyInterests || []}
                adoptionRequests={adoptionRequests || []}
                favoriteDogs={favoriteDogs}
                puppyApplication={puppyApplication}
                breederId={breederId}
                userId={user._id?.toString() || null}
            />
        </main>
    );
}