import BreederDogsTable from "@/components/breeder-dashboard/BreederDogsTable";
import { getBreederDashboardData } from "@/lib/fetchBreederData";
import AdoptionRequests from "@/components/breeder-dashboard/AdoptionRequests";

export default async function BreederRequestsPage() {
    const { breeder, interests } = await getBreederDashboardData({ includeInterests: true });

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{breeder?.name}</h2>
            </div>
            <AdoptionRequests interests={interests} />
        </>
    )
}