'use client';

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

export default function EditProfileDialog({ user }: { user: { name: string; email: string; about: string; role: string } }) {
    return (
        <Dialog>
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
                <form className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium mb-1">Name</Label>
                        <Input
                            type="text"
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
                    <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Save Changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}