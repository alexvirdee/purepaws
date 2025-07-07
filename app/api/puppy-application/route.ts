import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { DB_NAME } from "@/lib/constants";


export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only logged in users should be able to submit a puppy application form
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json();

        const {
            city,
            state,
            zip,
            age,
            petsOwned,
            hasChildren,
            puppyPreference,
            genderPreference,
            trainingPlanned,
            desiredTraits,
            additionalComments,
        } = body;

        const name = session?.user?.name || body.name || "";
        const email = session?.user?.email || body.email || "";

        // Basic validation
        if (!name || !email || !city || !state || !zip || !age || !petsOwned || !puppyPreference || !genderPreference) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate number fields
        if (Number(petsOwned) < 0) {
            return NextResponse.json({ error: "Pets owned cannot be negative" }, { status: 400 });
        }

        if (!Number.isInteger(Number(petsOwned))) {
            return NextResponse.json({ error: "Pets owned must be an integer" }, { status: 400 });
        }

        // Age validation
        const applicantAge = Number(age);

        if (applicantAge < 0) {
            return NextResponse.json({ error: "Age must be a positive number" }, { status: 400 });
        }

        if (isNaN(applicantAge) || applicantAge < 18 || applicantAge > 90) {
            return NextResponse.json({ error: "Please enter a valid age" }, { status: 400 });
        }

        if (Number(zip) < 0) {
            return NextResponse.json({ error: "Invalid zip code" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Lookup user ID from the session email
        const user = await db.collection("users").findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 })
        }

        const result = await db.collection("puppyApplications").insertOne({
            userId: user._id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            city: city.trim(),
            state: state.trim(),
            zip: zip.trim(),
            age: Number(age),
            petsOwned: Number(petsOwned),
            hasChildren: Boolean(hasChildren),
            puppyPreference,
            genderPreference,
            trainingPlanned: Boolean(trainingPlanned),
            desiredTraits: desiredTraits?.trim() || "",
            additionalComments: additionalComments?.trim() || "",
            createdAt: new Date(),
            status: "pending", // can use status for admin approvals in the future
        });

        return NextResponse.json({
            success: true,
            message: "Puppy application submitted!",
            applicationId: result.insertedId
        })


    } catch (error) {
        console.error("[PUPPY_APPLICATION_ERROR]", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Lookup user by email to get their _id
        const user = await db.collection("users").findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        const application = await db.collection("puppyApplications").findOne({
            userId: user._id
        })

        return NextResponse.json({ application });

    } catch (error) {
        console.error("[GET_PUPPY_APPLICATION_ERROR]", error);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}

