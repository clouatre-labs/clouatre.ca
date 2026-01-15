import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts);

  const baseURL = site || SITE.website;

  let content = `# ${SITE.title}\n\n`;
  content += `> ${SITE.desc}\n\n`;
  content += `## Blog Posts\n\n`;
  content += `<docs>\n`;

  for (const post of sortedPosts) {
    const postPath = getPath(post.id, post.filePath);
    const postURL = new URL(postPath, baseURL).href;
    const pubDate = post.data.pubDatetime
      ? new Date(post.data.pubDatetime).toISOString().split("T")[0]
      : "";

    const escapedBody = (post.body || "").replace(/<\/doc>/g, "&lt;/doc&gt;");
    content += `<doc url="${postURL}" title="${post.data.title}" date="${pubDate}">\n`;
    content += `${escapedBody}\n`;
    content += `</doc>\n\n`;
  }

  content += `</docs>\n`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
