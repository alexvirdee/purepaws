import BreederDogsTable from "@/components/breeder-dashboard/BreederDogsTable";
import { getBreederDashboardData } from "@/lib/fetchBreederData";

export default async function BreederDogsPage() {
    const { breeder, dogs } = await getBreederDashboardData({ includeDogs: true });

    return (
        <>
        <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{breeder?.name}</h2>
                </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-6">
            {dogs.length > 0 ? (
                <BreederDogsTable breederName={breeder?.name} dogs={dogs} />
            ) : (
                <p className="text-gray-500">
                    You haven't listed any dogs yet. Click "Add Dog" to get started!
                </p>
            )}
        </div>
        </>
    )
}