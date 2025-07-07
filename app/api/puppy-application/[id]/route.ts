import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { DB_NAME } from "@/lib/constants";

export async function PUT(
    req: Request,
    context: { params: { id: string } }
) {
    try {
        let param;
        param = await context.params;

        const applicationId = param.id;

        // Validate ID
        if (!ObjectId.isValid(applicationId)) {
            return NextResponse.json(
                { error: "Invalid application ID" },
                { status: 400 }
            );
        }

        // Parse the request body
        const body = await req.json();
        
        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const result = await db.collection("puppyApplications").updateOne(
            { _id: new ObjectId(applicationId) },
            {
                $set: { ...body, updatedAt: new Date() }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { error: "No changes made or application not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Puppy application updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating puppy application:", error);
        return NextResponse.json(
            { error: "Something went wrong while updating the application" },
            { status: 500 }
        );
    }
}