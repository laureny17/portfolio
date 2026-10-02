import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [{ source: "/about", destination: "/", permanent: true }];
  },
  images: {
    qualities: [40, 90],
  },
};

export default nextConfig;
