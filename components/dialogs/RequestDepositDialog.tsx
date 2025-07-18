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
import { LoaderIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type RequestDepositDialogProps = {
    dogName: string;
    adoptionRequestId?: string; // Optional for re-sending TODO: Check if needs to be required
    interestId: string;
    mode?: "new" | "resend";
    initialDepositAmount?: number;
    initialExpirationDate?: string;
    initialNote?: string;
    onSubmitted?: () => void;
};

export default function RequestDepositDialog({
    dogName,
    adoptionRequestId,
    interestId,
    mode,
    initialDepositAmount,
    initialExpirationDate,
    initialNote,
    onSubmitted,
}: RequestDepositDialogProps) {
    const [requestingDeposit, setRequestingDeposit] = useState(false);
    const [resendingDeposit, setResendingDeposit] = useState(false);
    const [depositAmount, setDepositAmount] = useState(initialDepositAmount?.toString() || '');
    const [expirationDate, setExpirationDate] = useState(initialExpirationDate ? initialExpirationDate.slice(0, 10) : '');
    const [note, setNote] = useState(initialNote || '');
    const [open, setOpen] = useState(false);

    const router = useRouter();

    console.log("RequestDepositDialog rendered");

    console.log('Which mode:', mode);
    console.log('Initial deposit amount:', initialDepositAmount);
    console.log('Initial expiration date:', initialExpirationDate);

    console.log('interestId:', interestId);
    console.log('adoptionRequestId:', adoptionRequestId);
    console.log('initial note:', initialNote);

    const handleRequestDeposit = async () => {
        if (!depositAmount || !expirationDate) {
            toast.error("Please provide deposit amount and expiration date.");
            return;
        }

        setRequestingDeposit(true);

        try {
            const res = await fetch(`/api/adoption-requests/${interestId}/requestDeposit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    depositAmount: Number(depositAmount),
                    expiresAt: expirationDate,
                    note,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("🎉 Deposit request sent!");
                router.refresh();
                setOpen(false);
                onSubmitted?.();
            } else {
                toast.error(data.message || "Failed to request deposit.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong.");
        } finally {
            setRequestingDeposit(false);
        }
    };

    const resendDepositRequest = async (requestId: string) => {
        console.log(`Re-sending deposit request for ${requestId}`);

        setResendingDeposit(true);

        try {
            const res = await fetch(`/api/adoption-requests/${requestId}/resendDepositRequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({
                    depositAmount: Number(depositAmount),
                    expiresAt: expirationDate,
                    note,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                console.log("Re-sent deposit request:", data);

                toast.success(`Deposit request re-sent! Expires on ${new Date(data.expiresAt).toUTCString()}`);

                router.refresh();
                setOpen(false);
                onSubmitted?.();

                // TODO: handle local state (not added in yet)
                // setInterestsState(prev =>
                //     prev.map(req =>
                //         req.adoptionRequestId === requestId
                //             ? {
                //                 ...req,
                //                 adoptionRequestId: data.adoptionRequestId,
                //                 adoptionRequestStatus: "deposit-requested",
                //                 status: "approved",
                //             }
                //             : req
                //     )
                // );
            } else {
                toast.error("Failed to re-send deposit request.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while re-sending.");
        } finally {
            setResendingDeposit(false);
        }

    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    size="sm"
                    className={`${mode === "resend" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
                        } text-white`}
                >
                    {mode === "resend" ? "Re-Send Deposit" : "Request Deposit"}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="border border-gray-200">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {mode === "resend" ? "Re-Send Deposit Request" : `Request Deposit for ${dogName}`}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {mode === "resend"
                            ? "Update and re-send the deposit request to the buyer."
                            : "Set the deposit amount and expiration date for this adoption request."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <label className="block text-sm font-medium mb-1">Deposit Amount ($)</label>
                        <Input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            min={1}
                            placeholder="e.g. 200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Expiration Date</label>
                        <Input
                            type="date"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Optional Note</label>
                        <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Any additional info for the buyer"
                        />
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <Button onClick={() =>
                        mode === "resend"
                            ? resendDepositRequest(adoptionRequestId || "")
                            : handleRequestDeposit()
                    } disabled={requestingDeposit || resendingDeposit}>
                        {requestingDeposit || resendingDeposit ? (
                            <>
                                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                {mode === "resend" ? "Re-Sending..." : "Sending..."}
                            </>
                        ) : (
                            mode === "resend" ? "Re-Send Deposit Request" : "Send Deposit Request"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
