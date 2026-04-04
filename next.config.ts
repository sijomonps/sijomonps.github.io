import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/Portfolio.me",
  assetPrefix: "/Portfolio.me/",
  trailingSlash: true,
};

export default nextConfig;
