import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Content JSON is read from disk at runtime; ship it with every server function.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  // Old addresses still open in someone's browser go somewhere sensible.
  async redirects() {
    return [
      { source: "/configuration", destination: "/un-instant", permanent: false },
      { source: "/connexion", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
