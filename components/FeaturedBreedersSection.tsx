'use client';

export default function FeaturedBreedersSection() {
    return (
        <div className="mt-4">
            <h2 className="text-2xl font-bold mb-4">Featured Breeders</h2>
            <p className="text-gray-600 mb-4">
                Meet our trusted breeders. New litters, verified reviews, and more!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* TODO: Map through your featured breeders here! */}
                <div className="p-4 border rounded shadow">Breeder 1 Placeholder</div>
                <div className="p-4 border rounded shadow">Breeder 2 Placeholder</div>
                <div className="p-4 border rounded shadow">Breeder 3 Placeholder</div>
            </div>
        </div>
    )
}