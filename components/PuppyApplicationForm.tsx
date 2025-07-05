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
import { useRouter } from "next/navigation";

const PuppyApplicationForm = () => {
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

                // Route to profile so user can view and make updates to their puppy application details
                router.push('/profile');
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
                    <label className="block mb-1 font-medium">Name *</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1 font-medium">Email *</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* City */}
                <div>
                    <label className="block mb-1 font-medium">City *</label>
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* State */}
                <div>
                    <label className="block mb-1 font-medium">State *</label>
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
                    <label className="block mb-1 font-medium">Zip *</label>
                    <input
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
                    <label className="block mb-1 font-medium">How old are you? *</label>
                    <input
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
                    <label className="block mb-1 font-medium">How many pets do you currently own? *</label>
                    <input
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
                    <label className="block mb-1 font-medium">Do you have children?</label>
                    <input
                        name="hasChildren"
                        type="checkbox"
                        checked={formData.hasChildren}
                        onChange={handleChange}
                        className="mr-2"
                    /> Yes
                </div>

                {/* Puppy preference */}
                <div>
                    <label className="block mb-1 font-medium">Puppy preference *</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="puppyPreference"
                                value="8-week"
                                checked={formData.puppyPreference === "8-week"}
                                onChange={handleChange}
                            />
                            <span>8 week puppy</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="puppyPreference"
                                value="16-week"
                                checked={formData.puppyPreference === "16-week"}
                                onChange={handleChange}
                            />
                            <span>16 week trained puppy</span>
                        </label>
                    </div>
                </div>

                {/* Gender preference */}
                <div>
                    <label className="block mb-1 font-medium">Gender preference *</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="genderPreference"
                                value="male"
                                checked={formData.genderPreference === "male"}
                                onChange={handleChange}
                            />
                            <span>Male</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="genderPreference"
                                value="female"
                                checked={formData.genderPreference === "female"}
                                onChange={handleChange}
                            />
                            <span>Female</span>
                        </label>
                    </div>
                </div>

                {/* Training planned */}
                <div>
                    <label className="block mb-1 font-medium">
                        Will puppy be put into training or obedience classes?
                    </label>
                    <input
                        name="trainingPlanned"
                        type="checkbox"
                        checked={formData.trainingPlanned}
                        onChange={handleChange}
                        className="mr-2"
                    /> Yes
                </div>

                {/* Desired traits */}
                <div>
                    <label className="block mb-1 font-medium">
                        Traits you are looking for in a puppy
                    </label>
                    <textarea
                        name="desiredTraits"
                        value={formData.desiredTraits}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>

                {/* Additional comments */}
                <div>
                    <label className="block mb-1 font-medium">Additional comments</label>
                    <textarea
                        name="additionalComments"
                        value={formData.additionalComments}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </form>
        </div>
    )
}

export default PuppyApplicationForm;