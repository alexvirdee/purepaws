'use client';

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

export default function FilterBar({
    selectedBreed,
    setSelectedBreed,
    searchTerm,
    setSearchTerm,
    clearFilters,
    resultsCount
}: {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedBreed: string;
    setSelectedBreed: (value: string) => void;
    clearFilters: () => void;
    resultsCount?: number;
}) {

    const hasFilter = selectedBreed !== 'All' || searchTerm.trim() !== '';

    return (
        <div className="absolute top-4 left-4 z-20 bg-white shadow-md rounded-lg p-4 flex flex-col gap-2 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-2">Find Your Breeder</h2>
            <Input
                type="text"
                placeholder="Search for your next puppy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded mb-2"
            />
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

             {resultsCount !== undefined && (
        <span className="text-xs text-gray-600">
          {resultsCount} breeder{resultsCount === 1 ? '' : 's'} found
        </span>
      )}

            {hasFilter && (
                <Button
                    onClick={clearFilters}
                    className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
                >
                    Clear Filters
                </Button>
            )}
        </div>
    )
}