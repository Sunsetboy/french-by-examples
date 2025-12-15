import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // For GitHub Pages deployment with repository name
  basePath: '/french-by-examples',
  assetPrefix: '/french-by-examples',
};

export default nextConfig;
