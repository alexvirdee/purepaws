'use client';

import { useState } from "react";
import {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditRequestMessageDialog({
    request,
    onSave }: {
        request: any,
        onSave: (msg: string) => void
    }) {
    const [message, setMessage] = useState(request.message);
    const [open, setOpen] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        await onSave(message);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Message</Button>
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSave} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Edit message to breeder</DialogTitle>
                            <DialogDescription>
                                You can edit your message to the breeder here. Please include any specific details or questions you have.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    name="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}