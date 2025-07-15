import DashboardSidebar from "@/components/dashboards/DashboardSidebar";
import { getBreederDashboardData } from "@/lib/fetchBreederData";
import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function BreederDashboardLayout({ children }: { children: ReactNode }) {
    const { breeder } = await getBreederDashboardData({});

    if (!breeder || breeder.status !== "approved") {
        return (
            <main className="flex flex-col items-center justify-center text-center p-6">
                <Image
                    src="/images/purepaws-logo-transparent.png"
                    alt="Breeder Application Under Review"
                    width={200}
                    height={200}
                    className="mb-1"
                />
                <h1 className="text-2xl font-bold mb-2">Your breeder application is <span className={breeder.status === 'rejected' ? 'text-red-600' : 'text-blue-500'}>{breeder.status}</span></h1>
                <div className="max-w-lg mx-auto">
                    {breeder.status === "pending" && (
                        <p className="text-gray-600 mb-4">
                            Thanks for submitting your breeder application. Our team is reviewing your details.
                            You’ll be notified by email once your account is approved.
                        </p>
                    )}

                    {breeder.status === "rejected" && (
                        <p className="text-gray-600 mb-4">
                            Unfortunately, your breeder application was rejected. If you believe this was in error,
                            please email    <a href="mailto:woofpurepaws@gmail.com">woofpurepaws@gmail.com</a>  for assistance.
                        </p>
                    )}
                </div>
                <Link className="text-blue-500 hover:text-blue-600 flex items-center gap-2" href="/profile">
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Profile
                </Link>
            </main>
        );
    }

    return (
        <main className="flex flex-col md:flex-row min-h-screen">
            <div className="hidden md:block">
                <DashboardSidebar
                    links={[
                        { href: "/dashboard", text: "Dashboard" },
                        { href: "/dashboard/messages", text: "Messages" },
                        { href: "/dashboard/dogs", text: "Dogs" },
                        { href: "/dashboard/litters", text: "Litters" },
                        { href: "/dashboard/requests", text: "Adoption Requests" },
                    ]}
                />
            </div>


            {/* Mobile nav links */}
            <nav className="flex flex-wrap justify-center gap-4 p-4 border-b md:hidden bg-white shadow-sm">
                {[
                    { href: "/dashboard", text: "Dashboard" },
                    { href: "/dashboard/messages", text: "Messages" },
                    { href: "/dashboard/dogs", text: "Dogs" },
                    { href: "/dashboard/litters", text: "Litters" },
                    { href: "/dashboard/requests", text: "Adoption Requests" },
                ].map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        {link.text}
                    </Link>
                ))}
            </nav>

            <section className="flex-1 p-6 overflow-y-auto">
                {children}
            </section>
        </main>
    )
}