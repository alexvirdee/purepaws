'use client';

import { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, Marker, Popup } from 'react-map-gl/mapbox';

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
      style={{ width: '100%', height: '500px' }}
    >

      {/* <Marker longitude={-82.1401} latitude={29.1872} >
        📍
      </Marker> */}

      {breeders.map((breeder) => (
        <Marker
          key={breeder.id}
          longitude={breeder.lng}
          latitude={breeder.lat}
          anchor="bottom"
        >
          <div onClick={() => setPopupInfo(breeder)} style={{ cursor: 'pointer' }}>
            📍
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
          </div>
        </Popup>
      )}
    </Map>
  );
}