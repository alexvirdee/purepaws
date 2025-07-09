// Keep this file server rendered

import { Suspense } from "react";
import Link from "next/link";
import { IDog } from "@/interfaces/dog";
import FavoriteButton from "./FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatPrice";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import DogImage from "./DogImage";
import { Skeleton } from "@/components/ui/skeleton";
import DogCardActions from "./DogCardActions";

interface DogCardProps {
    dog: IDog;
    isFavorited?: boolean;
    onUnfavorite?: (dogId: string) => void;
    loggedInUser?: string;
    hasPuppyApplication?: boolean; // If the user has an application on their profile
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

type StatusStyle = {
    label: string;
    variant: BadgeVariant;
    className?: string;
};

const STATUS_STYLES: Record<string, StatusStyle> = {
    Available: {
        label: "Available",
        variant: "secondary",
        className: "bg-green-300 border border-green-300"
    },
    Pending: {
        label: "Pending",
        variant: "outline",
    },
    Sold: {
        label: "Sold",
        variant: "destructive",
    },
};

export default function DogCard({ hasPuppyApplication, dog, isFavorited, onUnfavorite, loggedInUser }: DogCardProps) {
    // const [showSignInDialog, setShowSignInDialog] = useState(false);

    // const { data: session } = useSession();

    const statusKey = dog.status?.charAt(0).toUpperCase() + dog.status?.slice(1).toLowerCase();

    if (dog && dog.photos) {
        console.log("DogCard - dog photos:", dog.photos[0].path);
    }

    return (
        <Card key={dog._id.toString()} className="transition relative hover:shadow-lg mb-4">
            <CardContent>
                {/* Favorite a dog */}
                {/* Only show favorite button for either
                1. Guests on application
                2. Users logged in who are not the breeders who currently own the dogs
            */}
                {loggedInUser !== dog.breederId && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
                        <FavoriteButton dogId={dog._id.toString()} initiallyFavorited={isFavorited} onUnfavorite={onUnfavorite} />
                    </div>
                )}

                <Link href={`/dogs/${dog._id}`} >
                    {/* Suspense for image */}
                    <Suspense fallback={<Skeleton className="w-full h-48 rounded" />}>
                        <DogImage src={dog.photos?.[0]?.path} alt={dog.name} />
                    </Suspense>

                    {/* Dog details */}
                    <h2 className="text-xl font-semibold">{dog.name}</h2>
                    <p className="text-gray-600">{dog.litter}</p>
                    <p className="text-gray-600">{dog.breed}</p>
                    <p className="text-gray-500">dob: {dog.dob}</p>
                    <p className="text-gray-500">{dog.gender}</p>

                    <Badge className={`${STATUS_STYLES[statusKey]?.className} mb-2`} variant={STATUS_STYLES[statusKey]?.variant}>
                        {dog.status}
                    </Badge>
                    <p className="text-green-700 font-semibold mb-4">{formatPrice(dog.price)}</p>
                </Link>

                <DogCardActions
                    dog={dog}
                    dogId={dog._id}
                    isFavorited={isFavorited}
                    loggedInUser={loggedInUser}
                    breederId={dog.breederId ?? ""}
                    dogName={dog.name}
                    hasPuppyApplication={hasPuppyApplication}
                />
            </CardContent>

        </Card>
    )

}