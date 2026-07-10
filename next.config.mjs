/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "jspdf", "html2canvas"],
  },
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "jspdf",
        "html2canvas",
      ];
    }
    if (dev) {
      // Avoid stale/corrupt webpack cache causing 404s and infinite compiles.
      config.cache = false;
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
