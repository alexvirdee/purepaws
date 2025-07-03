'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CircleX } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type DeleteDogDialogProps = {
  dogId: string;      // ID to delete
  dogName: string;    // optional, for the title
  onDeleteSuccess?: () => void; // optional callback to refresh UI
};

export default function DeleteDogDialog({
    dogId,
    dogName,
    onDeleteSuccess
}: DeleteDogDialogProps) {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/dogs/${dogId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success(`Deleted ${dogName} successfully!`);
                setOpen(false);
                onDeleteSuccess?.();

                router.refresh();
            } else {
                toast.error('Failed to delete dog. Please try again.')
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }

    };

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-sm bg-red-500 hover:bg-red-600 cursor-pointer">
                    <CircleX /> Delete Dog
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDelete} className="bg-red-500">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
