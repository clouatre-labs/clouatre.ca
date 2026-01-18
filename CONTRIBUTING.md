# Contributing to clouatre.ca

## Heading Hierarchy (AIO)

Blog posts are validated for heading hierarchy to optimize AI/LLM citation. Clear H2/H3 structure improves AI extraction and citation likelihood.

### Rules (Enforced in CI)

| Rule | Good | Bad |
|------|------|-----|
| No H1 in content | `## Section` | `# Section` |
| No skipped levels | `## H2` then `### H3` | `## H2` then `#### H4` |
| ATX-style headings | `## Heading` | `Heading` with underline |

**Tip:** Use question-based H2s (e.g., "How Does X Work?") for better AI parsing.

### Validate

```bash
# Check for issues
bun run validate:headings

# Auto-fix issues
bun run validate:headings:fix
```

### References

- [Mastering SEO Trends 2026: GEO, AEO and AIO](https://storetransform.com/mastering-seo-trends-geo-aeo-aio/)
- [How to optimize content for AI search engines](https://searchengineland.com/how-to-optimize-content-for-ai-search-engines-a-step-by-step-guide-467272)
- [AI Search Content Refresh Framework](https://www.getpassionfruit.com/blog/ai-search-content-refresh-framework-what-to-update-when-and-how-to-maintain-citations)
