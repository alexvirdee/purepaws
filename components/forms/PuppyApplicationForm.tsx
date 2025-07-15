'use client';

import { useState } from "react";
import { US_STATES } from "@/lib/constants/usStates";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";


const PuppyApplicationForm = ({
    session,
}: {
    session: Session | null
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        city: '',
        state: '',
        zip: '',
        age: '',
        petsOwned: '',
        hasChildren: false,
        puppyPreference: '',
        genderPreference: '',
        trainingPlanned: false,
        desiredTraits: '',
        additionalComments: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (e.target instanceof HTMLInputElement ? e.target.checked : false)
                : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/puppy-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                // Clear the puppy application form 
                setFormData({
                    name: '',
                    email: '',
                    city: '',
                    state: '',
                    zip: '',
                    age: '',
                    petsOwned: '',
                    hasChildren: false,
                    puppyPreference: '',
                    genderPreference: '',
                    trainingPlanned: false,
                    desiredTraits: '',
                    additionalComments: ''
                })

                toast.success('Your puppy application was submitted! 🎉');

                // Check if there is a next page to redirect to
                const next = searchParams.get('next');
                if (next) {
                    // If there is a next page, redirect to it
                    router.push(next);
                } else {
                    // Otherwise, redirect to profile page
                    // Route to profile so user can view and make updates to their puppy application details
                    router.push('/profile');
                }

                router.refresh();
            } else {
                toast.error(data.error || "Something went wrong. Please try again.");

                console.error("Failed to submit puppy application");
            }
        } catch (error) {
            console.error('Error:', error)
        }

        setIsSubmitting(false);
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Puppy Application</h1>
            <p className="mb-6 text-gray-600">
                Fill out your preferences once — send to breeders with one click.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <Label className="block mb-1 font-medium">Name *</Label>
                    <Input
                        name="name"
                        value={session?.user?.name || ""}
                        readOnly
                        className="w-full border p-2 rounded bg-gray-200"
                    />
                </div>

                {/* Email */}
                <div>
                    <Label className="block mb-1 font-medium">Email *</Label>
                    <Input
                        name="email"
                        type="email"
                        value={session?.user?.email || ""}
                        readOnly
                        className="w-full border p-2 rounded bg-gray-200"
                    />
                </div>

                {/* City */}
                <div>
                    <Label className="block mb-1 font-medium">City *</Label>
                    <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* State */}
                <div>
                    <Label className="block mb-1 font-medium">State *</Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}>
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
                        value={formData.zip}
                        onChange={handleChange}
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
                        value={formData.age}
                        onChange={handleChange}
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
                        value={formData.petsOwned}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Children */}
                <div>
                    <Label className="block mb-1 font-medium">Do you have children?</Label>
                    <Checkbox
                        name="hasChildren"
                        checked={formData.hasChildren}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                                ...prev,
                                hasChildren: checked === true
                            }))
                        }
                        className="mr-2"
                    /> Yes
                </div>

                {/* Puppy preference */}
                <div>
                    <Label className="block mb-1 font-medium">Puppy preference *</Label>
                    <div className="flex items-center space-x-4">
                        <RadioGroup
                            name="puppyPreference"
                            value={formData.puppyPreference}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, puppyPreference: value }))
                            }
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
                                checked={formData.genderPreference === "male"}
                                onChange={handleChange}
                            />
                            <span>Male</span>
                        </Label>
                        <Label className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="genderPreference"
                                value="female"
                                checked={formData.genderPreference === "female"}
                                onChange={handleChange}
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
                        checked={formData.trainingPlanned}
                        onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                                ...prev,
                                trainingPlanned: checked === true
                            }))
                        }
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
                        value={formData.desiredTraits}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>

                {/* Additional comments */}
                <div>
                    <Label className="block mb-1 font-medium">Additional comments</Label>
                    <Textarea
                        name="additionalComments"
                        value={formData.additionalComments}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
            </form>
        </div>
    )
}

export default PuppyApplicationForm;