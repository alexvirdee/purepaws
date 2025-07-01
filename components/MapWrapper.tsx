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
    address: string;
    city: string;
    state: string;
    zip: string;
    breeds: string[];
    latitude: number;
    longitude: number;
  }>;
}

export default function MapWrapper({ breeders }: MapWrapperProps) {
  return <MapView breeders={breeders} />;
}