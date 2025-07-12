import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";
import { PlusIcon, User as UserIcon } from "lucide-react";

import AddEditDogDialog from "@/components/AddEditDogDialog";
import BreederApprovalBanner from "@/components/breeders/BreederApprovalBanner";
import BreederDogsTable from "@/components/breeder-dashboard/BreederDogsTable";
import AdoptionRequests from "@/components/breeder-dashboard/AdoptionRequests";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import DashboardStatCard from "@/components/breeder-dashboard/DashboardStatCard";
import { SidebarLink } from "@/components/breeder-dashboard/SidebarLink";
import Image from "next/image";
import BreederDashboardSidebar from "@/components/breeder-dashboard/BreederDashboardSidebar";
import { getBreederDashboardData } from "@/lib/fetchBreederData";


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