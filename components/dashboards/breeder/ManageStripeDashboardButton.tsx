'use client';

import { Button } from "@/components/ui/button";

export default function ManageStripeDashboardButton() {

    const handleManageStripe = async () => {
        const res = await fetch("/api/stripe/account-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const data = await res.json();

        if (data?.url) {
            window.location.href = data.url;
        }
    };

    return (
        <Button size="sm" className="bg-gray-500 hover:bg-gray-600" onClick={handleManageStripe}>
            Manage Payouts
        </Button>
    )
}