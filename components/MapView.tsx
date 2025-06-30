'use client';

import { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, Marker, Popup } from 'react-map-gl/mapbox';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from "@/lib/constants";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapView({ breeders }: { breeders: any[] }) {
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -95.7129, // USA center
    latitude: 37.0902,
    zoom: 3.5,
  });

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={viewState}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      style={{ width: '100%', height: 800 }}
    >
      {breeders.map((breeder) => (
        <Marker
          key={breeder.id}
          longitude={breeder.lng}
          latitude={breeder.lat}
          anchor="bottom"
        >
          <div onClick={() => setPopupInfo(breeder)} style={{ cursor: 'pointer' }}>
            <Image src="/images/paw-outline.svg" alt={`${APP_NAME} logo`} width={25} height={25} priority={true} />
          </div>
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          longitude={popupInfo.lng}
          latitude={popupInfo.lat}
          anchor="top"
          onClose={() => setPopupInfo(null)}
          closeOnClick={false}
        >
          <div>
            <h3>{popupInfo.name}</h3>
            <p>{popupInfo.location}</p>
            <p>Breeds: {popupInfo.breeds.join(', ')}</p>
            {/* Dynamic link */}
            <Link href={`/breeders/${popupInfo.id}`}>
              <span style={{ color: 'blue', textDecoration: 'underline' }}>View Details</span>
            </Link>
          </div>
        </Popup>
      )}
    </Map>
  );
}