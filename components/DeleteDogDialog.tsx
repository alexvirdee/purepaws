'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="text-sm bg-red-500 hover:bg-red-600 cursor-pointer">
                    <CircleX /> Delete Dog
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <Button onClick={handleDelete} className="bg-red-500">Confirm</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
