'use client';


import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { IBreeder } from "@/interfaces/breeder";
import Link from "next/link";


export default function FeaturedBreedersSection({
    breeders
}: {
    breeders: IBreeder[];
}) {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Featured Breeders</h2>
            <p className="text-gray-600 mb-4">
                Meet our trusted breeders. New litters, verified reviews, and more!
            </p>
            <div className="w-full max-w-5xl mx-auto px-12">
                <Carousel className="w-full">
                    <CarouselContent>
                        {breeders.slice(0, 5).map((breeder, index) => (
                            <Link href={`/breeders/${breeder._id}`} key={index} className="no-underline">
                                <CarouselItem key={index} className="basis-2/3 md:basis-1/3 lg:basis-1/4">
                                    <div className="p-2">
                                        <Card className="hover:shadow-lg transition-shadow duration-200">
                                            <CardContent className="flex flex-col items-start justify-start p-4">
                                                <h3 className="text-lg font-semibold">{breeder.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {breeder.city}, {breeder.state}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Breeds: {breeder.breeds.join(", ")}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            </Link>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )
}