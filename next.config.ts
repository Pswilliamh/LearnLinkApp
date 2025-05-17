
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // placehold.co removed as unoptimized={true} is used for these images
      // Add other domains here if you need Next.js to optimize their images
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9003-firebase-studio-1747391818732.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
