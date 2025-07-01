import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const db = await clientPromise;
        const users = db.db("purepaws").collection("users");

        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        //  Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if email and approved status is in breeders collection and update the role to "breeder"
        const breeder = await db.db("purepaws").collection("breeders").findOne({ email, status: "approved" });

        const role = breeder ? "breeder" : "viewer"; // Default to viewer if not a breeder
        
        const breederId = breeder ? new ObjectId(breeder._id) : null;

        // Create new user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role,
            breederId,
            createdAt: new Date(),
        };

        await users.insertOne(newUser);

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
            console.error("Error during signup:", error);
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    }