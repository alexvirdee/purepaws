// lib/db/admin/getAdminBreeders.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { DB_NAME } from "@/lib/constants";
import { IBreeder } from "@/interfaces/breeder";

export async function getAdminBreeders() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect("/auth/signin");
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const breeders = await db.collection("breeders").find().toArray();

    return breeders.map((b): IBreeder => ({
        _id: b._id.toString(),
        name: b.name,
        email: b.email,
        status: b.status,
        submittedAt: b.submittedAt?.toString() || null,
        breeds: b.breeds ?? [],
        address: b.address ?? "",
        city: b.city ?? "",
        state: b.state ?? "",
        zip: b.zip ?? "",
        phone: b.phone ?? "",
        website: b.website ?? "",
        latitude: b.latitude ?? 0,
        longitude: b.longitude ?? 0,
        about: b.about ?? "",
    }));
}
