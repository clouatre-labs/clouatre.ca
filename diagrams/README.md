# D2 Diagrams

This directory contains D2 diagram sources for blog posts.

## Files

- **blog-template.d2** - Reusable theme matching Astro Paper dark mode colors
- **migration-workflow.d2** - DNS migration workflow diagram source
- **infrastructure-comparison.d2** - Before/after infrastructure comparison

## Theme Colors

Based on `src/styles/global.css` (dark mode):
- **Accent (Blue):** #38bdf8 - Primary actions, connectors
- **Success (Green):** #10b981 - Improvements, completion
- **Warning (Orange):** #f59e0b - Approval gates, caution
- **Error (Red):** #ef4444 - Problems, legacy issues
- **Muted (Dark):** #1e293b - Substeps, secondary elements
- **Border:** #334155 - Subtle borders
- **Background:** #0c1222 - Dark background
- **Foreground:** #f1f5f9 - Light text

## Generating Diagrams

```bash
# Migration workflow
d2 diagrams/migration-workflow.d2 src/assets/images/migration-workflow.png --theme=200 --pad=40

# Infrastructure comparison
d2 diagrams/infrastructure-comparison.d2 src/assets/images/infrastructure-comparison.png --theme=200 --pad=40
```

**Flags:**
- `--theme=200` - Neutral light theme (works on both light/dark page backgrounds)
- `--pad=40` - Breathing room around diagrams

## Astro Image Optimization

Images in `src/assets/images/` are **automatically optimized** at build time:

1. **PNG → WebP conversion** (~60% size reduction)
   - migration-workflow.png (457KB) → ~160KB WebP
   - infrastructure-comparison.png (261KB) → ~90KB WebP

2. **Responsive srcset generation** (multiple sizes for different screens)

3. **Lazy loading** (improves page load performance)

4. **Layout optimization** (prevents layout shift)

**In blog posts, reference as:**
```markdown
![Alt text](@/assets/images/diagram-name.png)
```

Astro handles the rest!

## Design Guidelines

### Text Contrast (Light/Dark Theme Compatible)

**Main titles on colored backgrounds:**
- Use white text (#ffffff) for maximum contrast
- Example: Blue boxes with white text, orange gates with dark text

**Section headers:**
- Dark text (#1e293b) on light backgrounds
- Light text (#f1f5f9) on dark backgrounds (#0f172a or darker)

**Container labels (outside boxes):**
- Use colors matching borders for visibility
- BEFORE: Red (#ef4444), AFTER: Green (#10b981)

### Visual Hierarchy

1. **Main containers** - Thick borders (3px), bold titles
2. **Section groups** - Medium borders, bold headers
3. **Items** - Standard borders, colored fills
4. **Substeps** - Subtle styling, smaller fonts

### Layout

- **Workflow diagrams:** Vertical (top-to-bottom flow)
- **Comparison diagrams:** Horizontal (side-by-side)
- **Arrow labels:** Concise (e.g., "2 hours Zero Downtime")

## Color Semantics

- **Red** - Problems, legacy, "before" state
- **Orange** - Warning, approval required, degraded
- **Green** - Success, improvements, "after" state  
- **Blue** - Process, actions, highlights
- **Gray** - Neutral, unchanged elements

## Example: Using Theme Classes

```d2
box: Example Box {
  style: {
    fill: "#38bdf8"      # Blue background
    stroke: "#60a5fa"     # Lighter blue border
    font-color: "#ffffff" # White text
    border-radius: 8
    shadow: true
    font-size: 16
    bold: true
  }
}
```

## Workflow

1. Edit `.d2` source file
2. Regenerate PNG: `d2 diagrams/file.d2 src/assets/images/file.png --theme=200 --pad=40`
3. Commit both source and generated PNG
4. Astro optimizes PNG → WebP at build time
5. Deploy

## Tools

- **D2:** https://d2lang.com/
- **Installation:** `brew install d2` (macOS)
- **Docs:** https://d2lang.com/tour/intro
