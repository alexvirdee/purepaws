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

type DeletePuppyApplicationDialogProps = {
  applicationId: string;      // ID to delete
  onDeleteSuccess?: () => void; // optional callback to refresh UI
};

export default function DeletePuppyApplicationDialog({
    applicationId,
    onDeleteSuccess
}: DeletePuppyApplicationDialogProps) {
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/puppy-application/${applicationId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success(`Deleted application successfully!`);
                setOpen(false);
                onDeleteSuccess?.();

                router.refresh();
            } else {
                toast.error('Failed to delete application. Please try again.')
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }

    };

    return (

        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button size="sm" className="text-sm bg-red-500 hover:bg-red-600 cursor-pointer">
                    <CircleX /> Delete
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
