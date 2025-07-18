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
import { CheckIcon, MessageCircleIcon, BanknoteArrowUpIcon, BanknoteArrowDownIcon, EyeIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { IBreeder } from "@/interfaces/breeder";
import RequestDepositDialog from "@/components/dialogs/RequestDepositDialog";


type PuppyInterest = {
    _id: string;   // puppyInterest._id
    dog?: IDog;
    buyer?: any;
    status: string; // status of the interest!
    adoptionRequestId?: string; // NEW: store this if deposit has been requested
    adoptionRequestStatus?: string; // NEW: store the status of the adoption request
    depositAmount?: number; // NEW: store the deposit amount if requested
    expiresAt?: string; // NEW: store the expiration date of the deposit request
    note?: string; // NEW: store any note from the breeder
    message?: string;
    createdAt?: string;
};

interface AdoptionRequestsProps {
    breeder: IBreeder;
    interests: PuppyInterest[];
}

export default function AdoptionRequests({
    breeder,
    interests,
}: AdoptionRequestsProps) {
    const [interestsState, setInterestsState] = useState(interests);
    const [activeDepositDialog, setActiveDepositDialog] = useState<{
        open: boolean;
        mode: "new" | "resend";
        dogName: string;
        interestId: string;
        depositAmount?: number;
        expiresAt?: string;
        note?: string;
    } | null>(null);
    const [reviewBuyer, setReviewBuyer] = useState<PuppyInterest | null>(null);
    const [cancellingDeposit, setCancellingDeposit] = useState<string | null>(null);

    const router = useRouter();

    console.log('interests', interests);

    useEffect(() => {
        // Initialize state with the provided interests prop
        setInterestsState(interests);
    }, [interests])

    const handleCancelDeposit = async (requestId: string) => {
        console.log(`Canceling deposit request for ${requestId}`);

        setCancellingDeposit(requestId);

        try {
            const res = await fetch(`/api/adoption-requests/${requestId}/cancelDeposit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Deposit request has been cancelled successfully.");

                setInterestsState(prev =>
                    prev.map(req =>
                        req.adoptionRequestId === requestId ? {
                            ...req,
                            adoptionRequestId: undefined,
                            adoptionRequestStatus: undefined,
                            status: "approved" // Reset status to approved
                        } : req
                    )
                );

            } else {
                toast.error(`Failed to cancel deposit request`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setCancellingDeposit(null); // Reset cancel state
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

                // Send email notification to buyer if chat was just created
                if (data.newlyCreated) {
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
                }
            } else {
                toast.error(data.error || "Failed to start chat");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong starting the chat");
        }
    };

    const handleApproveBuyer = async (interestId: string) => {
        try {
            const res = await fetch(`/api/puppy-interests/${interestId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "approved",
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Buyer approved successfully");

                // Update local state to reflect new status
                setInterestsState(prev =>
                    prev.map(req =>
                        req._id === interestId ? { ...req, status: "approved" } : req
                    )
                );

                // Close the modal if open 
                setReviewBuyer(null);
            } else {
                toast.error(data.error || "Failed to approve buyer")
            }
        } catch (error) {
            console.error("error: ", error);
            toast.error("Something went wrong approving the buyer. Please try again.");
        }
    }


    return (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Inquiries</h2>
            {interestsState.length > 0 ? (
                interestsState.map((interest, index) => {
                    const hasDepositBeenRequested = interest.adoptionRequestStatus === "deposit-requested" || interest.adoptionRequestStatus === "cancelled-deposit";
                    const showNewDialog = interest.status === "approved" && !hasDepositBeenRequested;

                    console.log('interest:', interest);

                    return (
                        <div key={index} className="md:flex md:justify-between items-start border p-4 rounded">
                            {/* Left photo and info */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        interest.dog?.photos && interest.dog.photos.length > 0 && interest.dog.photos[0].path
                                            ? interest.dog.photos[0].path
                                            : "/images/purepaws-placeholder.jpg"
                                    }
                                    alt={interest.dog?.name || "Puppy"}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-semibold">{interest.dog?.name}</h3>
                                    <div className="pl-[2px]">
                                        <p className="text-sm text-gray-500">
                                            From: {interest.buyer?.name} ({interest.buyer?.email})
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Message: {interest.message ? interest.message : "No additional message"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Submitted: {interest.createdAt?.split("T")[0]}
                                        </p>
                                        <Badge variant="outline">Status is {interest.status}</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Right: action buttons for deposit request */}
                            <div className="pt-4 md:p-0 flex flex-col md:flex-row gap-2">
                                <div className="pt-4 md:p-0 flex flex-col gap-2">
                                    {interest.status === "pending" ? (
                                        <Button
                                            size="sm"
                                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm cursor-pointer"
                                            onClick={() => setReviewBuyer(interest)}
                                        >
                                            <EyeIcon /> Review Buyer
                                        </Button>
                                    ) : (
                                        <>
                                            {/* Only show deposit request/resend button if deposit is NOT already requested */}
                                            {interest.adoptionRequestStatus !== "deposit-requested" && (
                                                showNewDialog ? (
                                                    <RequestDepositDialog
                                                        dogName={interest.dog?.name || "Puppy"}
                                                        interestId={interest._id}
                                                        mode="new"
                                                    />
                                                ) : (
                                                    <RequestDepositDialog
                                                        dogName={interest.dog?.name || "Puppy"}
                                                        adoptionRequestId={interest.adoptionRequestId}
                                                        interestId={interest._id}
                                                        mode="resend"
                                                        initialDepositAmount={interest.depositAmount}
                                                        initialExpirationDate={interest.expiresAt}
                                                        initialNote={interest.note}
                                                        onSubmitted={() => setActiveDepositDialog(null)}
                                                    />
                                                )
                                            )}
                                            {/* If deposit requested, show cancel */}
                                            {interest.status === "approved" &&
                                                interest.adoptionRequestStatus === "deposit-requested" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm cursor-pointer"
                                                        onClick={() => {
                                                            if (interest.adoptionRequestId) {
                                                                handleCancelDeposit(interest.adoptionRequestId);
                                                            } else {
                                                                toast.error("Issue finding the request ID.");
                                                            }
                                                        }}
                                                    >
                                                        {cancellingDeposit === interest.adoptionRequestId ? (
                                                            <LoaderIcon className="animate-spin w-4 h-4" />
                                                        ) : (
                                                            <>
                                                                <BanknoteArrowDownIcon /> Cancel Deposit Request
                                                            </>
                                                        )}
                                                    </Button>
                                                )}

                                            {/* Always allow re-review */}
                                            <Button
                                                size="sm"
                                                className="bg-green-500 hover:bg-green-600 cursor-pointer"
                                                onClick={() => setReviewBuyer(interest)}
                                            >
                                                <EyeIcon /> Review Buyer
                                            </Button>

                                            <Button
                                                size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                                                onClick={() => {
                                                    handleStartChat(interest._id, interest.buyer?._id);
                                                }}
                                            >
                                                <MessageCircleIcon /> Chat with buyer
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-gray-500">No inquiries yet.</p>
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
                            {reviewBuyer?.status !== "approved" && (
                                <Button className="bg-green-500 hover:bg-green-600 cursor-pointer" onClick={() => {
                                    if (reviewBuyer) {
                                        handleApproveBuyer(reviewBuyer._id);
                                    }
                                }}><CheckIcon />Approve</Button>
                            )}
                            <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer" onClick={() => {
                                handleStartChat(reviewBuyer._id, reviewBuyer.buyer?._id);
                            }}><MessageCircleIcon /> Chat with buyer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}