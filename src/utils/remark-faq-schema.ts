// SPDX-License-Identifier: Apache-2.0
// Copyright (c) 2025 Hugues Clouatre

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

interface Question {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Question[];
}

interface AstroNode {
  type: string;
  value?: string;
  children?: AstroNode[];
}

interface AstroFile {
  data: {
    astro?: {
      frontmatter?: Record<string, unknown>;
    };
  };
}

/**
 * Extract text content from a node recursively
 */
function extractText(node: AstroNode): string {
  if (node.type === "text") {
    return node.value ?? "";
  }
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join("");
  }
  return "";
}

/**
 * Remark plugin to generate FAQPage JSON-LD schema from H2 headings ending with '?'
 */
export default function remarkFaqSchema() {
  return (tree: Root, file: AstroFile) => {
    const questions: Question[] = [];

    visit(tree, "heading", (node, index, parent) => {
      // Only process H2 headings (depth = 2)
      if (node.depth !== 2) {
        return;
      }

      // Extract heading text
      const headingText = extractText(node);

      // Check if heading ends with '?'
      if (!headingText.trim().endsWith("?")) {
        return;
      }

      // Find the next paragraph node
      if (!parent || !Array.isArray(parent.children) || index === undefined) {
        return;
      }

      const nextIndex = index + 1;
      if (nextIndex >= parent.children.length) {
        return;
      }

      const nextNode = parent.children[nextIndex];

      // Check if next node is a paragraph
      if (nextNode.type !== "paragraph") {
        return;
      }

      // Extract paragraph text as answer
      const answerText = extractText(nextNode);

      if (answerText.trim()) {
        questions.push({
          "@type": "Question",
          name: headingText.trim(),
          acceptedAnswer: {
            "@type": "Answer",
            text: answerText.trim(),
          },
        });
      }
    });

    // Only inject schema if questions were found
    if (questions.length > 0) {
      const faqSchema: FAQPageSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions,
      };

      // Inject into frontmatter
      if (!file.data.astro) {
        file.data.astro = {};
      }
      if (!file.data.astro.frontmatter) {
        file.data.astro.frontmatter = {};
      }

      file.data.astro.frontmatter.faqSchema = faqSchema;
    }
  };
}
