import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getAdminAdoptionRequests } from "@/lib/db/admin/getAdminAdoptionRequests";
import AdoptionRequestList from "@/components/dashboards/admin/AdoptionRequestList";

export default async function AdminAdoptionRequestsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
        redirect("/"); // Not an admin? goodbye.
    }

    const requests = await getAdminAdoptionRequests();

    return (
        <>
            <div className="flex flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-bold">All adoption requests on PurePaws</h2>

            </div>
            <div className="bg-white rounded-lg shadow flex flex-col">
                <AdoptionRequestList requests={requests} />
            </div>
        </>
    )
}