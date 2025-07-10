'use client';

import { useState } from "react";
import AdoptionRequestsSection from "@/components/AdoptionRequestsSection";
import FavoriteDogsSection from "@/components/FavoriteDogsSection";
import { IDog } from "@/interfaces/dog";

export default function ProfileContent({
  initialAdoptionRequests,
  favoriteDogs,
  puppyApplication,
  puppyInterests
}: {
  initialAdoptionRequests: any[];
  favoriteDogs: IDog[];
  puppyApplication?: any;
  puppyInterests?: any[];
}) {
  const [adoptionRequests, setAdoptionRequests] = useState(initialAdoptionRequests);

  const handleNewRequest = (newRequest: any) => {
    console.log("New request:", newRequest);
    setAdoptionRequests(prev => [...prev, newRequest]);
  };

  return (
    <>
      <AdoptionRequestsSection requests={adoptionRequests} onNewRequest={handleNewRequest} />


      {favoriteDogs.length > 0 ? (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-bold mb-4">Your Favorite Dogs</h3>
          <FavoriteDogsSection
            puppyApplication={puppyApplication}
            initialDogs={favoriteDogs}
            favorites={favoriteDogs}
            puppyInterests={puppyInterests || []}
            onNewRequest={handleNewRequest}
          />
        </div>
      ) : (
        <p className="text-gray-500">You have no favorite dogs yet.</p>
      )}
    </>
  );
}