'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map, Marker, Popup } from 'react-map-gl/mapbox';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from "@/lib/constants";
import FilterBar from './FilterBar';
import { useDebounce } from '@/hooks/useDebounce';
import { Command } from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function MapView({ breeders }: { breeders: any[] }) {
  const searchParams = useSearchParams();
  const mapRef = useRef<any>(null);

  const zipParam = searchParams.get('zip') || '';
  const breedParam = searchParams.get('breed') || 'All';

  const [popupInfo, setPopupInfo] = useState<any | null>(null);

  // TODO: Update search param - just testing with zip for now 
  const [searchTerm, setSearchTerm] = useState(zipParam);
  const [selectedBreed, setSelectedBreed] = useState(breedParam);

  const [viewState, setViewState] = useState({
    longitude: -95.7129, // USA center
    latitude: 37.0902,
    zoom: 3.5,
  });

  const normalizedSelectedBreed = selectedBreed.toLowerCase().trim();
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  const filteredBreeders = useMemo(() => {
    const results = breeders.filter((breeder) => {
      const breederBreeds = breeder.breeds.map((b: string) => b.toLowerCase().trim());

      // Handle possible legacy vs. slug formats:
      const normalizedBreedOptions = [
        normalizedSelectedBreed.replace(/-/g, ' '), ,               // e.g., 'english springer spaniel'
        normalizedSelectedBreed.replace(/\s+/g, '-'), // e.g., 'english-springer-spaniel'
      ];

      const matchesBreed =
        normalizedSelectedBreed === 'all' ||
        breederBreeds.some((b: string) =>
          normalizedBreedOptions.includes(b)
        );

      const matchesSearch =
        normalizedSearchTerm === '' ||
        breeder.name.toLowerCase().includes(normalizedSearchTerm) ||
        breeder.address.toLowerCase().includes(normalizedSearchTerm) ||
        breeder.city.toLowerCase().includes(normalizedSearchTerm) ||
        breeder.state.toLowerCase().includes(normalizedSearchTerm) ||
        breeder.zip.toLowerCase().includes(normalizedSearchTerm) ||
        breederBreeds.some((b: string | string[]) => b.includes(normalizedSearchTerm));

      console.log('Selected breed:', normalizedSelectedBreed);
      console.log('Possible matches:', normalizedBreedOptions);
      console.log('Breeder breeds:', breederBreeds);

      return matchesBreed && matchesSearch;
    });

    return results;
  }, [breeders, normalizedSearchTerm, normalizedSelectedBreed])

  const hasFilter = selectedBreed !== 'All' || searchTerm.trim() !== '';
  const debouncedFilteredBreeders = useDebounce(filteredBreeders, 400);

  const showNoResults = hasFilter && filteredBreeders.length === 0;

  useEffect(() => {
    if (!mapRef.current) return;

    if (!hasFilter || debouncedFilteredBreeders.length === breeders.length) {
      mapRef.current.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        duration: 1000,
      });
      return;
    }

    if (debouncedFilteredBreeders.length === 0) return;

    if (debouncedFilteredBreeders.length === 1) {
      const b = debouncedFilteredBreeders[0];
      mapRef.current.flyTo({
        center: [b.longitude, b.latitude],
        zoom: 10,
        duration: 1000,
      });
      return;
    }

    // Multiple results - fit bounds to all markers
    const lats = debouncedFilteredBreeders.map(breeder => breeder.latitude);
    const lngs = debouncedFilteredBreeders.map(breeder => breeder.longitude);

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
      essential: true
    });
  }, [debouncedFilteredBreeders, hasFilter, breeders.length]);

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

  function getOffsetCoords(lat: number, lng: number, index: number) {
    const offset = 0.001; // adjust as needed
    return {
      lat: lat + offset * index,
      lng: lng + offset * index,
    };
  }

  return (
    <div
      className="relative w-full h-[600px]"
      onClick={(e) => {
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
        // scrollZoom={isMapInteractive}
        interactive={true}
        onMove={(evt) => setViewState(evt.viewState)}
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: '100%', height: '100%' }}
      >
        {debouncedFilteredBreeders.map((breeder, index) => {
          const { lat, lng } = getOffsetCoords(breeder.latitude, breeder.longitude, index);
          console.log(`Breeder ${breeder.name} Offset Lat/Lng:`, lat, lng);
          return (
            <Marker
              key={breeder.id}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
            >
              <div onClick={() => setPopupInfo(breeder)} style={{ cursor: 'pointer' }}>
                <Image src="/images/paw-outline.svg" alt={`${APP_NAME} logo`} width={25} height={25} priority={true} />
              </div>
            </Marker>
          );
        })}
        {/* {filteredBreeders.map((breeder) => (
            // Use getOffsetCoords to avoid marker overlap
            
            <Marker
              key={breeder.id}
              longitude={breeder.longitude}
              latitude={breeder.latitude}
              anchor="bottom"
            >
              <div onClick={() => setPopupInfo(breeder)} style={{ cursor: 'pointer' }}>
                <Image src="/images/paw-outline.svg" alt={`${APP_NAME} logo`} width={25} height={25} priority={true} />
              </div>
            </Marker>
          ))} */}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
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