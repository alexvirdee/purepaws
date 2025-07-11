'use client';


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
    onDeleteSuccess?: () => void;
    open?: boolean; // controlled open state
    onOpenChange?: (open: boolean) => void;
};

export default function DeleteDogDialog({
    dogId,
    dogName,
    onDeleteSuccess,
    open,
    onOpenChange,
}: DeleteDogDialogProps) {
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`/api/dogs/${dogId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success(`Deleted ${dogName} successfully!`);
                onOpenChange?.(false);
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
        <AlertDialog open={open} onOpenChange={onOpenChange}>
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
