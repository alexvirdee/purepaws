import { SidebarLink } from "@/components/breeder-dashboard/SidebarLink";
import Image from "next/image";

import { ReactNode } from "react";

export default function BreederDashboardLayout({ children }: { children: ReactNode }) {
    return (
        <main className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r dark:bg-gray-900 dark:border-gray-800 p-4">
                <div className="flex items-center mb-8">
                    {/* Logo */}
                    <Image src="/images/purepaws-logo-transparent.png" width={125} height={100} alt="PurePaws" className="" />
                </div>
                <nav className="flex flex-col gap-4">
                    <SidebarLink href="/dashboard" text="Dashboard" />
                    <SidebarLink href="/dashboard/dogs" text="Dogs" />
                    <SidebarLink href="/dashboard/litters" text="Litters" />
                    <SidebarLink href="/dashboard/requests" text="Adoption Requests" />
                </nav>
            </aside>
            <section className="flex-1 p-6 overflow-y-auto">
                {children}
            </section>
        </main>
    )
}