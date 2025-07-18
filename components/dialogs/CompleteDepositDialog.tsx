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
    breederName?: string; // Optional, if you want to display breeder name
    breederNote?: string; // Optional, if you want to display a note from the breeder
    amount: number; // in cents
    buyerEmail: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export default function CompleteDepositDialog({
    dogName,
    requestId,
    breederName,
    breederNote,
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
                    <AlertDialogDescription className="space-y-4">
                        <p>
                            You’re about to pay a <span className="font-semibold text-red-500">non-refundable</span> deposit for <span className="font-semibold">{dogName}</span>.
                            Please ensure you've reviewed all terms with the breeder before proceeding.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-md border space-y-2">
                            <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Payment Summary</h4>
                            <div className="text-sm text-gray-700">
                                <p><span className="font-medium">Puppy:</span> {dogName}</p>
                                <p><span className="font-medium">Breeder:</span> {breederName}</p>
                                <p><span className="font-medium">Deposit Amount:</span> ${amount / 100}</p>
                                <p><span className="font-medium">Note from breeder:</span>{breederNote}</p>
                            </div>
                        </div>
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
