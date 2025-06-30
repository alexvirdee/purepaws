'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./MapView'), { 
  ssr: false, // Disable SSR for MapView
  loading: () => <p>Loading map...</p>, // Optional: Add a loading fallback
});

interface MapWrapperProps {
  breeders: Array<{
    id: string;
    name: string;
    location: string;
    breeds: string[];
    lat: number;
    lng: number;
  }>; // Replace 'any' with a more specific type
}

export default function MapWrapper({ breeders }: MapWrapperProps) {
  return <MapView breeders={breeders} />;
}