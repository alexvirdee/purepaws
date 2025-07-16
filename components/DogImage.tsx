'use client';

import Image from "next/image";

interface DogImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

export default function DogImage({
  src,
  alt,
  width = 400,
  height = 200,
  aspectRatio = "aspect-[4/3]",
  additionalContainerStyles = ""
}: {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  additionalContainerStyles?: string;
}) {
  return (
      <Image
        src={src ? src : "/images/purepaws-placeholder.jpg"}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover block ${aspectRatio} ${additionalContainerStyles}`}
        loading="lazy"
      />
  );
}