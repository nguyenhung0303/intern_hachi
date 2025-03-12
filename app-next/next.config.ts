import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "45.77.47.87",
        port: "",
      },
    ],
  },
};

export default nextConfig;
