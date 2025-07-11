"use client";

import PuppyInterestDialog from "./PuppyInterestDialog";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignInRequiredDialog from "./SignInRequiredDialog";
import { PawPrintIcon } from "lucide-react";
import { IDog } from "@/interfaces/dog";
import { useRouter } from "next/navigation";

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

    const router = useRouter();

    // If they are the breeder, no need to show interest/action button
    if (loggedInUser &&
        breederId &&
        loggedInUser === breederId
    ) return (
        null
    )

    const dogStatus = dog?.status || "available";

    return (
        <div className="flex flex-col gap-2">
            {session?.user?.email ? (
                <>
                    {dogStatus === "reserved" && (
                        <Button size="sm" disabled className="bg-gray-300 text-gray-700 cursor-not-allowed">
                            Reserved
                        </Button>
                    )}

                    {dogStatus === "pending-reservation" && interestStatus === "deposit-requested" && (
                        <Button size="sm" onClick={() => router.push('/profile')} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 cursor-pointer">
                            View Deposit Details
                        </Button>
                    )}

                    {dogStatus === "pending-reservation" && interestStatus !== "deposit-requested" && (
                        <PuppyInterestDialog
                            dogId={dogId}
                            dog={dog}
                            breederId={breederId}
                            puppyApplication={puppyApplication}
                            name={dogName}
                            interestStatus={interestStatus}
                            onNewRequest={onNewRequest}
                            isBackup={true}
                        />
                    )}

                    {dogStatus === "available" && interestStatus === "applied" && (
                        <Button size="sm" disabled className="bg-gray-300 text-gray-700 cursor-not-allowed">
                            Applied
                        </Button>
                    )}

                    {dogStatus === "available" && !interestStatus && (
                        <PuppyInterestDialog
                            dogId={dogId}
                            dog={dog}
                            breederId={breederId}
                            puppyApplication={puppyApplication}
                            name={dogName}
                            interestStatus={interestStatus}
                            onNewRequest={onNewRequest}
                        />
                    )}
                </>
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
            )
            }
        </div>
    )
}