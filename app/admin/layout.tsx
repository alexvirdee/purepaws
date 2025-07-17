import DashboardSidebar from "@/components/dashboards/DashboardSidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <main className="flex min-h-screen">
           <DashboardSidebar 
            links={[
                { type: "link", href: "/admin", text: "Dashboard" },
                { type: "link", href: "/admin/breeders", text: "Breeders" },
                { type: "link", href: "/admin/dogs", text: "Dogs" },
                { type: "link", href: "/admin/litters", text: "Litters" },
            ]}
           />
            <section className="flex-1 p-6 overflow-y-auto">
                {children}
            </section>
        </main>
    )
}