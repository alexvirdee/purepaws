'use client';

import Image from "next/image";

export default function DogImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded mb-2">
        {/* Your local placeholder */}
        <Image
          src="/images/dog-placeholder.jpg"
          alt="Dog placeholder"
          width={400}
          height={200}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={200}
      className="w-full h-48 object-cover mb-2 rounded"
      loading="lazy"
    />
  );
}