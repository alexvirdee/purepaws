'use client';

import Link from "next/link";

export default function WhyPurePawsSection() {
    return (
        <div className="mt-8 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Why PurePaws?</h2>
            <p className="text-gray-600 text-base mb-6 max-w-2xl mx-auto">
                At PurePaws, we're committed to creating a safe, transparent, and ethical space for both responsible breeders and loving pet parents. Every breeder is reviewed to ensure they follow best practices so you can focus on finding your perfect pup with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                <Link
                    href="/map-view"
                    className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                >
                    Find Breeders
                </Link>
                <a
                    href="/list-your-kennel"
                    className="text-black border border-gray-300 px-6 py-2 rounded-md text-sm font-medium hover:border-gray-500 transition"
                >
                    Become a Breeder
                </a>
            </div>
        </div>
    );
}
