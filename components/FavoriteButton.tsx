'use client';

import { useState } from "react";
import { Heart } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import SignInRequiredDialog from "./SignInRequiredDialog";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
    dogId: string;
    initiallyFavorited?: boolean;
    onUnfavorite?: (dogId: string) => void; // allow the parent to update local UI
}

export default function FavoriteButton({ dogId, initiallyFavorited = false, onUnfavorite }: FavoriteButtonProps) {
    const { data: session } = useSession();
    const [isFavorited, setIsFavorited] = useState(initiallyFavorited);
    const [showDialog, setShowDialog] = useState(false);

    const router = useRouter();

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!session) {
            setShowDialog(true);
            return;
        }

        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ dogId })
            });

            if (res.ok) {
                const data = await res.json();
                const nowFavorited = data.favorites.includes(dogId);
                setIsFavorited(nowFavorited);


                router.refresh();

                // Show toast
                if (nowFavorited) {
                    toast.success("Added to favorites!")
                } else {
                    toast("Removed from favorites.", {
                        description: "You can favorite this dog again anytime.",
                    });
                    onUnfavorite?.(dogId); // Notify parent to remove it!
                }

            } else {
                console.error("failed to toggle favorite");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div
                onClick={handleFavoriteClick}
            >
                <Heart
                    className={`w-5 h-5 text-red-500 cursor-pointer ${isFavorited ? 'fill-red-500' : 'fill-none'
                        }`}
                />
            </div>

            <SignInRequiredDialog open={showDialog} onOpenChange={setShowDialog} description="You need to sign in to favorite a dog. Please log in to save your favorites!" />
        </>
    )
}