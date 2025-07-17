'use client';

import { Button } from "@/components/ui/button";

export default function ConnectStripeAccountButton() {
    const handleStripeConnect = async () => {
        const res = await fetch("/api/stripe/create-account-link", {
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
        <Button size="sm" className="bg-[#6772E5]" onClick={handleStripeConnect}>
            Connect With Stripe
        </Button>
    )
}