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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { US_STATES } from "@/lib/constants/usStates";

export default function EditPuppyApplicationDialog({ user }: { user: { name: string; email: string; about: string; role: string } }) {
    const [name, setName] = useState(user.name);
    const [about, setAbout] = useState(user.about);
    const [open, setOpen] = useState(false);

    const router = useRouter();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // const response = await fetch('/api/profile/update', {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ name, about })
        // });

        // if (response.ok) {
        //     toast.success('Profile updated successfully');
        //     setOpen(false);

        //     router.refresh();
        // } else {
        //     toast.error('Error updating profile please try again.')
        // }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="absolute top-4 right-4 flex items-center text-sm gap-2 text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded shadow cursor-pointer">
                    <Pencil /> Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Puppy Application</DialogTitle>
                    <DialogDescription>
                        Update your puppy application information below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Name */}
                    <div>
                        <Label className="block mb-1 font-medium">Name *</Label>
                        <Input
                            name="name"
                            // value={formData.name}
                            // onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label className="block mb-1 font-medium">Email *</Label>
                        <Input
                            name="email"
                            type="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <Label className="block mb-1 font-medium">City *</Label>
                        <Input
                            name="city"
                            // value={formData.city}
                            // onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* State */}
                    <div>
                        <Label className="block mb-1 font-medium">State *</Label>
                        {/* TODO: Add onOnValueChange to the Select element below */}
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a state" />
                            </SelectTrigger>
                            <SelectContent>
                                {US_STATES.map((state) => (
                                    <SelectItem key={state.value} value={state.value}>
                                        {state.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Zip */}
                    <div>
                        <Label className="block mb-1 font-medium">Zip *</Label>
                        <Input
                            name="zip"
                            type="number"
                            // value={formData.zip}
                            // onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* Age */}
                    <div>
                        <Label className="block mb-1 font-medium">How old are you? *</Label>
                        <Input
                            name="age"
                            type="number"
                            // value={formData.age}
                            // onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* Pets owned */}
                    <div>
                        <Label className="block mb-1 font-medium">How many pets do you currently own? *</Label>
                        <Input
                            name="petsOwned"
                            type="number"
                            // value={formData.petsOwned}
                            // onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* Children */}
                    <div>
                        <Label className="block mb-1 font-medium">Do you have children?</Label>
                        <Checkbox
                            name="hasChildren"
                            // checked={formData.hasChildren}
                            // onChange={handleChange}
                            className="mr-2"
                        /> Yes
                    </div>

                    {/* Puppy preference */}
                    <div>
                        <Label className="block mb-1 font-medium mb-2">Puppy preference *</Label>
                        <div className="flex items-center space-x-4">
                            <RadioGroup
                                name="puppyPreference"
                                // value={formData.puppyPreference}
                                // onValueChange={(value) =>
                                //     setFormData((prev) => ({ ...prev, puppyPreference: value }))
                                // }
                                className="flex flex-row gap-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="8-week" id="8-week" />
                                    <Label htmlFor="8-week">8 week puppy</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="16-week" id="16-week" />
                                    <Label htmlFor="16-week">16 week trained puppy</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Gender preference */}
                    <div>
                        <Label className="block mb-1 font-medium">Gender preference *</Label>
                        <div className="flex items-center space-x-4">
                            <Label className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="genderPreference"
                                    value="male"
                                // checked={formData.genderPreference === "male"}
                                // onChange={handleChange}
                                />
                                <span>Male</span>
                            </Label>
                            <Label className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="genderPreference"
                                    value="female"
                                // checked={formData.genderPreference === "female"}
                                // onChange={handleChange}
                                />
                                <span>Female</span>
                            </Label>
                        </div>
                    </div>

                    {/* Training planned */}
                    <div>
                        <Label className="block mb-1 font-medium">
                            Will puppy be put into training or obedience classes?
                        </Label>
                        <Checkbox
                            name="trainingPlanned"
                            // checked={formData.trainingPlanned}
                            // onChange={handleChange}
                            className="mr-2"
                        /> Yes
                    </div>

                    {/* Desired traits */}
                    <div>
                        <Label className="block mb-1 font-medium">
                            Traits you are looking for in a puppy
                        </Label>
                        <Textarea
                            name="desiredTraits"
                            // value={formData.desiredTraits}
                            // onChange={handleChange}
                            className="w-full border p-2 rounded"
                            rows={4}
                        />
                    </div>

                    {/* Additional comments */}
                    <div>
                        <Label className="block mb-1 font-medium">Additional comments</Label>
                        <Textarea
                            name="additionalComments"
                            // value={formData.additionalComments}
                            // onChange={handleChange}
                            className="w-full border p-2 rounded"
                            rows={4}
                        />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Save Changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}