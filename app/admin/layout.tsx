import DashboardSidebar from "@/components/dashboards/DashboardSidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <main className="flex min-h-screen">
           <DashboardSidebar 
            links={[
                { href: "/admin", text: "Dashboard" },
                { href: "/admin/breeders", text: "Breeders" },
                { href: "/admin/dogs", text: "Dogs" },
                { href: "/admin/litters", text: "Litters" },
            ]}
           />
            <section className="flex-1 p-6 overflow-y-auto">
                {children}
            </section>
        </main>
    )
}