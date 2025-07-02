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

export default function FavoriteButton() {
    const { data: session } = useSession();
    const [isFavorited, setIsFavorited] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!session) {
            setShowDialog(true);
            return;
        }

        setIsFavorited((prev) => !prev);

        // TODO: Persist to DB
    };

    return (
        <>
            <div
                onClick={handleFavoriteClick}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition"
            >
                <Heart
                    className={`w-5 h-5 text-red-500 cursor-pointer ${isFavorited ? 'fill-red-500' : 'fill-none'
                        }`}
                />
            </div>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sign In Required</AlertDialogTitle>
                        <AlertDialogDescription>
                            You need to sign in to favorite a dog. Please log in to save your favorites!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                signIn();
                                setShowDialog(false);
                            }}
                        >
                            Sign In
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}