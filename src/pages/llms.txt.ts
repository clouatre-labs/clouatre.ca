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

  for (const post of sortedPosts) {
    const postPath = getPath(post.id, post.filePath);
    const postURL = new URL(postPath, baseURL).href;
    content += `- [${post.data.title}](${postURL}): ${post.data.description}\n`;
  }

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
