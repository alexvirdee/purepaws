'use client';

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type AdoptionRequest = {
    _id: string;
    dog?: Dog;
    buyer?: Buyer;
    status: string;
    message?: string;
    createdAt?: string;
};

interface AdoptionRequestsProps {
    adoptionRequests: AdoptionRequest[];
}

export default function AdoptionRequests({
    adoptionRequests,
}: AdoptionRequestsProps) {

    const handleRequestDeposit = async (requestId: string) => {
        console.log(`Requesting deposit for ${requestId}`);
        // TODO: Call your API route here
        try {
            const res = await fetch(`/api/adoption-requests/${requestId}/requestDeposit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to request deposit");

            toast.success("🎉 Deposit request sent!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    };


    return (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Adoption Requests</h2>
            {adoptionRequests.length > 0 ? (
                adoptionRequests.map((request) => (
                    <div key={request._id} className="md:flex md:justify-between items-start border p-4 rounded">
                        {/* Left photo and info */}
                        <div className="flex items-center gap-4">
                            <img src={request.dog?.photos && request.dog.photos.length > 0 && request.dog.photos[0].path
                                ? request.dog.photos[0].path
                                : "/images/purepaws-placeholder.jpg"} alt={request.dog.name || "Puppy"} className="w-20 h-20 object-cover rounded" />
                            <div>
                                <h3 className="font-semibold">{request.dog?.name}</h3>
                                <p className="text-sm text-gray-500">From: {request.buyer?.name} ({request.buyer?.email})</p>
                                <p className="text-sm text-gray-500">Status: {request.status}</p>
                                <p className="text-sm">{request.message}</p>
                                <p className="text-xs text-gray-400">Submitted: {request.createdAt?.split('T')[0]}</p>
                            </div>
                        </div>

                        {/* Right: action buttons */}
                        <div className="pt-4 md:p-0 flex flex-col gap-2">
                                <Button
                                    disabled={request.status === "deposit-requested"}
                                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                    onClick={() => handleRequestDeposit(request._id)}
                                >
                                    {request.status === "deposit-requested" ? "Deposit Requested" : "Request Deposit"}
                                </Button>
                            {/* You can add more buttons here later if needed */}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No adoption requests yet.</p>
            )}
        </div>
    )
}