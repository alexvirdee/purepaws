'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderIcon } from "lucide-react";

export default function ConnectStripeAccountButton() {
    const [connecting, setConnecting] = useState(false);

    const handleStripeConnect = async () => {
        setConnecting(true);

        try {
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
        } catch (error) {
            console.error("Stripe connect error", error);
        } finally {
            setConnecting(false);
        }
    };

    return (
        <Button
            disabled={connecting}
            size="sm"
            className="bg-[#6772E5]"
            onClick={handleStripeConnect}
        >
            {connecting ? (
                <>
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : (
                "Connect With Stripe"
            )}
        </Button>
    )
}