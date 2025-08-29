import { MetadataRoute } from "next";
import { getAllPostsMeta } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://teknovashop.com";
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
  ];

  const posts = getAllPostsMeta();
  posts.forEach(p => {
    pages.push({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.date) });
  });

  return pages;
}