'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DogIcon, CircleXIcon } from 'lucide-react';
import FavoriteButton from '@/components/FavoriteButton';
import { isValidImage } from '@/utils/isValidImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


export default function DogImageGallery({
  images,
  dogName,
  dogId,
  userBreederId,
  dogBreederId,
  isFavorited
}: {
  images: any[],
  dogName: string,
  dogId: string,
  userBreederId?: string,
  dogBreederId?: string,
  isFavorited: boolean
}) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <>
      <div className="flex-1 relative">
        {images && images.length > 0 && isValidImage(images[0]) ? (
          <>
            {userBreederId !== dogBreederId && (
              <div className="absolute top-2 left-2 z-10  rounded-full p-2">
                <FavoriteButton dogId={dogId} initiallyFavorited={isFavorited} />
              </div>
            )}
            <Image
              src={typeof images[0] === 'string' ? images[0] : images[0]?.path}
              alt={dogName}
              className="rounded mb-4 w-full object-cover h-[400px]"
              width={800}
              height={600}
            />
          </>
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded mb-4">
            <DogIcon className="w-16 h-16 text-gray-500" />
          </div>
        )}

        {/* Thumbnails row */}
        <div className="flex gap-2 overflow-x-auto mt-4">
          {images?.slice(1, 4).map((photo, idx) => {
            const isLast = idx === 2 && (images?.length ?? 0) > 4;

            return (
              <div key={idx} className="relative">
                <Image
                  src={typeof photo === 'string' ? photo : photo?.path}
                  alt={`${dogName} photo ${idx + 2}`}
                  className="rounded w-24 h-24 object-cover flex-shrink-0"
                  width={100}
                  height={100}
                />

                {isLast && (
                  <Button
                    onClick={() => setIsGalleryOpen(true)}
                    className="absolute inset-0 bg-black/50 hover:bg-black/60 flex items-center justify-center rounded h-full cursor-pointer"
                  >
                    <span className="text-white font-semibold">+{images.length - 4} More</span>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {isGalleryOpen && (
        <div onClick={() => setIsGalleryOpen(false)} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl bg-white rounded-lg p-4">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, idx) => (
                  <CarouselItem key={idx} className="flex justify-center items-center max-h-[50vh]">
                          <Image
                            src={typeof image === 'string' ? image : image?.path}
                            alt={`${dogName} photo ${idx + 1}`}
                            className="rounded w-auto h-auto max-h-[650px] object-contain"
                            width={800}
                            height={600}
                          />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <Button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-2 right-2 text-white bg-transparent cursor-pointer hover:bg-white"
            >
              <CircleXIcon className="w-12 h-12 text-black" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}