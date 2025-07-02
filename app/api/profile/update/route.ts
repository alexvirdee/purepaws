import { NextRequest, NextResponse } from "next/server";
import { getServerSession, DefaultSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

declare module "next-auth" {
    interface Session {
        user?: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
            breederId?: string;
        } & DefaultSession["user"];
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await req.json();

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        } 

        const client = await clientPromise;
        const db = client.db("purepaws");

        // Update the user name in the 'users' collection in the db]
        await db.collection("users").updateOne(
            { email: session.user.email },
            { $set: { name: name.trim() } }
        )

        // If the user is a breeder, also update the breeders collection
        if (session.user.role === "breeder" && session.user.breederId) {
            await db.collection("breeders").updateOne(
                { _id: new ObjectId(session.user.breederId) },
                { $set: { name } }  
            )
        }

        return NextResponse.json({ success: true, message: "Profile updated!" });
    } catch (error) {
        console.error("Error updating profile:", error);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}