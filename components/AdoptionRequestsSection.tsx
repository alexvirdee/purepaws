'use client';


import { IDog } from "@/interfaces/dog";
import DogCard from "./DogCard";
import { Suspense } from "react";
import DogImage from "./DogImage";
import { Skeleton } from "@/components/ui/skeleton";


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
}

export default function AdoptionRequestsSection({
  requests
}: {
  requests: AdoptionRequest[];
}) {


  if (!requests.length) {
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
        {requests.map((request) => (
          <li
            key={request._id}
            className="border rounded shadow hover:shadow-md transition flex flex-col md:flex-row gap-4 p-4"
          >
            {/* Reuse DogCard with limited props */}
            <div className="flex-shrink-0 md:w-1/3">
              {request.dog ? (
                <>
                  <Suspense fallback={<Skeleton className="h-48 rounded" />}>
                    <DogImage src={request.dog.photos?.[0]?.path} alt={request.dog.name} />
                  </Suspense>
                </>
              ) : (
                <div className="bg-gray-200 h-48 w-full flex items-center justify-center">
                  <span className="text-gray-500">No dog data available</span>
                </div>
              )}

            </div>

            {/* Request details */}
            <div className="flex-1">
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
          </li>
        ))}
      </ul>
    </>
  );
}