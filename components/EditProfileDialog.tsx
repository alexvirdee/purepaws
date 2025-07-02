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
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditProfileDialog({ user }: { user: { name: string; email: string; about: string; role: string } }) {
    const [name, setName] = useState(user.name);
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/profile/update', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        if (response.ok) {
            toast.success('Profile updated successfully');
            setOpen(false);

            router.refresh();
        } else {
            toast.error('Error updating profile please try again.')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="absolute top-4 right-4 flex items-center text-sm gap-2 text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded shadow cursor-pointer">
                    <Pencil /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium mb-1">Name</Label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            defaultValue={user.name}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium mb-1">Email</Label>
                        <Input
                            type="email"
                            defaultValue={user.email}
                            className="w-full border rounded p-2"
                            disabled
                        />
                    </div>
                    {user.about !== null && (
                        <div>
                            <Label className="block text-sm font-medium mb-1">About</Label>
                            <Textarea
                                defaultValue={user.about}
                                className="w-full border rounded p-2"
                            />
                        </div>
                    )}
                    <div>
                        <Label className="block text-sm font-medium mb-1">Role</Label>
                        <Input
                            type="text"
                            defaultValue={user.role}
                            className="w-full border rounded p-2"
                            disabled
                        />
                    </div>
                    <Button type="submit" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
                        Save Changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}