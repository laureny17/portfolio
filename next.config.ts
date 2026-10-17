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
    const security = [
      // Nobody can frame the site (clickjacking, passing it off inside theirs)
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/assets/:path*", headers: noAi },
      { source: "/_next/image", headers: noAi },
    ];
  },
  images: {
    qualities: [40, 90],
  },
};

export default nextConfig;
