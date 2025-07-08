import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { breederId, status } = await req.json();

        if (!breederId || !status) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        if (!["approved", "pending", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const breederObjectId = new ObjectId(breederId);

        const breederUpdate = await db.collection("breeders").updateOne(
            { _id: breederObjectId },
            { $set: { status } }
        );

        if (breederUpdate.modifiedCount === 0) {
            return NextResponse.json({ error: "Breeder not found or status unchanged." }, { status: 404 });
        }

        // ✅ 2. Find associated user
        const breeder = await db.collection("breeders").findOne({ _id: breederObjectId });
        if (!breeder?.email) {
            return NextResponse.json({ error: "Breeder has no associated email." }, { status: 400 });
        }

        const user = await db.collection("users").findOne({ email: breeder.email });
        if (!user) {
            return NextResponse.json({ error: "Associated user not found." }, { status: 404 });
        }


        // ✅ 3. Update user role & breederId based on new status
        let userUpdate = {};

        if (user.role !== "admin") {
            if (status === "approved") {
                userUpdate = {
                    role: "breeder",
                    breederId: user.breederId ? user.breederId : breeder._id // set if not already
                };
            } else {
                userUpdate = {
                    role: "viewer",
                    breederId: null // optional: clear if you prefer
                };
            }
        } else {
            console.log(`User ${user.email} is admin; skipping role/breederId sync.`);
        }


        if (Object.keys(userUpdate).length > 0) {
            await db.collection("users").updateOne(
                { _id: user._id },
                { $set: userUpdate }
            );
        }


        return NextResponse.json({
            message: `Breeder status updated to "${status}" and user role synced.`
        });

    } catch (error) {
        console.error("[API] Admin Breeder Status Error:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}