"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { cn } from "@/lib/utils";

// Custom pin via divIcon — avoids Leaflet's broken default marker image paths under bundlers.
const pinIcon = L.divIcon({
  className: "fmc-pin",
  html: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s7-7.16 7-13a7 7 0 1 0-14 0c0 5.84 7 13 7 13Z" fill="#2563eb" stroke="#ffffff" stroke-width="1.5"/>
    <circle cx="12" cy="9" r="2.6" fill="#ffffff"/>
  </svg>`,
  iconSize: [30, 30],
  iconAnchor: [15, 28],
});

function ClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Leaflet renders tiles for the container size at init; if the container grows
// afterwards (e.g. inside a form card), the map must be told to recompute.
function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export default function MapPicker({
  value,
  onChange,
  className,
}: {
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
  className?: string;
}) {
  // Default view: Dhaka. Only used as the initial center.
  const center = useMemo<[number, number]>(
    () => (value ? [value.lat, value.lng] : [23.8103, 90.4125]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div
      className={cn(
        "h-72 w-full overflow-hidden rounded-xl ring-1 ring-foreground/10",
        className,
      )}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InvalidateSizeOnMount />
        <ClickHandler onPick={onChange} />
        {value ? <Marker position={[value.lat, value.lng]} icon={pinIcon} /> : null}
      </MapContainer>
    </div>
  );
}
