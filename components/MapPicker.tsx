'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

interface MapPickerProps {
  onLocationSelect: (lat: number, lon: number) => void;
  center?: [number, number];
  selectedLocation?: { lat: number; lon: number } | null;
  height?: string;
}

export default function MapPicker({ 
  onLocationSelect, 
  center = [40.7128, -74.0060],
  selectedLocation,
  height = '400px'
}: MapPickerProps) {
  const [mounted, setMounted] = useState(false);

  const Map = useMemo(() => dynamic(
    () => import('./MapContent'),
    { 
      loading: () => (
        <div className="w-full bg-zinc-800 rounded flex items-center justify-center" style={{ height }}>
          <div className="text-sm text-zinc-500">Loading map...</div>
        </div>
      ),
      ssr: false 
    }
  ), [height]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full bg-zinc-800 rounded flex items-center justify-center" style={{ height }}>
        <div className="text-sm text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <Map
      center={center}
      selectedLocation={selectedLocation}
      onLocationSelect={onLocationSelect}
      height={height}
    />
  );
}