import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Content JSON is read from disk at runtime; ship it with every server function.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  // Private app: no indexing, no link previews, no archiving, on every response.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
