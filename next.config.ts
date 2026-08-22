import type { NextConfig } from "next";

if (process.env.NODE_ENV === "development") {
  const { setupDevPlatform } = require("@cloudflare/next-on-pages/next-dev");
  setupDevPlatform();
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    qualities: [25, 50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  // Allow connections from the mobile hotspot IP
  // @ts-ignore
  allowedDevOrigins: ['192.168.43.27', '192.168.137.1', '192.168.1.48', '10.131.161.207', '10.50.87.207', 'kwhoz-103-89-233-254.run.pinggy-free.link'],
};

export default nextConfig;
