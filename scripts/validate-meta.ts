#!/usr/bin/env bun

import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const MIN_LENGTH = 50;
const MAX_LENGTH = 160;

interface FrontmatterData {
  title: string | null;
  description: string | null;
  isDraft: boolean;
}

interface ValidationResult {
  file: string;
  description?: string;
  errors: string[];
  skipped: boolean;
}

function extractFrontmatter(
  content: string,
): FrontmatterData & { parseError?: string } {
  try {
    const { data } = matter(content);
    const title = data.title;
    const desc = data.description;
    return {
      title: typeof title === "string" && title.trim() ? title.trim() : null,
      description: typeof desc === "string" && desc.trim() ? desc.trim() : null,
      isDraft: data.draft === true,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      title: null,
      description: null,
      isDraft: false,
      parseError: message,
    };
  }
}

async function validateBlogPosts(): Promise<void> {
  const blogDir = join(process.cwd(), "src/data/blog");

  // Check if directory exists
  try {
    const dirStat = await stat(blogDir);
    if (!dirStat.isDirectory()) {
      console.error(`ERROR: Not a directory: ${blogDir}`);
      process.exit(1);
    }
  } catch {
    console.error(`ERROR: Blog directory not found: ${blogDir}`);
    process.exit(1);
  }

  // Read all files recursively
  const entries = await readdir(blogDir, { recursive: true });
  const mdFiles = entries.filter((f) => f.endsWith(".md"));

  if (mdFiles.length === 0) {
    console.error(`ERROR: No markdown files found in ${blogDir}`);
    process.exit(1);
  }

  const results: ValidationResult[] = [];
  const descriptions = new Map<string, string[]>();

  // Read all files in parallel
  const fileContents = await Promise.all(
    mdFiles.map(async (file) => {
      const filePath = join(blogDir, file);
      const content = await Bun.file(filePath).text();
      return { file, content };
    }),
  );

  // Process results
  for (const { file, content } of fileContents) {
    const { title, description, isDraft, parseError } =
      extractFrontmatter(content);

    // Report parse errors as validation errors
    if (parseError) {
      results.push({
        file,
        description: undefined,
        errors: [`Failed to parse frontmatter: ${parseError}`],
        skipped: false,
      });
      continue;
    }

    // Skip draft posts
    if (isDraft) {
      results.push({ file, description: undefined, errors: [], skipped: true });
      continue;
    }

    const errors: string[] = [];

    if (!description) {
      errors.push("Missing or empty description");
    } else {
      const length = description.length;

      if (length < MIN_LENGTH) {
        errors.push(`Too short (${length} chars, minimum ${MIN_LENGTH})`);
      }
      if (length > MAX_LENGTH) {
        errors.push(`Too long (${length} chars, maximum ${MAX_LENGTH})`);
      }

      // Check if description just repeats the title (SEO anti-pattern)
      if (title && description.toLowerCase() === title.toLowerCase()) {
        errors.push("Description should not repeat the title");
      }

      // Track duplicates
      const existing = descriptions.get(description) || [];
      existing.push(file);
      descriptions.set(description, existing);
    }

    results.push({ file, description, errors, skipped: false });
  }

  // Report errors
  let hasErrors = false;
  for (const result of results) {
    if (result.errors.length > 0) {
      hasErrors = true;
      console.error(`ERROR: ${result.file}`);
      for (const error of result.errors) {
        console.error(`  - ${error}`);
      }
    }
  }

  // Report duplicates (warnings only, non-blocking)
  const duplicateWarnings: string[] = [];
  for (const [desc, files] of descriptions.entries()) {
    if (files.length > 1) {
      duplicateWarnings.push(
        `WARNING: Duplicate description in ${files.length} files:`,
      );
      duplicateWarnings.push(`  "${desc}"`);
      for (const file of files) {
        duplicateWarnings.push(`  - ${file}`);
      }
    }
  }

  // Exit with error if validation failed
  if (hasErrors) {
    process.exit(1);
  }

  // Print warnings after errors (so they appear at the end)
  for (const warning of duplicateWarnings) {
    console.warn(warning);
  }

  // Summary
  const validated = results.filter((r) => !r.skipped).length;
  const skipped = results.filter((r) => r.skipped).length;
  const skippedMsg = skipped > 0 ? `, ${skipped} drafts skipped` : "";
  const hasDuplicates = duplicateWarnings.length > 0;

  if (!hasDuplicates) {
    console.log(
      `Validated ${validated} blog posts - all descriptions OK${skippedMsg}`,
    );
  } else {
    console.log(`Validated ${validated} blog posts${skippedMsg}`);
  }
}

validateBlogPosts().catch((err) => {
  console.error("Validation failed:", err);
  process.exit(1);
});
