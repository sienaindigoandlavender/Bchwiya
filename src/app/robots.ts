import type { MetadataRoute } from "next";

// Private app: keep every crawler out.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
