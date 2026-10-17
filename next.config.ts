import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [{ source: "/about", destination: "/", permanent: true }];
  },
  async headers() {
    const noAi = [{ key: "X-Robots-Tag", value: "noai, noimageai" }];
    return [
      { source: "/assets/:path*", headers: noAi },
      { source: "/_next/image", headers: noAi },
    ];
  },
  images: {
    qualities: [40, 90],
  },
};

export default nextConfig;
