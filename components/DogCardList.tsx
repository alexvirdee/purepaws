// Note keep dog card list server rendered

import DogCard from "@/components/DogCard";
import { IDog } from "@/interfaces/dog";

type Favorite = string | { _id: string };

export default function DogCardList({ dogs, favorites, onUnfavorite, loggedInUser }: { dogs: IDog[]; favorites: Favorite[]; onUnfavorite?: (dogId: string) => void; loggedInUser?: string }) {

  const favoriteIds = favorites.map((fav) => 
    typeof fav === "string" ? fav : fav._id.toString()
  );

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dogs.map((dog) => (
        <DogCard key={dog._id.toString()} dog={dog} isFavorited={favoriteIds.includes(dog._id.toString())} onUnfavorite={onUnfavorite} loggedInUser={loggedInUser} />
      ))}
    </ul>
  )
}