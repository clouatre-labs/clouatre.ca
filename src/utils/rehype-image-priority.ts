import type { Element, Root } from "hast";
import { EXIT, visit } from "unist-util-visit";

/**
 * Rehype plugin to set priority attributes on the first image in blog posts.
 * Sets fetchpriority=high, loading=eager, decoding=sync on the first img element
 * to improve LCP P99 performance.
 *
 * Processes HTML AST during Astro's markdown rendering pipeline.
 */
export default function rehypeImagePriority() {
  return (tree: Root) => {
    let firstImageFound = false;

    visit(tree, "element", (node: Element) => {
      // Skip if we already found and modified the first image
      if (firstImageFound) {
        return EXIT;
      }

      // Find first img element
      if (node.tagName === "img" && node.properties) {
        // Set priority attributes
        node.properties.loading = "eager";
        node.properties.decoding = "sync";
        node.properties.fetchpriority = "high";

        firstImageFound = true;
        return EXIT;
      }
    });
  };
}
