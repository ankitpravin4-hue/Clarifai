/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "canvas"],
  },
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "canvas",
        "pdf-parse",
        "jspdf",
        "html2canvas",
      ];
      config.resolve.alias = {
        ...config.resolve.alias,
        jspdf: false,
        html2canvas: false,
      };
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
