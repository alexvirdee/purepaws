'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ConnectStripeAccountButton() {
    const [connecting, setConnecting] = useState(false);

    const handleStripeConnect = async () => {
        setConnecting(true);

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
        setConnecting(false);
    };

    return (
        <Button disabled={connecting} size="sm" className="bg-[#6772E5]" onClick={handleStripeConnect}>
           {connecting ? 'Connecting...' : 'Connect With Stripe'} 
        </Button>
    )
}