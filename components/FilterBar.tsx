'use client';

import { useRouter } from "next/navigation";

import { DOG_BREEDS } from "@/lib/constants/dogBreeds";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Search, CircleXIcon } from "lucide-react";

export default function FilterBar({
    selectedBreed,
    setSelectedBreed,
    searchTerm,
    setSearchTerm,
    clearFilters,
    layout = 'stacked'
}: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedBreed: string;
    setSelectedBreed: (value: string) => void;
    clearFilters: () => void;
    layout?: 'stacked' | 'inline';
}) {
    const router = useRouter();

    const hasFilter = selectedBreed !== 'All' || searchTerm.trim() !== '';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const query = new URLSearchParams();

        if (searchTerm.trim()) {
            query.append('zip', searchTerm.trim());
        }
        if (selectedBreed && selectedBreed !== 'All') {
            query.append('breed', selectedBreed);
        }


        router.push(`/map-view?${query.toString()}`);
    }

    return (
        <form onSubmit={handleSearch}>
            <div className={`w-full 
                ${layout === 'inline'
                 ? 'flex flex-row gap-2 px-4 pt-2' 
                 : 'flex flex-col gap-2'}`}>
                <div className="relative flex-grow mb-2">
                    <Input
                        type="text"
                        placeholder="Enter a breed or location"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <Button
                        type="submit"
                        className="absolute bg-transparent absolute right-0.5 top-1/2 pb-4 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:bg-transparent"
                    >
                        <Search className="text-black" size={16} />
                    </Button>
                </div>
                <div className="w-auto">
                <Select
                    value={selectedBreed}
                    onValueChange={(value) => setSelectedBreed(value)}
                    defaultValue="All"
                    aria-label="Select Dog Breed"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Dog Breeds</SelectLabel>
                            <SelectItem value="All">All Breeds</SelectItem>
                            {DOG_BREEDS.map((breed, index) => (
                                <SelectItem key={index} value={breed.value}>
                                    {breed.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                </div>
                {hasFilter && (
                    <Button
                        type="button"
                        onClick={clearFilters}
                        className="bg-gray-400 text-black text-sm hover:underline cursor-pointer"
                    >
                        <CircleXIcon /> Clear Filters
                    </Button>
                )}
            </div>
        </form>
    )
}