'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import FilterBar from '@/components/FilterBar';
import { IBreeder } from '@/interfaces/breeder';

export default function Hero({
    breeders
}: {
     breeders: IBreeder[];
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBreed, setSelectedBreed] = useState('All');

    const normalizedSelectedBreed = selectedBreed.toLowerCase().trim();
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    const filteredBreeders = useMemo(() => {
        return breeders.filter((breeder) => {
            const breederBreeds = breeder.breeds.map((b: string) => b.toLowerCase().trim());

            const normalizedBreedOptions = [
                normalizedSelectedBreed.replace(/-/g, ' '),
                normalizedSelectedBreed.replace(/\s+/g, '-'),
            ];

            const matchesBreed =
                normalizedSelectedBreed === 'all' ||
                breederBreeds.some((b: string) =>
                    normalizedBreedOptions.includes(b)
                );

            const matchesSearch =
                normalizedSearchTerm === '' ||
                breeder.name.toLowerCase().includes(normalizedSearchTerm) ||
                breeder.address.toLowerCase().includes(normalizedSearchTerm) ||
                breeder.city.toLowerCase().includes(normalizedSearchTerm) ||
                breeder.state.toLowerCase().includes(normalizedSearchTerm) ||
                breeder.zip.toLowerCase().includes(normalizedSearchTerm) ||
                breederBreeds.some((b: string) => b.includes(normalizedSearchTerm));

            return matchesBreed && matchesSearch;
        });
    }, [breeders, normalizedSelectedBreed, normalizedSearchTerm]);

    const clearFilters = () => {
        setSelectedBreed('All');
        setSearchTerm('');
    };

    return (
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background hero image */}
            <Image
                src="/images/purepaws-hero1.jpeg"
                alt="PurePaws Hero"
                fill
                priority
                className="object-cover object-center z-0"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>

            {/* FilterBar */}
            <div className="absolute top-8 left-8 z-20 bg-white backdrop-blur-sm rounded-lg shadow-md p-4 w-full max-w-xs">
                <FilterBar
                    selectedBreed={selectedBreed}
                    setSelectedBreed={setSelectedBreed}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    clearFilters={clearFilters}
                />
            </div>

            {/* Hero content */}
            <div className="relative z-20 max-w-3xl text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Find your best friend with PurePaws
                </h1>
                <p className="text-lg text-gray-100 mb-8 font-merriweather">
                    Responsible breeders. Loving homes. Happy pups.
                </p>

            </div>
        </section>
    );
}