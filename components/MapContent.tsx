"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

interface MapContentProps {
  center: [number, number];
  selectedLocation?: { lat: number; lon: number } | null;
  onLocationSelect: (lat: number, lon: number) => void;
  height?: string;
}

function LocationSelector({
  onLocationSelect,
  selectedLocation,
}: {
  onLocationSelect: (lat: number, lon: number) => void;
  selectedLocation?: { lat: number; lon: number } | null;
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    selectedLocation ? [selectedLocation.lat, selectedLocation.lon] : null
  );

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapContent({
  center,
  selectedLocation,
  onLocationSelect,
  height = "400px",
}: MapContentProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconUrl: "/leaflet/marker-icon.png",
      shadowUrl: "/leaflet/marker-shadow.png",
    });
  }, []);

  return (
    <div className="relative w-full rounded overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height, width: "100%", background: "#18181b" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        <LocationSelector
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />
      </MapContainer>
    </div>
  );
}
