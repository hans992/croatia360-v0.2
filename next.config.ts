import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ← This disables ESLint errors during deployment
  },

};

export default nextConfig;