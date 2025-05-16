
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
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**', // Reverted to general pathname
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      // Add your Firebase Studio development URL origin here if needed
      'https://9003-firebase-studio-1747391818732.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
      // e.g. 'https://*.cloudworkstations.dev'
    ],
  },
};

export default nextConfig;
