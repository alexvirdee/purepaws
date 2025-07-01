import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";

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

        // Create new user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        await users.insertOne(newUser);

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
            console.error("Error during signup:", error);
            return NextResponse.json({ message: "Internal server error" }, { status: 500 });
        }
    }