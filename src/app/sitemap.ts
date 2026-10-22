import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/custom", "/about", "/faq"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const productPages = products.map((p) => ({
    url: `${siteUrl}/shop/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: p.images.map((src) => `${siteUrl}${src}`),
  }));
  return [...pages, ...productPages];
}
