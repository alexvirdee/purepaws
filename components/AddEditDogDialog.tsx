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
import FileDropzone from "./FileDropzone";

type AddEditDogDialogProps = {
    mode: "add" | "edit";
    breederId?: string; // required to add a dog
    initialData?: IDog;
    triggerButton?: React.ReactNode;
    onSubmitSuccess?: () => void;
    open?: boolean; // controlled open state
    onOpenChange?: (open: boolean) => void; // controlled open change handler
}

export default function AddEditDogDialog({
    mode,
    breederId,
    initialData,
    onSubmitSuccess,
    open: controlledOpen,
  onOpenChange,
}: AddEditDogDialogProps) {
    const initialFormData = {
        name: '',
        litter: '',
        breed: '',
        dob: '',
        gender: '',
        status: '',
        photos: [],
        description: '',
        price: 0,
        location: ''
    };

    const [formData, setFormData] = useState<Omit<IDog, '_id'>>(initialFormData);
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen ?? internalOpen;

    const router = useRouter();

    const resetForm = () => {
        setFormData(initialFormData);
    }

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                name: initialData.name || '',
                litter: initialData.litter || '',
                breed: initialData.breed || '',
                dob: initialData.dob || '',
                gender: initialData.gender || '',
                status: initialData.status || '',
                photos: initialData.photos || [],
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

        try {
            console.log(JSON.stringify({
                ...formData,
                breederId: mode === 'add' ? breederId : undefined
            }, null, 2));

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

                if (mode === 'add') {
                    resetForm();
                }

                setInternalOpen(false);

                router.refresh();
                onSubmitSuccess?.();
            } else {
                toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} dog. Please try again`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(
                `Something went wrong: ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange ?? setInternalOpen}>
            <DialogTrigger asChild>
                {mode === 'edit' && initialData ? (
                    <span>Edit</span>
                ) : (
                    <Button className="bg-green-500 hover:bg-green-600 text-white cursor-pointer">
                        <Plus /> Add Dog
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
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

                    {/* React DropZone for multiple image upload  */}
                    <div>
                        <Label className="block text-sm font-medium mb-1">Photos</Label>
                        <FileDropzone
                            formData={formData}
                            setFormData={setFormData}
                            field="photos"
                            label="Add dog photos"
                            accept={{ 'image/*': [] }}
                            multiple
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
