import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import BreederList from "@/components/admin/BreederList";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartCard from "@/components/admin/ChartCard";


export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect('/'); // Redirect to home if not authenticated or not an admin
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Fetch breeders from the database
    const breeders = await db.collection("breeders").find().toArray();
    const totalBreeders = breeders.length;

    const users = await db.collection("users").find().toArray();
    const totalUsers = users.length;

    const userSignupsByDate: Record<string, number> = {};

    users.forEach((user) => {
        if (! user.createdAt) return; // Skip if createdAt is not available

        const createdAt = 
            typeof user.createdAt === "string"
                ? new Date(user.createdAt)
                : user.createdAt instanceof Date 
                ? user.createdAt
                : new Date(user.createdAt.toString()); // Ensure createdAt is a Date object

        if (isNaN(createdAt.getTime())) return; // Skip if createdAt is invalid

        const date = new Date(user.createdAt).toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
        userSignupsByDate[date] = (userSignupsByDate[date] || 0) + 1; // Count signups per day
    });

    // Convert the userSignupsByDate object to an array for the chart
    const userSignupsChartData = Object.entries(userSignupsByDate).map(([date, count]) => ({
        date,   
        count,
    }));

    const dogs = await db.collection("dogs").find().toArray();
    const totalDogs = dogs.length;

    // Serialize the breeders to JSON and ensure all IBreeder fields are included
    const serializedBreeders = breeders.map(breeder => ({
        _id: breeder._id.toString(), // stays ObjectId because IBreeder expects ObjectId
        name: breeder.name,
        email: breeder.email,
        breeds: breeder.breeds,
        address: breeder.address,
        city: breeder.city,
        state: breeder.state,
        zip: breeder.zip,
        latitude: breeder.latitude,
        longitude: breeder.longitude,
        website: breeder.website || "",  // fallback if optional
        about: breeder.about,
        status: breeder.status,
        submittedAt: breeder.submittedAt,
    }));

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
                        <p className="text-2xl font-bold">{totalBreeders}</p>
                        <p className="text-sm text-gray-500">Breeders</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{totalUsers}</p>
                        <p className="text-sm text-gray-500">Users</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{totalDogs}</p>
                        <p className="text-sm text-gray-500">Dogs Listed</p>
                    </div>
                </CardContent>
            </Card>

            {/* User sign ups over time chart */}
            <ChartCard title="📈 User Signups Over Time" data={userSignupsChartData} />

            <BreederList breeders={serializedBreeders} />
        </div>
    );
}