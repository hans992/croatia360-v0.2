"use client";

import React from "react";

// Croatia hero video (GCS)
const DEFAULT_VIDEO_URL =
  "https://storage.googleapis.com/croatiasara/videos/hero.mp4";

interface VideoBackgroundProps {
  videoUrl?: string;
  overlayOpacity?: number;
  className?: string;
}

export default function VideoBackground({
  videoUrl = DEFAULT_VIDEO_URL,
  overlayOpacity = 0.5,
  className = "",
}: VideoBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        aria-hidden
      />
    </div>
  );
}
