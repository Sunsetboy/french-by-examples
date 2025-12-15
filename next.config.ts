import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  // For GitHub Pages deployment with repository name
  // basePath: '/french-by-examples', // Uncomment if deploying to username.github.io/repo-name
  // assetPrefix: '/french-by-examples', // Uncomment if deploying to username.github.io/repo-name
};

export default nextConfig;
