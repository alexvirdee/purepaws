'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IDog } from "@/interfaces/dog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react";

export default function AddDogDialog({ breederId }: { breederId: string }) {
    const [formData, setFormData] = useState<Omit<IDog, '_id'>>({
        name: '',
        breed: '',
        dob: '',
        status: 'Available',
        photo: '',
        description: '',
        price: 0,
        location: ''
    });

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/dogs/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, breederId })
        });

        if (res.ok) {
            toast.success('Dog added successfully');
            router.refresh();
        } else {
            toast.error('Failed to add dog. Please try again')
        }
    };

    return (

        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-green-500 text-white">
                    <Plus /> Add Dog
                </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                    <DialogTitle>Add Dog</DialogTitle>
                    <DialogDescription>
                        Add new dogs to breeder profile
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium mb-1">Dog Name</Label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Bella"
                        />
                    </div>

                    <div>
                        <Label className="block text-sm font-medium mb-1">Breed</Label>
                        <Input
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                            required
                            placeholder="Golden Retriever"
                        />
                    </div>

                    <div>
                        <Label className="block text-sm font-medium mb-1">Date of Birth</Label>
                        <Input
                            name="dob"
                            type="date"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label className="block text-sm font-medium mb-1">Photo URL</Label>
                        <Input
                            name="photo"
                            value={formData.photo}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>

                    <div>
                        <Label className="block text-sm font-medium mb-1">Description</Label>
                        <Textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe this dog's personality, health, etc."
                        />
                    </div>

                    <div>
                        <Label className="block text-sm font-medium mb-1">Price (USD)</Label>
                        <Input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="3000"
                        />
                    </div>

                    <Button type="submit" className="bg-green-600 text-white">
                        Save Dog
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
