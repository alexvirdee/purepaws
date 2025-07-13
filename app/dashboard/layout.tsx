import BreederDashboardSidebar from "@/components/breeder-dashboard/BreederDashboardSidebar";
import { ReactNode } from "react";

export default function BreederDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <main className="flex min-h-screen">
           <BreederDashboardSidebar />
            <section className="flex-1 p-6 overflow-y-auto">
                {children}
            </section>
        </main>
    )
}