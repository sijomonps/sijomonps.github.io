import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // No basePath or assetPrefix needed for user/organization GitHub Pages
};

export default nextConfig;
