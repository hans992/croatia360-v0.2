"use client";

import React from "react";

// Free stock video - Mediterranean/coastal aerial (Mixkit)
// Replace with your own Croatia drone footage from GCS when available
const DEFAULT_VIDEO_URL =
  "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-tropical-beach-4935-large.mp4";

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
