import BreederApprovalBanner from "@/components/breeders/BreederApprovalBanner";
import DashboardStatCard from "@/components/breeder-dashboard/DashboardStatCard";
import { getBreederDashboardData } from "@/lib/fetchBreederData";
import Link from "next/link";


export default async function BreederDashboardPage() {
    const {
        breeder,
        dogs,
        interests,
        totalDogs,
        totalPuppyInterests,
        totalRequestsSent
    } = await getBreederDashboardData({ includeDogs: true, includeInterests: true });

    // Calculate joined text
    let breederJoinedText = "Pending Approval";
    if (breeder?.approvedAt) {
        const approvedDate = new Date(breeder.approvedAt);
        const diffInDays = Math.floor((Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
        breederJoinedText = `Joined ${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    return (
        <main className="flex min-h-screen">
            {/* Main content area */}
            <section className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{breeder?.name}</h2>
                    <Link className="text-blue-500 hover:text-blue-600 cursor-pointer" href={`/breeders/${breeder?._id}`}>Public Profile</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    <DashboardStatCard
                        title="Dogs Listed"
                        value={dogs.length}
                        description="Currently active"
                    />
                    <DashboardStatCard
                        title="Puppy Interests"
                        value={totalPuppyInterests}
                        description="Families interested"
                    />
                    <DashboardStatCard
                        title="Requests Sent"
                        value={totalRequestsSent}
                        description="Follow-ups sent"
                    />
                    <DashboardStatCard
                        title="Profile Status"
                        value={breeder?.status}
                        description="Breeder Profile"
                        trend={breederJoinedText}
                        textColor="text-green-500"
                    />
                </div>

                {breeder && breeder?.status === "approved" && (
                    <BreederApprovalBanner breeder={breeder} />
                )}
            </section>
        </main>
    );
}