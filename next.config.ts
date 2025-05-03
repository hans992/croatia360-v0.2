import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← This disables ESLint errors during deployment
  },
  // Your existing config options can stay below
  // reactStrictMode: true, etc...
};

export default nextConfig;