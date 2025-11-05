# Biome Configuration Notes

## Known Limitations

### Astro Files
Biome doesn't fully understand Astro component syntax:
- Variables used in JSX spread (`{...props}`) appear as unused
- Component prop shorthand (`{pubDatetime}`) appears as unused
- **Solution**: Disabled `noUnusedVariables` and `noUnusedImports` for `*.astro` files

### CSS Files  
Biome doesn't support Tailwind CSS `@apply` directives:
- All `@apply` statements trigger parse errors
- `@layer` and `@utility` directives not recognized
- **Solution**: CSS files should not be checked by Biome. Use Prettier or disable CSS checking.

### Current Configuration
- Astro files: Lint rules disabled for unused imports/variables
- CSS files: Parse errors expected - these don't affect builds
- JavaScript/TypeScript: Full Biome linting enabled

### CI/CD Strategy
For now, CI workflows should:
1. Run `astro check` (TypeScript validation)
2. Run `bun run build` (full build test)
3. Skip `bun run check` until Biome adds better Astro/CSS support

Alternatively, use `--diagnostic-level=error` or `--files-ignore-unknown=true` to reduce noise.
