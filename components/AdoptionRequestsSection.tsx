'use client';

import { useEffect, useState } from "react";
import { IDog } from "@/interfaces/dog";
import DogCard from "./DogCard";
import { Suspense } from "react";
import DogImage from "./DogImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EditRequestMessageDialog from "./EditRequestMessageDialog";


interface AdoptionRequest {
  _id: string;
  userId: string;
  breederId: string;
  puppyApplicationId: string | null; // If this request is linked to a puppy application
  dogId: string;
  message: string;
  status: string;
  createdAt: string | null;
  dog: any | IDog | null; // Dog data, can be null if not available
  onNewRequest?: (request: {
    _id: string;
    dogId: string;
    breederId: string;
    puppyApplicationId?: string;
    status: string;
    createdAt: string;
    message: string;
    dog: {
      _id: string;
      name: string;
      photos: any[];
    };
  }) => void; // Callback for new request
}

export default function AdoptionRequestsSection({
  requests,
  onNewRequest
}: {
  requests: AdoptionRequest[];
  onNewRequest?: (request: AdoptionRequest) => void; // Callback for new request
}) {
  const [puppyInterestRequests, setPuppyInterestRequests] = useState(requests);

  useEffect(() => {
    setPuppyInterestRequests(requests);
  }, [requests])

  const handleCancelRequest = async (requestId: string) => {
    try {
      const res = await fetch(`/api/puppy-interests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "cancelled" })
      });

      if (res.ok) {
        toast.success(`Adoption request cancelled successfully.`);

        setPuppyInterestRequests(prev =>
          prev.map(r =>
            r._id === requestId ? { ...r, status: "cancelled" } : r
          )
        );
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error(
        `Something went wrong: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  const handleUpdateMessage = async (requestId: string, newMessage: string) => {
    try {
      const res = await fetch(`/api/puppy-interests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (res.ok) {
        toast.success("Message updated successfully!");

        setPuppyInterestRequests(prev =>
          prev.map(r =>
            r._id === requestId ? { ...r, message: newMessage } : r
          )
        );
      } else {
        const error = await res.json();
        toast.error(error?.error || "Failed to update message.");
      }
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error(
        `Something went wrong: ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  const hasActiveRequests = puppyInterestRequests.some(
  request => request.status !== "cancelled"
);


  if (!hasActiveRequests) {
    return (
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-bold mb-4">Your Adoption Requests</h3>
        <p className="text-gray-500">You haven’t submitted any adoption requests yet.</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-lg font-bold mb-4">Your Adoption Requests</h3>
      <ul className="space-y-4">
        {puppyInterestRequests
          .filter(request => request.status !== "cancelled")
          .map((request, index) => (
            <li
              key={index}
              className="border rounded shadow hover:shadow-md transition flex flex-col md:flex-row gap-4 p-4 relative"
            >
              {/* Dog image */}
              <div className="flex-shrink-0 w-full md:w-auto md:max-w-[200px] flex justify-center items-center md:justify-start">
                {request.dog ? (
                  <Suspense fallback={<Skeleton className="h-28 rounded" />}>
                    <div className="w-full max-w-[200px] h-28 flex overflow-hiddens">
                      <DogImage
                        width={200}
                        height={90}
                        src={request.dog.photos?.[0]?.path}
                        alt={request.dog.name}
                        additionalContainerStyles="rounded-lg"
                      />
                    </div>
                  </Suspense>
                ) : (
                  <div className="bg-gray-200 h-28 w-full flex items-center justify-center">
                    <span className="text-gray-500">No dog data available</span>
                  </div>
                )}
              </div>

              {/* Request details container */}
              <div className="flex flex-col justify-between flex-1 relative">
                {/* Details block */}
                <div className="flex flex-col items-center text-center md:items-start md:text-left md:pr-28">
                  <h4 className="text-md font-semibold mb-1">
                    {request.dog ? request.dog.name : "Unknown Dog"}
                  </h4>
                  <p className="text-sm text-gray-500 mb-1">
                    Status: <span className="capitalize font-medium">{request.status}</span>
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Message: {request.message || "(No message provided)"}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    Submitted:{" "}
                    {request.createdAt
                      ? new Date(request.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                  <a
                    href={`/dogs/${request.dog?._id}`}
                    className="text-blue-600 underline text-sm"
                  >
                    View Dog
                  </a>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center md:justify-end mt-4 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 gap-2">
                  <EditRequestMessageDialog
                    request={request}
                    onSave={handleUpdateMessage}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer" size="sm" variant="destructive">Cancel Request</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You can always submit a new request later if you change your mind.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancelRequest(request._id)}
                          className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                          Confirm Cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>




                </div>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}