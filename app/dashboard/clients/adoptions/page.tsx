import { getBreederDashboardData } from "@/lib/fetchBreederData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdoptionRequests from "@/components/dashboards/breeder/AdoptionRequests";

export default async function BreederAdoptionsPage() {
    const { breeder, interests } = await getBreederDashboardData({ includeInterests: true, interestFilter: "inquiries" });

    const { interests: adoptionsInProgress } = await getBreederDashboardData({
        includeInterests: true,
        interestFilter: "active"
    });

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{breeder?.name}</h2>
            </div>
            <Tabs defaultValue="inquiries" className="">
                <TabsList className="mb-2">
                    <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                    <TabsTrigger value="adoptions">Adoptions in progress</TabsTrigger>
                </TabsList>
                <TabsContent value="inquiries">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Inquiries</h2>
                        <AdoptionRequests breeder={breeder} interests={interests} />
                    </div>
                </TabsContent>
                <TabsContent value="adoptions">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Adoptions in Progress</h2>
                        <AdoptionRequests breeder={breeder} interests={adoptionsInProgress} />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}