'use client';

import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorksSection() {
    const steps = [
        {
            title: "Browse Breeders",
            description: "Explore responsible, vetted breeders across the country. Filter by breed, location, and more.",
        },
        {
            title: "Request a Puppy",
            description: "Submit a request directly to the breeder. Ask questions, view parent info, and more.",
        },
        {
            title: "Secure Your Pup",
            description: "Once approved, place a deposit and get ready to welcome your new best friend.",
        },
    ];

    return (
        <div className="mt-4 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4 text-center">How It Works</h2>
            <p className="text-gray-600 mb-8 text-center">
                Whether you're a breeder or a potential puppy parent, getting started is easy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((step, i) => (
                    <Card key={i} className="border border-gray-200 hover:shadow-md hover:border-gray-300 transition duration-200">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 font-normal">
                                {step.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
