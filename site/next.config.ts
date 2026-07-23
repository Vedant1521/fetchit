import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.141.220.47", "192.168.1.11", "localhost", "127.0.0.1"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
