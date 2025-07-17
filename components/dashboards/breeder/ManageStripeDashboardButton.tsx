// If the platform grows can consider using express dashboard but for now just using standard accounts
// Send user to stripe dashboard to manage payouts

'use client';

import { Button } from "@/components/ui/button";

export default function ManageStripeDashboardButton({ stripeAccountId }: { stripeAccountId: string }) {

    const handleManageStripe = async () => {
        // Redirect to Stripe dashboard for managing payouts
        window.location.href = `https://dashboard.stripe.com/account/${stripeAccountId}`;

        // Note - no longer using this route since express dashboards incur a fee of $2 per account per month 
        // const res = await fetch("/api/stripe/account-login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        // });

        // const data = await res.json();

        // if (data?.url) {
        //     window.location.href = data.url;
        // }
    };

    return (
        <Button size="sm" className="bg-gray-500 hover:bg-gray-600" onClick={handleManageStripe}>
            Manage Payouts
        </Button>
    )
}