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
} from "@/components/ui/dialog";
import { CheckIcon, MessageCircleIcon } from "lucide-react";
// import ChatWidget from "@/components/ChatWidget";
import { useRouter } from "next/navigation";


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
    const [reviewBuyer, setReviewBuyer] = useState<PuppyInterest | null>(null);
    const [activeConversation, setActiveConversation] = useState<any>(null);

    const router = useRouter();

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

    // Breeder starts chat with buyer
    const handleStartChat = async (interestId: string, buyerId: string) => {
        try {
            const res = await fetch("/api/conversations/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ puppyInterestId: interestId, buyerId }),
            });

            const data = await res.json();

            if (res.ok) {
                // toast.success("Chat started!");

                // Close the review buyer dialog
                setReviewBuyer(null);

                // Route breeder to the messages page in their dashboard
                router.push(`/dashboard/messages?conversation=${data.conversationId}`);

                // Send email notification to buyer
                const emailRes = await fetch("/api/email/notify-buyer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: data.buyerEmail,
                        buyerName: data.buyerName,
                        breederName: data.breederName,
                        dogName: data.dogName,
                        conversationId: data.conversationId,
                    }),
                });

                if (!emailRes.ok) {
                    console.error("Failed to send email notification to buyer");
                }
            } else {
                toast.error(data.error || "Failed to start chat");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong starting the chat");
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

                        {/* Right: action buttons for deposit request */}
                        <div className="pt-4 md:p-0 flex flex-col md:flex-row gap-2">
                            {/* Breeder must approve buyer before requesting a deposit */}
                            {/* Right: action buttons for each interest */}
                            <div className="pt-4 md:p-0 flex flex-col md:flex-row gap-2">
                                {interest.status === "pending" ? (
                                    // SHOW REVIEW BUTTON
                                    <Button
                                        className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 cursor-pointer"
                                        onClick={() => setReviewBuyer(interest)}
                                    >
                                        Review Buyer
                                    </Button>
                                ) : (
                                    <>
                                        {/* If NOT cancelled, show request deposit */}
                                        {interest.status !== "cancelled" && (
                                            <Button
                                                disabled={interest.status === "deposit-requested"}
                                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 cursor-pointer"
                                                onClick={() => handleRequestDeposit(interest._id)}
                                            >
                                                {interest.status === "deposit-requested"
                                                    ? "Deposit Requested"
                                                    : "Request Deposit"}
                                            </Button>
                                        )}

                                        {/* If deposit requested, show cancel */}
                                        {interest.status === "deposit-requested" && (
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
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No adoption requests yet.</p>
            )}

            {/* Review Buyer Dialog */}
            {reviewBuyer && (
                <Dialog open={!!reviewBuyer} onOpenChange={(v) => { if (!v) setReviewBuyer(null) }}>
                    <DialogContent className="max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Buyer Application: {reviewBuyer.buyer?.name}</DialogTitle>
                            <DialogDescription>{reviewBuyer.buyer?.email}

                                {reviewBuyer._id}, {reviewBuyer.buyer?._id}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Here: display puppyApplication info nicely */}
                        <div className="flex flex-col space-evenly text-sm">
                            <p><strong>City:</strong> {reviewBuyer.buyer?.city}</p>
                            <p><strong>State:</strong> {reviewBuyer.buyer?.state}</p>
                            <p><strong>Age:</strong> {reviewBuyer.buyer?.age}</p>
                            <p><strong>Pets Owned:</strong> {reviewBuyer.buyer?.petsOwned}</p>
                            <p><strong>Has Children:</strong> {reviewBuyer.buyer?.hasChildren ? "Yes" : "No"}</p>
                            <p><strong>Puppy Preference:</strong> {reviewBuyer.buyer?.puppyPreference}</p>
                            <p><strong>Gender Preference:</strong> {reviewBuyer.buyer?.genderPreference}</p>
                            <p><strong>Training Planned:</strong> {reviewBuyer.buyer?.trainingPlanned}</p>
                            <p><strong>Desired Traits:</strong> {reviewBuyer.buyer?.desiredTraits}</p>
                            <p><strong>Additional Comments:</strong> {reviewBuyer.buyer?.additionalComments}</p>
                        </div>

                        <DialogFooter>
                            <Button className="bg-green-500 hover:bg-green-600 cursor-pointer" onClick={() => {
                                // call your API to approve puppyInterest
                                // update status to "approved"
                                toast.success("Buyer approved!")
                                setReviewBuyer(null)
                            }}><CheckIcon />Approve</Button>
                            <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer" onClick={() => {
                                handleStartChat(reviewBuyer._id, reviewBuyer.buyer?._id);
                            }}><MessageCircleIcon /> Chat with buyer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Existing deposit request dialog */}
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

            {/* {activeConversation && (
                <ChatWidget
                    conversationId={activeConversation._id}
                    onClose={() => setActiveConversation(null)}
                />
            )} */}
        </div>
    )
}