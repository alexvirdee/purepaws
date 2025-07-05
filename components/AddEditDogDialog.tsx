'use client';

import { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil } from "lucide-react";

type AddEditDogDialogProps = {
    mode: "add" | "edit";
    breederId?: string; // required to add a dog
    initialData?: IDog;
    triggerButton?: React.ReactNode;
    onSubmitSuccess?: () => void;
}

export default function AddEditDogDialog({
    mode,
    breederId,
    initialData,
    onSubmitSuccess
}: AddEditDogDialogProps) {
    const [formData, setFormData] = useState<Omit<IDog, '_id'>>({
        name: '',
        litter: '',
        breed: '',
        dob: '',
        gender: '',
        status: '',
        photo: '',
        description: '',
        price: 0,
        location: ''
    });
    const [open, setOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                name: initialData.name || '',
                litter: initialData.litter || '',
                breed: initialData.breed || '',
                dob: initialData.dob || '',
                gender: initialData.gender || '',
                status: initialData.status || '',
                photo: initialData.photo || '',
                description: initialData.description || '',
                price: initialData.price || 0,
                location: initialData.location || ''
            });
        }
    }, [initialData, mode, open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const addEndpoint = `/api/dogs/add`;
        const editEndpoint = `/api/dogs/${initialData?._id}`;

        const endpoint = mode === 'edit'
            ? editEndpoint
            : addEndpoint

        console.log('formData', formData)

        const res = await fetch(endpoint, {
            method: mode === 'edit' ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                breederId: mode === 'add' ? breederId : undefined
            })
        });

        if (res.ok) {
            toast.success(`Dog ${mode === 'edit' ? 'edited' : 'added'} successfully`);
            setOpen(false);

            router.refresh();
            onSubmitSuccess?.();
        } else {
            toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} dog. Please try again`);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                    {mode === 'edit' ? <Pencil /> : <Plus />}
                    {mode === 'edit' ? 'Edit Dog' : 'Add Dog'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === 'edit' ? 'Edit Dog' : 'Add Dog'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'edit'
                            ? 'Update this dog’s details.'
                            : 'Add a new dog to the breeder profile.'}
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
                        <Label className="block text-sm font-medium mb-1">Litter</Label>
                        <Input
                            name="litter"
                            value={formData.litter}
                            onChange={handleChange}
                            required
                            placeholder="Spring 2026 Litter"
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
                        <Label className="block text-sm font-medium mb-1">Gender</Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Select a gender</SelectLabel>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="block text-sm font-medium mb-1">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Select dogs status</SelectLabel>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                    {/* TODO: Add a draft status state to not show the public */}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
                        />
                    </div>

                    <Button type="submit" className="bg-green-600 text-white">
                        {mode === 'edit' ? 'Update Dog' : 'Save Dog'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
