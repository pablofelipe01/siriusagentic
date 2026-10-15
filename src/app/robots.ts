import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Herramientas internas: no deben aparecer en Google
      disallow: ["/api/", "/chat", "/media", "/encuestas", "/eventos"],
    },
    sitemap: "https://www.siriusagentic.com/sitemap.xml",
    host: "https://www.siriusagentic.com",
  };
}
