'use client';

import { useEffect, useState, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, Marker, Popup } from 'react-map-gl/mapbox';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from "@/lib/constants";
import FilterBar from './FilterBar';
import { useDebounce } from '@/hooks/useDebounce';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapView({ breeders }: { breeders: any[] }) {
  const [popupInfo, setPopupInfo] = useState<any | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -95.7129, // USA center
    latitude: 37.0902,
    zoom: 3.5,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('All');

  const mapRef = useRef<any>(null);

  // Filter breeders by selected breed
  // TODO: Implement true search functionality once necessary
  const filteredBreeders = breeders.filter((breeder) => {
    const matchesBreed =
      selectedBreed === 'All' || breeder.breeds.includes(selectedBreed);

    const matchesSearch =
      searchTerm.trim() === '' ||
      breeder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breeder.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesBreed && matchesSearch;
  });

  const hasFilter = selectedBreed !== 'All' || searchTerm.trim() !== '';
  const showNoResults = hasFilter && filteredBreeders.length === 0;
  const debouncedFilteredBreeders = useDebounce(filteredBreeders, 400);

  useEffect(() => {
    if (!mapRef.current) return;

    if (debouncedFilteredBreeders.length === breeders.length) {
      // If no filters applied, reset to initial view state
      mapRef.current.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        duration: 1000,
      });
      return;
    }

    if (debouncedFilteredBreeders.length === 0) return;

    const lats = filteredBreeders.map(breeder => breeder.lat);
    const lngs = filteredBreeders.map(breeder => breeder.lng);

    const minLng = Math.min(...lngs) - 0.1;
    const minLat = Math.min(...lats) - 0.1;
    const maxLng = Math.max(...lngs) + 0.1;
    const maxLat = Math.max(...lats) + 0.1;

    const bounds = [
      [minLng, minLat],
      [maxLng, maxLat],
    ];

    mapRef.current.fitBounds(bounds, {
      padding: 100,
      duration: 1000,
    });
  }, [debouncedFilteredBreeders, hasFilter]);

  // Clear filters function
  function clearFilters() {
    setSelectedBreed('All');
    setSearchTerm('');
    setPopupInfo(null); // ✅ closes the popup when clearing filters
  }

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setPopupInfo(null); // ✅ closes the popup when searching
  }

  function handleBreedChange(value: string) {
    setSelectedBreed(value);
    setPopupInfo(null); // ✅ closes popup when filtering
  }

  return (
    <div
      className="relative w-full h-[600px]"
      onClick={(e) => {
        console.log('clicked on map view', e.target);
        console.log('showNoResults:', showNoResults);

        if (showNoResults) {
          // Prevent clicks inside of the overlay closing it
          const overlay = document.getElementById('no-results-overlay');
          if (overlay && overlay.contains(e.target as Node)) return;

          // Clear your filters to reset map
          setSearchTerm('');
          setSelectedBreed('All');
          setPopupInfo(null);
        }
      }}
    >
      <FilterBar
        selectedBreed={selectedBreed}
        setSelectedBreed={handleBreedChange}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        clearFilters={clearFilters}
      />
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: '100%', height: 800 }}
      >
        {filteredBreeders.map((breeder) => (
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
            <div className="p-4 bg-white rounded-lg shadow-lg max-w-xs">
              <h3 className="text-lg font-bold mb-2">{popupInfo.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{popupInfo.location}</p>
              <p className="text-sm text-gray-600 mb-3">Breeds: {popupInfo.breeds.join(', ')}</p>
              {/* Dynamic link */}
              <Link href={`/breeders/${popupInfo.id}`}>
                <span className="text-blue-500 hover:text-blue-700 underline text-sm font-medium">View Details</span>
              </Link>
            </div>
          </Popup>
        )}
      </Map>
      {showNoResults && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full max-w-md p-6 bg-white border border-gray-300 rounded shadow-lg text-center"
          id="no-results-overlay"
        >
          <button
            onClick={() => {
              // Optionally clear filters when manually closing
              setSearchTerm('');
              setSelectedBreed('All');
              setPopupInfo(null);
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"  
          >&times;</button>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No breeders found</h2>
            <p className="text-gray-600">Try adjusting your search or filters.</p>
          </div>
        </div>
      )}
    </div>
  );
}