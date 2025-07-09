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

export default function PuppyInterestDialog({ name }: { name: string }) {   
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.stopPropagation();
        e.preventDefault();

        //  TODO: Call interest api to submit interest with an optional message to the breeder
        console.log("Submitting interest for:", name, "with message:", message);

        // Simulate API call
        setTimeout(() => {
            console.log("Interest submitted successfully!");
            setOpen(false);
            setMessage(""); // Reset message after submission
        }, 500);
    }

    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white hover:text-white cursor-pointer">
                    <PawPrintIcon /> Apply for {name}
                </Button>
            </DialogTrigger>
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
                        Submit Interest
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
        </>
    );
}