"use client";


import PuppyInterestDialog from "./PuppyInterestDialog";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignInRequiredDialog from "./SignInRequiredDialog";
import { PawPrintIcon } from "lucide-react";
import AddEditDogDialog from "./AddEditDogDialog";
import DeleteDogDialog from "./DeleteDogDialog";
import { IDog } from "@/interfaces/dog";

export default function DogCardActions({ dog, dogId, isFavorited, loggedInUser, breederId, dogName }: {
    dog: IDog
    dogId: string;
    isFavorited?: boolean;
    loggedInUser?: string;
    breederId: string;
    dogName: string;
}) {
    const { data: session } = useSession();
    const [showSignIn, setShowSignIn] = useState(false);

    // If they are the breeder, actions are edit/delete
    if (loggedInUser === breederId) return (
        <div className="flex gap-2 mt-2">
            <AddEditDogDialog mode="edit" initialData={dog} />
            <DeleteDogDialog dogId={dogId} dogName={dogName} />
        </div>
    )

    return (
        <div className="flex flex-col gap-2">
            {session?.user?.email ? (
                <PuppyInterestDialog name={dogName} />
            ) : (
                <>
                    <Button
                        className="bg-blue-600 text-white"
                        onClick={() => setShowSignIn(true)}
                    >
                        <PawPrintIcon className="mr-1" /> Apply for {dogName}
                    </Button>
                    <SignInRequiredDialog
                        open={showSignIn}
                        onOpenChange={setShowSignIn}
                        description={`You need to sign in to apply for ${dogName}.`}
                    />
                </>
            )}
        </div>
    );
}