// SPDX-License-Identifier: Apache-2.0
// Build-time utility to extract lastmod dates from blog frontmatter for sitemap
// This runs at config load time, before Astro's content layer is available

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { BLOG_PATH } from "../paths";

interface LastmodMap {
  [url: string]: Date;
}

/**
 * Parse frontmatter from a markdown file using gray-matter
 * Returns modDatetime if present, otherwise pubDatetime
 */
function parseFrontmatterDate(content: string): Date | null {
  try {
    const { data } = matter(content);

    // Check for modDatetime first (preferred for lastmod)
    if (data.modDatetime) {
      const date = new Date(data.modDatetime);
      if (!Number.isNaN(date.getTime())) return date;
    }

    // Fall back to pubDatetime
    if (data.pubDatetime) {
      const date = new Date(data.pubDatetime);
      if (!Number.isNaN(date.getTime())) return date;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Extract slug from filename (matches Astro's content collection behavior)
 * e.g., "ai-agents-legacy-roi.md" -> "ai-agents-legacy-roi"
 */
function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

/**
 * Build a map of blog post URLs to their lastmod dates
 * Reads directly from filesystem at config load time
 */
export function buildLastmodMap(siteUrl: string): LastmodMap {
  const blogDir = join(process.cwd(), BLOG_PATH);
  const map: LastmodMap = {};

  try {
    const files = readdirSync(blogDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const content = readFileSync(join(blogDir, file), "utf-8");
      const date = parseFrontmatterDate(content);

      if (date) {
        const slug = getSlugFromFilename(file);
        const url = `${siteUrl}/posts/${slug}/`;
        map[url] = date;
      }
    }
  } catch {
    // If blog directory doesn't exist or can't be read, return empty map
    // Sitemap will still work, just without lastmod for posts
  }

  return map;
}
