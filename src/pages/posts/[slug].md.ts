import { type CollectionEntry, getCollection } from "astro:content";
import type { APIRoute, GetStaticPaths } from "astro";
import { getPath } from "@/utils/getPath";

// Helper function to escape YAML special characters
function escapeYaml(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, " ");
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");

  return posts.map((post) => ({
    params: { slug: getPath(post.id, post.filePath, false) },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: CollectionEntry<"blog"> };

  const frontmatter = `---
title: "${escapeYaml(post.data.title)}"
description: "${escapeYaml(post.data.description)}"
pubDatetime: ${post.data.pubDatetime?.toISOString() || "null"}
---

`;

  const content = frontmatter + post.body;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
