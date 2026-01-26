/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude undici from client-side bundling (it's a Node.js fetch implementation)
  // This fixes the "private class fields" parsing error
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle these server-only packages on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Exclude undici from being processed by webpack
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'undici': 'commonjs undici',
      });
    }

    return config;
  },

  experimental: {
    // Mark firebase-admin as external for server components
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

module.exports = nextConfig;
