'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IDog } from "@/interfaces/dog";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


type PuppyInterest = {
    _id: string;   // puppyInterest._id
    dog?: IDog;
    buyer?: any;
    status: string; // status of the interest!
    adoptionRequestId?: string; // NEW: store this if deposit has been requested
    message?: string;
    createdAt?: string;
};

interface AdoptionRequestsProps {
    interests: PuppyInterest[];
}

export default function AdoptionRequests({
    interests,
}: AdoptionRequestsProps) {
    const [interestsState, setInterestsState] = useState(interests);
    const [existingRequestDialog, setExistingRequestDialog] = useState<{
        open: boolean;
        expiresAt?: string;
        adoptionRequestId?: string;
        status?: string;
    } | undefined>(undefined);

    useEffect(() => {
        // Initialize state with the provided interests prop
        setInterestsState(interests);
    }, [interests])

    const handleRequestDeposit = async (requestId: string) => {
        console.log(`Requesting deposit for ${requestId}`);
        // TODO: Call your API route here
        try {
            const res = await fetch(`/api/adoption-requests/${requestId}/requestDeposit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("🎉 Deposit request sent!");
            } else if (res.status === 400 && data.adoptionRequestId) {
                setExistingRequestDialog({
                    open: true,
                    expiresAt: data.expiresAt,
                    adoptionRequestId: data.adoptionRequestId,
                    status: data.status,
                });
            } else {
                toast.error("Failed to request deposit");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const resendDepositRequest = async (requestId: string) => {
        console.log(`Re-sending deposit request for ${requestId}`);

        try {
            const res = await fetch(`/api/adoption-requests/${requestId}/resendDepositRequest`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                const data = await res.json();
                toast.success(`Deposit request re-sent! Expires at ${new Date(data.expiresAt).toLocaleString()}`);

                // Optionally update local state
                setInterestsState(prev =>
                    prev.map(req =>
                        req.adoptionRequestId === requestId
                            ? { ...req, status: "deposit-requested" }
                            : req
                    )
                );

                // Close the dialog
                setExistingRequestDialog(undefined);
            } else {
                toast.error("Failed to re-send deposit request.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while re-sending.");
        }

    }

    const handleCancelDeposit = async (requestId: string) => {
        console.log(`Canceling deposit request for ${requestId}`);
        // TODO: Call your API route here
        try {
            const res = await fetch(`/api/adoption-requests/${requestId}/cancelDeposit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Deposit request has been cancelled successfully.");

                setInterestsState(prev =>
                    prev.map(req =>
                        req.adoptionRequestId === requestId ? { ...req, status: "cancelled", adoptionRequestId: undefined } : req
                    )
                );

            } else {
                toast.error(`Failed to cancel deposit request`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    };


    return (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Adoption Requests</h2>
            {interestsState.length > 0 ? (
                interestsState.map((interest, index) => (
                    <div key={index} className="md:flex md:justify-between items-start border p-4 rounded">
                        {/* Left photo and info */}
                        <div className="flex items-center gap-4">
                            <img src={interest.dog?.photos && interest.dog.photos.length > 0 && interest.dog.photos[0].path
                                ? interest.dog.photos[0].path
                                : "/images/purepaws-placeholder.jpg"} alt={interest.dog?.name || "Puppy"} className="w-20 h-20 object-cover rounded" />
                            <div>
                                <h3 className="font-semibold">{interest.dog?.name}</h3>
                                <div className="pl-[2px]">
                                    <p className="text-sm text-gray-500">From: {interest.buyer?.name} ({interest.buyer?.email})</p>
                                    <p className="text-sm text-gray-500">Message: {interest.message ? interest.message : "No additional message"}</p>
                                    <p className="text-xs text-gray-400">Submitted: {interest.createdAt?.split('T')[0]}</p>
                                    <Badge variant="outline">Status is {interest.status}</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Right: action buttons */}
                        <div className="pt-4 md:p-0 flex flex-col md:flex-row gap-2">
                            {/* If user cancelled their interest request don't render the request deposit button */}
                            {interest.status !== "cancelled" && (
                                <Button
                                    disabled={interest.status === "deposit-requested"}
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 cursor-pointer"
                                    onClick={() => handleRequestDeposit(interest._id)}
                                >
                                    {interest.status === "deposit-requested" ? "Deposit Requested" : "Request Deposit"}
                                </Button>
                            )}
                            {/* Cancel Deposit Request Button */}
                            {/* This button will only show if the request is in deposit-requested state */}
                            {interest.status === "deposit-requested" && (
                                <>
                                    <Button
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm cursor-pointer"
                                        onClick={() => {
                                            if (interest.adoptionRequestId) {
                                                handleCancelDeposit(interest.adoptionRequestId);
                                            } else {
                                                toast.error("Issue finding the request ID.");
                                            }
                                        }}
                                    >
                                        Cancel Deposit Request
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No adoption requests yet.</p>
            )}

            {existingRequestDialog?.open && (
                <Dialog open={existingRequestDialog.open} onOpenChange={(open) => {
                    if (!open) {
                        setExistingRequestDialog(undefined); // close dialog
                    }
                }}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Deposit Already Requested</DialogTitle>
                            <DialogDescription>
                                Looks like you’ve already requested a deposit for this buyer.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2 text-sm text-gray-600">
                            {existingRequestDialog.expiresAt && (
                                <p>Expires at: {new Date(existingRequestDialog.expiresAt).toLocaleString()}</p>
                            )}
                            <p>Status: {existingRequestDialog.status || "N/A"}</p>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    onClick={() => setExistingRequestDialog(undefined)}
                                >
                                    Close
                                </Button>
                            </DialogClose>
                            <Button
                                onClick={() => {
                                    if (existingRequestDialog?.adoptionRequestId) {
                                        resendDepositRequest(existingRequestDialog.adoptionRequestId);
                                    } else {
                                        toast.error("No adoption request ID found.");
                                    }
                                }}
                            >
                                Re-Send Anyway
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}