import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";

export async function getAdminStats() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
        redirect("/auth/signin");
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const breeders = await db.collection("breeders").find().toArray();
    const users = await db.collection("users").find().toArray();
    const dogs = await db.collection("dogs").find().toArray();

    const userSignupsByDate: Record<string, number> = {};
    users.forEach((user) => {
        if (!user.createdAt) return;
        const createdAt = new Date(user.createdAt);
        if (isNaN(createdAt.getTime())) return;
        const date = createdAt.toISOString().split("T")[0];
        userSignupsByDate[date] = (userSignupsByDate[date] || 0) + 1;
    });

    const userSignupsChartData = Object.entries(userSignupsByDate).map(([date, count]) => ({
        date,
        count,
    }));

    return {
        totalUsers: users.length,
        totalBreeders: breeders.length,
        totalDogs: dogs.length,
        userSignupsChartData,
    };
}
