'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon, LoaderIcon } from "lucide-react";

type CompleteDepositDialogProps = {
    dogName: string;
    requestId: string;
    breederStripeAccountId: string;
    amount: number; // in cents
    buyerEmail: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export default function CompleteDepositDialog({
    dogName,
    requestId,
    breederStripeAccountId,
    amount,
    buyerEmail,
    open,
    onOpenChange,
}: CompleteDepositDialogProps) {
    const [sendingDeposit, setSendingDeposit] = useState(false);

    const handleCompleteDeposit = async () => {
        setSendingDeposit(true);

        try {
            const res = await fetch(`/api/deposits/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestId,
                    dogName,
                    breederStripeAccountId,
                    amount,
                    buyerEmail,
                }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || "Failed to create checkout session.");
                setSendingDeposit(false);
            }
        } catch (error) {
            console.error("Error creating checkout session:", error);
            toast.error("Something went wrong. Please try again.");
            setSendingDeposit(false);
        }
    };


    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700" size="sm">
                    Complete Deposit
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-gray-200">
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deposit Payment</AlertDialogTitle>
                    <AlertDialogDescription>
                        You’re about to pay a non-refundable deposit for <strong>{dogName}</strong>.
                        <br />
                        Please ensure you've reviewed everything with the breeder.
                        <br /><br />
                        <span className="text-red-500 font-medium">This deposit is non-refundable.</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <Button onClick={handleCompleteDeposit} className="bg-green-600 hover:bg-green-700">
                        {sendingDeposit ? (
                            <>
                                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" /> 
                            </>
                        )
                            : (
                                <>
                                    Confirm & Pay
                                </>
                            )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
