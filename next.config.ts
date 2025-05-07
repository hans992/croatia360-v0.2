// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Uklonite unoptimized: true ako ste ga imali
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', 
        port: '',
        // Možete dodati i pathname ako želite biti specifičniji
        // pathname: '/ime-vaseg-bucketa/**', 
      },
      // Dodajte druge domene ako je potrebno
    ],
  },
};
export default nextConfig;