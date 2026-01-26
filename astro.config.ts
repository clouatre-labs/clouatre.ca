import sitemap from "@astrojs/sitemap";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import indexnow from "astro-indexnow";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import { SITE } from "./src/config";
import remarkFaqSchema from "./src/utils/remark-faq-schema";
import { buildLastmodMap } from "./src/utils/sitemap-lastmod";
import { transformerFileName } from "./src/utils/transformers/fileName";

// Build lastmod map from blog frontmatter at config load time
// Only blog posts get lastmod (from modDatetime or pubDatetime)
// Static pages omit lastmod per Google best practices
const postLastmodMap = buildLastmodMap(SITE.website);

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
      serialize: (item) => {
        // Only add lastmod for blog posts with actual modification dates
        // Google ignores inaccurate lastmod values, so we only include
        // dates we can verify from frontmatter
        const lastmod = postLastmodMap[item.url];
        if (lastmod) {
          item.lastmod = lastmod.toISOString();
        }
        return item;
      },
    }),
    indexnow({
      key: process.env.INDEXNOW_KEY,
      enabled: !!process.env.INDEXNOW_KEY,
    }),
  ],
  markdown: {
    remarkPlugins: [
      [remarkToc, { maxDepth: 3 }],
      remarkFaqSchema,
      [remarkCollapse, { test: "Table of contents", summary: "Contents" }],
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    // @ts-expect-error - Vite version mismatch between Astro and @tailwindcss/vite
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
