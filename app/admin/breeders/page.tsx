import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import BreederList from "@/components/dashboards/admin/BreederList";
import { getAdminBreeders } from "@/lib/db/admin/getAdminBreeders";

export default async function AdminBreedersPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect("/"); // Not an admin? goodbye.
    }

    const breeders = await getAdminBreeders();

    return (
        <>
            <div className="flex flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-bold">All breeders on PurePaws</h2>

            </div>
            <div className="bg-white rounded-lg shadow flex flex-col">
                <BreederList breeders={breeders} />
            </div>
        </>
    )
}