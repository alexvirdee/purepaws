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
    userId,
    dogName,
    onNewRequest
}: {
    interestStatus?: string;
    puppyApplication?: any;
    dog: IDog;
    dogId: string;
    loggedInUser?: string;
    breederId: string;
    userId: string;
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

    console.log("Dog Status:", dogStatus);

    console.log("🐶 session:", session);
    console.log("🐶 interestStatus:", interestStatus);
    console.log("🐶 dogStatus:", dogStatus);
    console.log("🐶 breederId:", breederId);
    console.log("🐶 loggedInUser:", loggedInUser);

    return (
        <div className="flex flex-col gap-2">
            {session?.user?.email ? (
                <>
                    {/* Dog is reserved don't display action button */}
                    {dogStatus === "reserved" && (
                        <></>
                    )}

                    {/* This user has been requested to submit a deposit from the breeder - lead them to their profile */}
                    {dogStatus === "pending-reservation" && interestStatus === "deposit-requested" && (
                        <Button size="sm" onClick={() => router.push('/profile')} className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 cursor-pointer">
                            View Deposit Details
                        </Button>
                    )}
                    
                    {/* If the dog is pending reservation, allow the user to still show interest */}
                    {dogStatus === "pending-reservation" && interestStatus !== "deposit-requested" && (
                        <PuppyInterestDialog
                            dogId={dogId}
                            dog={dog}
                            breederId={breederId}
                            userId={userId}
                            puppyApplication={puppyApplication}
                            name={dogName}
                            interestStatus={interestStatus}
                            onNewRequest={onNewRequest}
                            isBackup={true}
                        />
                    )}

                    {/* Similar to above if dog is pending deposit as breeder has sent out a request we will still allow the user to show interest in the dog and apply */}
                    {dogStatus === "deposit-requested" && !interestStatus && (
                        <PuppyInterestDialog
                            dogId={dogId}
                            dog={dog}
                            breederId={breederId}
                            userId={userId}
                            puppyApplication={puppyApplication}
                            name={dogName}
                            interestStatus={interestStatus}
                            onNewRequest={onNewRequest}
                            isBackup={true}
                        />
                    )}

                    {/* If the dog is available, allow the user to show interest 
                        This check is if the user had previously submitted interest and then cancelled and wants to submit interest again 
                    */}
                    {dogStatus === "available" && (interestStatus === "pending" || interestStatus === "cancelled") && (
                        <PuppyInterestDialog
                            dogId={dogId}
                            dog={dog}
                            breederId={breederId}
                            userId={userId}
                            puppyApplication={puppyApplication}
                            name={dogName}
                            interestStatus={interestStatus}
                            onNewRequest={onNewRequest}
                            isBackup={true}
                        />
                    )}

                    {/* Disable the button for the user if they have applied to the dog */}
                    {dogStatus === "available" && interestStatus === "applied" && (
                        <Button size="sm" disabled className="bg-gray-300 text-gray-700 cursor-not-allowed">
                            Applied
                        </Button>
                    )}

                    {/* Dog is available and logged in user has not previously applied render the interest button */}
                    {dogStatus === "available" && !interestStatus && (
                        <PuppyInterestDialog
                            dogId={dogId}
                            dog={dog}
                            breederId={breederId}
                            userId={userId}
                            puppyApplication={puppyApplication}
                            name={dogName}
                            interestStatus={interestStatus}
                            onNewRequest={onNewRequest}
                        />
                    )}
                </>
            ) : (
                // Logged out users it's ok to render button since it'll prompt them to sign in which could lead to more users signing up 
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