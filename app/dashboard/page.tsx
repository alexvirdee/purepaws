import BreederCalendar from "@/components/dashboards/breeder/BreederCalendar";
import DashboardStatCard from "@/components/dashboards/breeder/DashboardStatCard";
import { Button } from "@/components/ui/button";
import { getBreederDashboardData } from "@/lib/fetchBreederData";
import Link from "next/link";
import ConnectStripeAccountButton from "@/components/dashboards/breeder/ConnectStripeAccountButton";
import ManageStripeDashboardButton from "@/components/dashboards/breeder/ManageStripeDashboardButton";


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
                    <div className="flex align-end items-center gap-6">
                        {/* Stripe buttons for breeder payout */}
                        {breeder?.stripeAccountId ? (
                            <ManageStripeDashboardButton />
                        ) : (
                            <ConnectStripeAccountButton />
                        )}
                        <Link className="text-blue-500 hover:text-blue-600 cursor-pointer" href={`/breeders/${breeder?._id}`}>Public Profile</Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4">
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
                        title="Breeder Since"
                        value={breeder?.city + ", " + breeder?.state}
                        description="Breeder Location"
                        trend={breederJoinedText}
                        textColor="text-[#0DC0DF]"
                        textSize="text-[18px]"
                    />
                </div>

                {/* Breeder calendar view 
                    TODO: Add functionality for next litter availability date, heat cycles, stud timing, vet checks etc.
                */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BreederCalendar />
                    {/* Placeholder for upcoming litter date lists */}
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-2">Upcoming Litters</h3>
                        <p className="text-gray-500">No upcoming litters scheduled yet.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}