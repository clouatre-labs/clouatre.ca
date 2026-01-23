import { getCollection, render } from "astro:content";
import rss from "@astrojs/rss";
import { experimental_AstroContainer } from "astro/container";
import { SITE } from "@/config";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";

const RSS_ITEM_LIMIT = 20;

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = getSortedPosts(posts).slice(0, RSS_ITEM_LIMIT);
  const container = await experimental_AstroContainer.create();

  const items = await Promise.all(
    sortedPosts.map(async (post) => {
      try {
        const { Content } = await render(post);
        const content = await container.renderToString(Content);

        return {
          link: getPath(post.id, post.filePath),
          title: post.data.title,
          description: post.data.description,
          pubDate: new Date(post.data.modDatetime ?? post.data.pubDatetime),
          author: SITE.author,
          content,
          categories: post.data.tags,
        };
      } catch {
        // Fallback if post fails to render - include item without full content
        return {
          link: getPath(post.id, post.filePath),
          title: post.data.title,
          description: post.data.description,
          pubDate: new Date(post.data.modDatetime ?? post.data.pubDatetime),
          author: SITE.author,
          categories: post.data.tags,
        };
      }
    }),
  );

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items,
  });
}
