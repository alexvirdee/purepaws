'use client';

import { useState } from "react";
import ReservedPuppiesSection from "./ReservedPuppiesSection";
import AdoptionRequestsSection from "@/components/profile/AdoptionRequestsSection";
import FavoriteDogsSection from "@/components/FavoriteDogsSection";
import { IDog } from "@/interfaces/dog";

export default function ProfileContent({
  favoriteDogs,
  puppyApplication,
  puppyInterests,
  adoptionRequests,
  breederId = null, // Optional breederId prop for future use
  userId = null, // Optional userId prop for future use
}: {
  favoriteDogs: IDog[];
  puppyApplication?: any;
  puppyInterests?: any[];
  adoptionRequests: any[];
  breederId?: string | null; // Optional breederId prop for future use
  userId?: string | null; // Optional userId prop for future use
}) {
  const [interestRequests, setInterestRequests] = useState(puppyInterests || []);
  const [favoriteDogsState, setFavoriteDogs] = useState(favoriteDogs || []);

  const handleNewRequest = (newRequest: any) => {
    setInterestRequests(prev => [...prev, newRequest]);

    setFavoriteDogs(prev => prev.filter(dog => dog._id !== newRequest.dog._id));
  };

  return (
    <>
      <ReservedPuppiesSection
        adoptionRequests={adoptionRequests}
      />

      <AdoptionRequestsSection
        adoptionRequests={adoptionRequests}
        puppyInterests={interestRequests}
        onNewRequest={handleNewRequest}
      />

      {favoriteDogs.length > 0 ? (
        <div className="bg-white rounded shadow p-6">
          <h3 className="text-lg font-bold mb-4">Your Favorite Dogs</h3>
          <FavoriteDogsSection
            puppyApplication={puppyApplication}
            initialDogs={favoriteDogsState}
            favorites={favoriteDogsState}
            puppyInterests={puppyInterests || []}
            onNewRequest={handleNewRequest}
            breederId={breederId}
            userId={userId}
          />
        </div>
      ) : (
        <p className="text-gray-500">You have no favorite dogs yet.</p>
      )}
    </>
  );
}