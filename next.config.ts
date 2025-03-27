import type { NextConfig } from "next";
// eslint-disable-next-line
const nrExternals = require("newrelic/load-externals");

const nextConfig: NextConfig = {
  serverExternalPackages: ["newrelic"],
  webpack: (config) => {
    nrExternals(config);
    return config;
  },
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "32lsnbffc1.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
};

export default nextConfig;
