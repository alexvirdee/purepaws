import DogCard from "@/components/DogCard";
import { IDog } from "@/interfaces/dog";

type Favorite = string | { _id: string };

export default function DogCardList({
  puppyApplication,
  puppyInterests,
  dogs,
  favorites,
  onUnfavorite,
  loggedInUser,
  onNewRequest,
  gridClassName = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4", // Default grid class
}:
  {
    puppyApplication?: any;
    puppyInterests?: any[]; // If you want to use puppy interests in the future
    dogs: IDog[];
    favorites?: Favorite[];
    onUnfavorite?: (dogId: string) => void;
    loggedInUser?: string;
    onNewRequest?: (newRequest: any) => void;
    gridClassName?: string; // Optional className for the grid
  }) {

  const favoriteIds = favorites?.map((fav) =>
    typeof fav === "string" ? fav : fav._id.toString()
  );


  return (
    <ul className={gridClassName}>
      {dogs.map((dog, index) => {
        const matchedInterest = puppyInterests?.find(
          (pi) => pi.dogId.toString() === dog._id.toString()
        );

        return (
            <DogCard
              key={index}
              dog={dog}
              isFavorited={favoriteIds?.includes(dog._id.toString())}
              onUnfavorite={onUnfavorite}
              loggedInUser={loggedInUser}
              puppyApplication={puppyApplication}
              interestStatus={matchedInterest?.status}
              onNewRequest={onNewRequest} // Pass the callback for new request
            />
        );
      })}
    </ul>
  );
}