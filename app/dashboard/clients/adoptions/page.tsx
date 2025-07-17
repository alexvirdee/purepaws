import { getBreederDashboardData } from "@/lib/fetchBreederData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdoptionRequests from "@/components/dashboards/breeder/AdoptionRequests";

export default async function BreederAdoptionsPage() {
    const { breeder, interests } = await getBreederDashboardData({ includeInterests: true });

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{breeder?.name}</h2>
            </div>
            <Tabs defaultValue="inquiries" className="">
                <TabsList>
                    <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                    <TabsTrigger value="adoptions">Adoptions in progress</TabsTrigger>
                </TabsList>
                <TabsContent value="inquiries">
                     <AdoptionRequests breeder={breeder} interests={interests} />
                </TabsContent>
                <TabsContent value="adoptions">Change your password here.</TabsContent>
            </Tabs>
        </>
    )
}