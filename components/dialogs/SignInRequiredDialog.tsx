'use client';

import { ReactNode } from "react";
import { signIn } from "next-auth/react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type SignInRequiredDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    cancelLabel?: string;
    signInLabel?: string;
};

export default function SignInRequiredDialog({
    open,
    onOpenChange,
    title = "Sign In Required",
    description = "You need to sign in to complete this action. Please log in to continue.",
    cancelLabel = "Cancel",
    signInLabel = "Sign In",
}: SignInRequiredDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">
                            {cancelLabel}
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={() => {
                            signIn();
                            onOpenChange(false);
                        }}
                    >
                        {signInLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}