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
import { DogIcon } from "lucide-react";

interface DogCardProps {
    isRequest?: boolean; // If this is a request card, we can use this prop to conditionally render
    dog: IDog;
    isFavorited?: boolean;
    onUnfavorite?: (dogId: string) => void;
    loggedInUser?: string;
    puppyApplication?: any;
    hasPuppyApplication?: boolean; // If the user has an application on their profile
    hasPuppyInterest?: boolean; // If the user has shown interest in this dog
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

export default function DogCard({// If this is a request card, we can use this prop to conditionally render
    puppyApplication,
    hasPuppyApplication,
    hasPuppyInterest,
    dog,
    isFavorited,
    onUnfavorite,
    loggedInUser }: DogCardProps) {
    const statusKey = dog.status?.charAt(0).toUpperCase() + dog.status?.slice(1).toLowerCase();

    return (
        <Card
            key={dog._id.toString()}
            className="w-full max-w-xs relative overflow-hidden rounded-lg shadow hover:shadow-lg transition pt-0"
        >
            {/* Favorite button pinned to card corner */}
            {loggedInUser !== dog.breederId && !hasPuppyInterest && (
                <div className="absolute top-0.5 right-0.5 z-20 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
                    <FavoriteButton
                        dogId={dog._id.toString()}
                        initiallyFavorited={isFavorited}
                        onUnfavorite={onUnfavorite}
                    />
                </div>
            )}

            {/* Flush top image */}
            <Link href={`/dogs/${dog._id}`}>
                <Suspense fallback={<Skeleton className="w-full aspect-[4/3]" />}>
                    {dog.photos && dog.photos.length > 0 ? (
                        <DogImage
                            src={dog.photos?.[0]?.path}
                            alt={dog.name}
                            // aspectRatio="4/3"
                            additionalContainerStyles="rounded-t-lg"
                        />
                    ) : (
                        <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-200">
                            <DogIcon className="w-16 h-16 text-gray-500" />
                        </div>
                    )}
                </Suspense>
            </Link>

            <CardContent>
                <Link href={`/dogs/${dog._id}`}>
                    <h2 className="text-xl font-semibold">{dog.name}</h2>
                    <p className="text-gray-600">{dog.litter}</p>
                    <p className="text-gray-600">{dog.breed}</p>
                    <p className="text-gray-500">dob: {dog.dob}</p>
                    <p className="text-gray-500">{dog.gender}</p>

                    <Badge
                        className={`${STATUS_STYLES[statusKey]?.className} mb-2`}
                        variant={STATUS_STYLES[statusKey]?.variant}
                    >
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
                    puppyApplication={puppyApplication}
                    hasPuppyApplication={hasPuppyApplication}
                    hasPuppyInterest={hasPuppyInterest}
                />
            </CardContent>
        </Card>
    )
}