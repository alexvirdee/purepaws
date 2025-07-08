'use client';

import { useEffect, useState, useRef } from 'react';
import { US_STATES } from '@/lib/constants/usStates';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import FileDropzone from '@/components/FileDropzone';
import { DOG_BREEDS } from '@/lib/constants/dogBreeds';

interface FormData {
    name: string;
    email: string;
    website: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    breeds: string[];
    about: string;
    supportingDocuments: string[];
}


interface SubmitEvent {
    preventDefault: () => void;
}

interface ApiResponse {
    ok: boolean;
}


function validateForm(formData: FormData): string | null {
    if (!formData.name.trim()) return "Kennel name is required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!formData.address.trim()) return "Address is required.";
    if (!formData.city.trim()) return "City is required.";
    if (!formData.state) return "State is required.";
    if (!formData.zip.trim()) return "Zip code is required.";

    if (formData.breeds.length === 0) return "Please select at least one breed.";
    if (formData.breeds.length > 2) return "You can only select up to 2 breeds.";

    if (!formData.about.trim()) return "About your kennel is required.";
    if (!formData.supportingDocuments || formData.supportingDocuments.length === 0) {
        return "Please upload at least one supporting document.";
    }

    return null; // All good!
}

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
        about: '',
        supportingDocuments: [],
    }

    const hasShown = useRef(false);

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [selectedBreed, setSelectedBreed] = useState<string | undefined>(undefined);

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

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        // Validate form data
        const validationError = validateForm(formData);

        if (validationError) {
            toast.error(validationError);
            return;
        }

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
                    <Label className="block mb-1 font-medium">Kennel Name *</Label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <Label className="block mb-1 font-medium">Email *</Label>
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <Label className="block mb-1 font-medium">Website</Label>
                    <Input
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <Label className="block mb-1 font-medium">Address *</Label>
                    <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
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
                <div>
                    <Label className="block mb-1 font-medium">Zip *</Label>
                    <Input
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    {/* Breeds offered - breeder should be limited to 2  */}
                    <Label className="block mb-1 font-medium">Breeds Offered*</Label>
                    {/* Currently showing top 50 purebred dog breeds  */}
                    <div className="flex flex-wrap gap-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.breeds.map((breedValue) => {
                                const breed = DOG_BREEDS.find(b => b.value === breedValue);
                                return (
                                    <div
                                        key={breedValue}
                                        className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {breed?.label || breedValue}
                                        <button
                                            type="button"
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    breeds: prev.breeds.filter(b => b !== breedValue),
                                                }));
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* <Label className="flex items-center space-x-2"> Select up to 2 dog breeds  </Label> */}
                        <Select
                            value={selectedBreed}
                            onValueChange={(value) => {
                                if (formData.breeds.includes(value)) {
                                    toast.error("You already selected that breed.");
                                    return;
                                }
                                if (formData.breeds.length >= 2) {
                                    toast.error("You can only select up to 2 breeds.");
                                    return;
                                }

                                setFormData((prev) => ({
                                    ...prev,
                                    breeds: [...prev.breeds, value],
                                }));

                                setSelectedBreed(undefined); // Clear the dropdown!
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select up to 2 breeds" />
                            </SelectTrigger>
                            <SelectContent>
                                {DOG_BREEDS.map((breed, index) => (
                                    <SelectItem key={index} value={breed.value}>
                                        {breed.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* {DOG_BREEDS.map((breed, index) => ( */}
                        {/* <Checkbox
                                    checked={formData.breeds.includes(breed)}
                                    onCheckedChange={() => handleBreedChange(breed)}
                                />
                                <span>{breed}</span> */}

                    </div>
                </div>
                <div>
                    <Label className="block mb-1 font-medium">About Your Kennel *</Label>
                    <Textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        required
                        className="w-full border p-2 rounded"
                        rows={4}
                    />
                </div>
                <div>
                    <Label className="block mb-1 font-medium">Supporting Documents*</Label>
                    <FileDropzone
                        formData={formData}
                        setFormData={setFormData} field="supportingDocuments"
                        label="Upload supporting documents in pdf format (e.g. kennel license, health certifications, etc.)"
                        accept={{ 'application/pdf': [] }}
                        maxFiles={10}
                        multiple
                    />
                </div>
                <Button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 transition-colors disabled:cursor-not-allowed"
                >
                    Submit Application
                </Button>
            </form>
        </div>
    )
}

export default ListYourKennelForm;