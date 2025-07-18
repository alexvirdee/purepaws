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
    interestId: string;
    mode?: "new" | "resend";
    initialDepositAmount?: number;
    initialExpirationDate?: string;
    initialNote?: string;
    onSubmitted?: () => void;
};

export default function RequestDepositDialog({
    dogName,
    interestId,
    mode,
    initialDepositAmount,
    initialExpirationDate,
    initialNote,
    onSubmitted,
}: RequestDepositDialogProps) {
    const [requestingDeposit, setRequestingDeposit] = useState(false);
    const [depositAmount, setDepositAmount] = useState(initialDepositAmount?.toString() || '');
    const [expirationDate, setExpirationDate] = useState(initialExpirationDate || '');
    const [note, setNote] = useState(initialNote || '');
    const router = useRouter();

    console.log("RequestDepositDialog rendered");

    console.log('Which mode:', mode);

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

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="sm"
                    className="bg-blue-500 text-white hover:bg-blue-600"
                >
                    Request Deposit
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="border border-gray-200">
                <AlertDialogHeader>
                    <AlertDialogTitle>Request Deposit for {dogName}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Set the deposit amount and expiration date for this adoption request.
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
                    <Button onClick={handleRequestDeposit} disabled={requestingDeposit}>
                        {requestingDeposit ? (
                            <>
                                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Deposit Request"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
