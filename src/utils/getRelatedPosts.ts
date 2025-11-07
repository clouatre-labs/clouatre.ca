import type { CollectionEntry } from "astro:content";
import { slugifyAll } from "./slugify";

/**
 * Get related posts based on tag similarity
 * @param currentPost - The current post
 * @param allPosts - All blog posts
 * @param limit - Maximum number of related posts to return (default: 3)
 * @returns Array of related posts sorted by tag similarity
 */
const getRelatedPosts = (
  currentPost: CollectionEntry<"blog">,
  allPosts: CollectionEntry<"blog">[],
  limit: number = 3,
): CollectionEntry<"blog">[] => {
  // Get slugified tags for comparison
  const currentTags = slugifyAll(currentPost.data.tags);

  // Calculate similarity and filter
  const postsWithSimilarity = allPosts
    .filter((post) => post.id !== currentPost.id) // Exclude current post
    .map((post) => {
      const postTags = slugifyAll(post.data.tags);
      const sharedTags = currentTags.filter((tag) => postTags.includes(tag));
      return {
        post,
        similarity: sharedTags.length,
      };
    })
    .filter(({ similarity }) => similarity > 0); // At least 1 shared tag

  // Sort by similarity (descending) and take top N
  return postsWithSimilarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(({ post }) => post);
};

export default getRelatedPosts;
