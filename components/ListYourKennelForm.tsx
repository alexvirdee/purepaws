'use client';

import { useEffect, useState, useRef } from 'react';
import { US_STATES } from '@/lib/constants/usStates';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

interface FormData {
    name: string;
    email: string;
    website: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    breeds: string[];
    certifications: string;
    about: string;
}


interface SubmitEvent {
    preventDefault: () => void;
}

interface ApiResponse {
    ok: boolean;
}

const BREEDS = [
    'Golden Retriever',
    'Labrador Retriever',
    'German Shepherd',
    'Bulldog',
    'Poodle',
    'Beagle',
    'Rottweiler',
    'Dachshund',
    'Boxer',
    'English Springer Spaniel',
];

const ListYourKennelForm = ({
    hasBreederApplication
}: {
    hasBreederApplication: boolean;
}) => {
    const initialFormData = {
        name: '',
        email: '',
        website: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        breeds: [],
        certifications: '',
        about: '',
    }

    const hasShown = useRef(false);

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [breedError, setBreedError] = useState<string | null>(null);

    useEffect(() => {
        if (hasBreederApplication && !hasShown.current) {
            toast("You’ve already submitted a breeder application. Please wait for our team to review it. Check your status in your profile.")
            hasShown.current = true;
        }
    }, [hasBreederApplication])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBreedChange = (breed: string) => {
        setFormData((prev: FormData) => {
            const exists = prev.breeds.includes(breed);

            // If the breed is already selected, allow unselecting it
            if (exists) {
                const updatedBreeds = prev.breeds.filter((b) => b !== breed);
                setBreedError(null);
                return {
                    ...prev,
                    breeds: updatedBreeds
                };
            }

            // Limit to 2 breeds
            if (prev.breeds.length >= 2) {
                setBreedError('You can only select up to 2 breeds.');
                return prev;
            }

            // Otherwise, update the breeds and clear the error
            setBreedError(null);
            return {
                ...prev,
                breeds: [...prev.breeds, breed]
            };
        });
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        // POST to your API route here
        const response: ApiResponse = await fetch('/api/breeders/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log('Application submitted successfully!');

            // Reset form data
            setFormData(initialFormData);
            router.push("/success");
        } else {
            console.error('Error submitting application');
        }

        console.log(formData);
    };

    const router = useRouter();

    if (hasBreederApplication) {
        return (
            <div className="p-8">
                <h2 className="text-xl font-semibold mb-2">Application Already Submitted</h2>
                <p className="text-gray-600">Please wait for our team to review it. You can check your status in your <Link className="text-blue-500 hover:text-blue-600" href="/profile">profile.</Link></p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Breeder Application</h1>
            <p className="mb-6 text-gray-600">
                Submit your details to apply for a listing in our trusted breeder directory.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Kennel Name *</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
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
                <div>
                    <label className="block mb-1 font-medium">Website</label>
                    <input
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Address *</label>
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
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
                <div>
                    <label className="block mb-1 font-medium">Zip *</label>
                    <input
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    {/* Breeds checkboxes - breeder should be limited to 2  */}
                    <label className="block mb-1 font-medium">Breeds Offered *</label>
                    {breedError && (
                        <p className="text-red-600 text-sm mb-2">{breedError}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {BREEDS.map((breed) => (
                            <label key={breed} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.breeds.includes(breed)}
                                    onChange={() => handleBreedChange(breed)}
                                />
                                <span>{breed}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Certifications</label>
                    <input
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">About Your Kennel *</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Submit Application
                </button>
            </form>
        </div>
    )
}

export default ListYourKennelForm;