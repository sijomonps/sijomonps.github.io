import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(isProd
    ? {
        trailingSlash: true,
      }
    : {}),
  // No basePath or assetPrefix needed for user/organization GitHub Pages
};

export default nextConfig;
