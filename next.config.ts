// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true, // or false depending on your needs
  webpack(config, { isServer }) {
    if (!isServer) {
      config.devServer = {
        ...config.devServer,
        client: {
          overlay: false, // Disable error overlay in the browser
        },
      };
    }
    return config;
  },
};

export default nextConfig;
