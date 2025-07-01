import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, breeds, address, city, state, zip, about } = body;

    if (!name || !email || !breeds || !address || !city || !state || !zip || !about) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("purepaws");
    const breeders = db.collection('breeders')

    const addressString = `${address}, ${city}, ${state} ${zip || ""}`;

    // Geocode the address to get latitude and longitude
    const geocodeResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressString)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );

    if (!geocodeResponse.ok) {
      console.error("Geocoding error:", geocodeResponse.statusText);
      return NextResponse.json(
        { error: "Failed to geocode address" },
        { status: 500 }
      );
    }

    const geocodeData = await geocodeResponse.json();
    if (!geocodeData.features || geocodeData.features.length === 0) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    const { center } = geocodeData.features[0];
    const [longitude, latitude] = center;   

    // Create the new breeder object
    const newBreeder = {
        name,
        email,
        breeds,
        address,
        city,
        state,
        zip,
        latitude,
        longitude,
        about,
        status: "pending",
        submittedAt: new Date(),
      };

    const result = await breeders.insertOne(newBreeder);

    return NextResponse.json({ 
        success: true, 
        id: result.insertedId,
        message: 'Application submitted successfully! We will review it and get back to you soon.'
        });
  } catch (error) {
    console.error("Error saving breeder application:", error);
    return NextResponse.json(
      { success: false, message: 'Server error. Please try again' },
      { status: 500 }
    );
  }
}