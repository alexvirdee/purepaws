// Note keep dog card list server rendered

import DogCard from "@/components/DogCard";
import { IDog } from "@/interfaces/dog";

type Favorite = string | { _id: string };

export default function DogCardList({
  puppyApplication,
  hasPuppyApplication,
  puppyInterests,
  dogs,
  favorites, 
  onUnfavorite,
  loggedInUser }:
  {
    puppyApplication?: any;
    hasPuppyApplication?: boolean;
    puppyInterests?: any[]; // If you want to use puppy interests in the future
    dogs: IDog[];
    favorites?: Favorite[];
    onUnfavorite?: (dogId: string) => void;
    loggedInUser?: string
  }) {

  const favoriteIds = favorites?.map((fav) =>
    typeof fav === "string" ? fav : fav._id.toString()
  );

  const puppyInterestDogIds = puppyInterests?.map(pi => pi.dogId.toString());

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dogs.map((dog) => (
        <DogCard
          key={dog._id.toString()}
          dog={dog}
          isFavorited={favoriteIds?.includes(dog._id.toString())}
          onUnfavorite={onUnfavorite}
          loggedInUser={loggedInUser}
          puppyApplication={puppyApplication}
          hasPuppyApplication={hasPuppyApplication} 
          hasPuppyInterest={puppyInterestDogIds?.includes(dog._id.toString())}
        />
      ))}
    </ul>
  )
}