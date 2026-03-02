"use client";

import React, { useRef, useEffect } from "react";
import type { Coordinates } from "@/lib/regions/coordinates";
import { getCroatiaDefault } from "@/lib/regions/coordinates";
// Mapbox GL must be loaded client-side only
const MAPBOX_DARK_STYLE = "mapbox://styles/mapbox/dark-v11";

interface RegionMapProps {
  center?: Coordinates;
  zoom?: number;
  regionSlug?: string;
  className?: string;
}

export default function RegionMap({
  center,
  zoom,
  regionSlug: _regionSlug,
  className = "",
}: RegionMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const initializedRef = useRef(false);

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const defaultView = getCroatiaDefault();

  useEffect(() => {
    if (!mapContainerRef.current || !token || initializedRef.current) return;

    const mapboxgl = require("mapbox-gl");
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_DARK_STYLE,
      center: defaultView.center,
      zoom: defaultView.zoom,
    });

    mapRef.current = map;
    initializedRef.current = true;

    return () => {
      map.remove();
      mapRef.current = null;
      initializedRef.current = false;
    };
  }, [token]);

  useEffect(() => {
    if (!mapRef.current || !center) return;
    mapRef.current.flyTo({
      center,
      zoom: zoom ?? defaultView.zoom,
      duration: 2000,
    });
  }, [center, zoom]);

  if (!token) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-900 text-slate-400 ${className}`}
      >
        <p className="text-sm">Map unavailable. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full min-h-[300px] rounded-xl overflow-hidden ${className}`}
    />
  );
}
