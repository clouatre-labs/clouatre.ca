# Blog Enhancement Roadmap

Concise roadmap for clouatre.ca based on AstroPaper v5 reference implementation.

## ✅ Already Working

These features are already configured and working:
- Professional color scheme (custom blue)
- Reading time in post details
- Author bio section
- Cloudflare Web Analytics
- Preview deployments
- Google Search Console (DNS validated)
- Sitemap auto-generation
- Pagefind search (full-text search)
- Scheduled posts (`scheduledPostMargin: 15 min`)
- Dynamic OG images
- Light/dark mode toggle
- Syntax highlighting (Shiki with transformers)
- View transitions

## 🔍 To Verify

### Table of Contents
**Already configured** - just needs testing

Theme has `remarkToc` and `remark-collapse` plugins configured. 

**Test:** Add `## Table of contents` heading to a blog post with multiple sections.

**Files:** Already in `astro.config.ts`

---

## 🎯 Enhancement Backlog

### Reading Time on Cards
**Status:** Not implemented  
**Impact:** Medium - helps readers choose content

Show "X min read" on post cards (homepage, archives, search results).

**Files to modify:**
- `src/components/Card.astro` - Add reading time display
- `src/pages/index.astro` - Calculate and pass reading time
- `src/pages/posts/[...page].astro` - Same
- `src/pages/archives/index.astro` - Same

---

### Related Posts
**Status:** Not implemented  
**Impact:** High - increases engagement

Show 2-3 related posts at end of each article (tag-based similarity).

**Files to create:**
- `src/components/RelatedPosts.astro`
- `src/utils/getRelatedPosts.ts`

**Files to modify:**
- `src/layouts/PostDetails.astro` - Add related posts section

---

### Comments (Giscus)
**Status:** Not implemented  
**Impact:** High - community engagement

GitHub Discussions-based comments (privacy-friendly, no tracking).

**Prerequisites:**
1. Enable Discussions on GitHub repo
2. Install Giscus GitHub App
3. Choose discussion category

**Files to create:**
- `src/components/Giscus.astro`

**Files to modify:**
- `src/config.ts` - Add Giscus config
- `src/layouts/PostDetails.astro` - Add comments section

**Reference:** https://astro-paper.pages.dev/posts/how-to-integrate-giscus-comments/

---

### Popular Tags Widget
**Status:** Not implemented  
**Impact:** Medium - content discovery

Tag cloud or popular tags section (by post count).

**Files to modify:**
- `src/pages/tags/index.astro` - Add tag frequency display

---

### Enhanced Search
**Status:** Not implemented  
**Impact:** Medium - better discovery

Add filters to existing Pagefind search (filter by tag, sort by date).

**Files to modify:**
- `src/pages/search.astro` - Add filter UI
- Pagefind configuration

---

### Newsletter Signup (MVP)
**Status:** Not implemented  
**Impact:** High - audience building

Simple email subscription form.

**MVP Implementation:**
- Form component (email only)
- Cloudflare Worker endpoint
- KV storage for subscribers
- Manual email workflow (export CSV)

**Files to create:**
- `src/components/NewsletterSignup.astro`
- Cloudflare Worker for form handling

**Location:** Footer or end of posts

---

### Post Series Support
**Status:** Not implemented  
**Impact:** Medium-High - great for tutorials

Link related posts as a series (multi-part tutorials, deep dives).

**Implementation:**
- Add `series` frontmatter field to schema
- Series navigation component (prev/next)
- Auto-detect posts in same series

**Files to create:**
- `src/components/SeriesNav.astro`
- `src/utils/getSeries.ts`

**Files to modify:**
- Content schema: Add series field
- `src/layouts/PostDetails.astro` - Add series nav

---

### Predefined Color Schemes
**Status:** Not implemented  
**Impact:** Low - nice to have

Add predefined color scheme options from official theme (Astro Dark, Dracula, Night Owl, Monokai).

**Files to modify:**
- `src/styles/global.css` - Add color scheme options
- Optional: Color switcher component

**Reference:** https://astro-paper.pages.dev/posts/predefined-color-schemes/

---

## 🔮 Future Considerations

- Custom 404 with search
- Draft posts support (theme already has frontmatter field)
- RSS improvements (full-text, multiple feeds)
- Multi-language support (French/English)
- Code playground integration
- Post view counter (Cloudflare Workers + KV)
- Post reactions/likes

---

## Priority Sequence

**Do First (High Impact, Low Effort):**
1. Verify TOC works
2. Reading time on cards
3. Related posts

**Do Next (High Impact, Medium Effort):**
4. Giscus comments
5. Newsletter signup

**Nice to Have:**
6. Popular tags
7. Enhanced search
8. Post series

---

## Notes

- All features maintain AstroPaper's professional appearance
- Privacy-first (Giscus, Cloudflare Analytics, no tracking)
- Mobile-responsive by default
- Backward compatible
- Incremental implementation

---

## References

- [AstroPaper Demo](https://astro-paper.pages.dev/)
- [AstroPaper v5 Release](https://astro-paper.pages.dev/posts/astro-paper-v5/)
- [Color Schemes](https://astro-paper.pages.dev/posts/customizing-astropaper-theme-color-schemes/)
- [Giscus Integration](https://astro-paper.pages.dev/posts/how-to-integrate-giscus-comments/)
- [Pagefind Search](https://pagefind.app/)
