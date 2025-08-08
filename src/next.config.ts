
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Use this if you are deploying to a non-Vercel environment or have issues with Vercel's optimizer
    // remotePatterns are not needed for local images in /public
  },
};

export default nextConfig;
