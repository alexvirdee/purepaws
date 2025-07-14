import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import BreederList from "@/components/dashboards/admin/BreederList";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartCard from "@/components/dashboards/admin/ChartCard";
import { getAdminStats } from "@/lib/db/admin/getAdminStats";


export default async function AdminPage() {
    const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect('/'); // Redirect if not an admin
  }

  // ✅ Use your clean helper instead
  const stats = await getAdminStats();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <h3 className="text-xl mb-4">Welcome, {session?.user?.name || 'Admin'}!</h3>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>🐾 PurePaws Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold">{stats.totalBreeders}</p>
                        <p className="text-sm text-gray-500">Breeders</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        <p className="text-sm text-gray-500">Users</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{stats.totalDogs}</p>
                        <p className="text-sm text-gray-500">Dogs Listed</p>
                    </div>
                </CardContent>
            </Card>

            {/* User sign ups over time chart */}
            <ChartCard title="📈 User Signups Over Time" data={stats.userSignupsChartData} />
        </div>
    );
}