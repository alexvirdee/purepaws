'use client';

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { PawPrintIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PuppyInterestDialog({
    hasPuppyInterest,
    dogId,
    breederId,
    puppyApplication,
    hasPuppyApplication,
    name }:
    {
        hasPuppyInterest?: boolean;
        dogId: string;
        breederId: string;
        puppyApplication?: any;
        hasPuppyApplication: boolean,
        name: string
    }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.stopPropagation();
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/puppy-interests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dogId,
                    breederId,
                    puppyApplicationId: puppyApplication?._id,
                    message: message.trim()
                }),
            });

            const data = await res.json();

            console.log("[PuppyInterestDialog] Response:", data);

            if (res.ok) {
                toast.success(`Your interest in ${name} has been submitted! 🎉`);

                if (data.removedFromFavorites) {
                    toast.info(`${name} has been removed from your favorites to your adoption requests.`);
                }

                // Re-fetch server component data
                router.refresh();

                setOpen(false);
                setMessage("");
            } else {
                toast.error(data.error || "Something went wrong. Please try again.");
            }

        } catch (error) {
            console.error("Error submitting interest:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }

        setIsSubmitting(false);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        disabled={hasPuppyInterest}
                        className={`w-full flex items-center justify-center gap-2 whitespace-nowrap text-sm px-3 py-2 ${hasPuppyInterest ? `bg-gray-500 hover:bg-gray-600` : `bg-blue-600 hover:bg-blue-700 text-white hover:text-white cursor-pointer`}`}
                    >
                        <PawPrintIcon />
                        <span className="truncate max-w-[180px] block">
                            {hasPuppyInterest ? `Applied` : `Apply for ${name}`}
                        </span>
                    </Button>
                </DialogTrigger>
                {!hasPuppyApplication ? (
                    <DialogContent className="max-w-md mx-auto">
                        <DialogHeader>
                            <DialogTitle>Application Required</DialogTitle>
                        </DialogHeader>
                        <div className="text-sm text-gray-500 mb-2">
                            Looks like you don't have a puppy application on file. Your general puppy application is used to help breeders understand your home and lifestyle. Please fill out the application first before applying for a specific puppy.
                        </div>
                        <Button>
                            <Link href={`/puppy-application?next=${encodeURIComponent(`/breeders/${breederId}#dog-${dogId}`)}`}>
                                Complete Your Puppy Application
                            </Link>
                        </Button>
                    </DialogContent>
                ) : (
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Apply for {name}</DialogTitle>
                            <DialogDescription>
                                <span className="text-sm text-gray-600">Your general puppy application will be sent along with this message to the breeder.</span>
                                <br />
                                <span className="text-sm text-gray-600">
                                    Let the breeder know why you’re interested in {name} or any details you’d like to share.
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={`I am interested in adopting ${name} because...`}
                                rows={4}
                                className="w-full"
                            />
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                {isSubmitting ? 'Sending...' : `Send Application`}
                            </Button>
                        </form>
                    </DialogContent>
                )}

            </Dialog>
        </>
    );
}