'use client';

import { useEffect, useState } from "react";
import { IDog } from "@/interfaces/dog";
import DogCard from "./DogCard";
import { Suspense } from "react";
import DogImage from "./DogImage";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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


interface InterestRequest {
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
  puppyInterests,
  adoptionRequests,
  onNewRequest
}: {
  puppyInterests: InterestRequest[];
  adoptionRequests: InterestRequest[];
  onNewRequest?: (request: InterestRequest) => void; // Callback for new request
}) {
  const [puppyInterestsState, setPuppyInterestsState] = useState(puppyInterests || []);
  const [adoptionRequestsState, setAdoptionRequestsState] = useState(adoptionRequests || []);

  const activePuppyInterests = puppyInterestsState.filter(
    (r) => r.status !== "cancelled" && r.status !== "deposit-requested"
  );

  const adoptionRequestsActive = adoptionRequestsState.filter(r => r.status !== "cancelled");

  // Add puppyInterests that are deposit-requested AND don’t already exist in adoptionRequests
  const depositRequestedInterests = puppyInterestsState.filter(
    r =>
      r.status === "deposit-requested" &&
      !adoptionRequestsActive.some(a => a.dogId === r.dogId)
  );

  const depositRequests = [...adoptionRequestsActive, ...depositRequestedInterests];

  
  useEffect(() => {
    setPuppyInterestsState(puppyInterests);
  }, [puppyInterests])

  useEffect(() => {
    setAdoptionRequestsState(adoptionRequests);
  }, [adoptionRequests]);

  const handleCancelPuppyInterest = async (requestId: string) => {
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

        setPuppyInterestsState(prev =>
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

        setPuppyInterestsState(prev =>
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

  const handleCompleteDeposit = () => {
    console.log('Complete deposit button clicked');
  }

  const hasActiveInterests = activePuppyInterests.length > 0;
  const hasActiveAdoptions = depositRequests.length > 0;

  if (!hasActiveInterests && !hasActiveAdoptions) {
    return (
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-bold mb-4">Your Adoption Requests</h3>
        <p className="text-gray-500">You haven’t submitted any requests yet.</p>
      </div>
    );
  }

  return (
    <>
      {hasActiveAdoptions && (
        <div>
          <h3 className="text-lg font-bold mb-4">Deposit Requests</h3>
          <ul className="space-y-4">
            {depositRequests.filter(r => r.status !== "cancelled").map(request => (
              <RequestCard
                key={request._id}
                request={request}
                isDeposit
                onCompleteDeposit={handleCompleteDeposit}
              />
            ))}
          </ul>
        </div>
      )}

      {hasActiveInterests && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Puppy Interests</h3>
          <ul className="space-y-4">
            {activePuppyInterests.filter(r => r.status !== "cancelled").map(request => (
              <RequestCard
                key={request._id}
                request={request}
                onCancel={handleCancelPuppyInterest}
                onUpdateMessage={handleUpdateMessage}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function RequestCard({
  request,
  isDeposit = false,
  onCancel,
  onUpdateMessage,
  onCompleteDeposit,
}: {
  request: InterestRequest;
  isDeposit?: boolean;
  onCancel?: (id: string) => void;
  onUpdateMessage?: (id: string, message: string) => void;
  onCompleteDeposit?: () => void;
}) {
  return (
    <li className="border rounded shadow hover:shadow-md transition flex flex-col md:flex-row gap-4 p-4 relative">
      <div className="flex-shrink-0 w-full md:w-auto md:max-w-[200px] flex justify-center items-center md:justify-start">
        {request.dog ? (
          <Suspense fallback={<Skeleton className="h-28 rounded" />}>
            <div className="w-full max-w-[200px] h-28 flex overflow-hidden">
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

      <div className="flex flex-col justify-between flex-1 relative">
        <div className="flex flex-col items-center text-center md:items-start md:text-left md:pr-28">
          <h4 className="text-md font-semibold mb-1">
            {request.dog ? request.dog.name : "Unknown Dog"}
          </h4>
          <Badge>{request.status}</Badge>
          <p className="text-sm text-gray-500 mb-1">
            Message: {request.message || "(No message)"}
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

        <div className="flex justify-center md:justify-end mt-4 md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 gap-2">
          {isDeposit ? (
            <div className="flex flex-col items-start gap-2 max-w-xs text-left">
              <Button onClick={onCompleteDeposit} className="bg-green-600 text-white hover:bg-green-700">
                Complete Deposit
              </Button>
              <p className="text-xs text-gray-500">
                Holds {request.dog.name} until your expiration. If you don’t pay, your request will expire.
              </p>
            </div>
          ) : (
            <>
              <EditRequestMessageDialog
                request={request}
                onSave={(newMsg) => onUpdateMessage && onUpdateMessage(request._id, newMsg)}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-red-600 text-white hover:bg-red-700">
                    Cancel Request
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You can always apply again later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Nevermind</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onCancel && onCancel(request._id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Confirm Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </li>
  );
}