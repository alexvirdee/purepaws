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

export default function DogCardActions({
    interestStatus,
    puppyApplication,
    dog,
    dogId,
    loggedInUser,
    breederId,
    dogName,
    onNewRequest
}: {
        interestStatus?: string;
        puppyApplication?: any;
        dog: IDog;
        dogId: string;
        loggedInUser?: string;
        breederId: string;
        dogName: string;
        onNewRequest: (newRequest: any) => void
    }) {
    const { data: session } = useSession();
    const [showSignIn, setShowSignIn] = useState(false);

    // If they are the breeder, actions are edit/delete
    if (loggedInUser &&
        breederId &&
        loggedInUser === breederId
    ) return (
        <div className="flex gap-2 mt-2">
            <AddEditDogDialog mode="edit" initialData={dog} />
            <DeleteDogDialog dogId={dogId} dogName={dogName} />
        </div>
    )

    return (
        <div className="flex flex-col gap-2">
            {session?.user?.email ? (
                <PuppyInterestDialog
                    dogId={dogId}
                    dog={dog}
                    breederId={breederId}
                    puppyApplication={puppyApplication}
                    name={dogName}
                    interestStatus={interestStatus}
                    onNewRequest={onNewRequest} // Pass the callback for new request
                />
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