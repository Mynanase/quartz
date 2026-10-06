# AGENTS.md

Personal Quartz v4 digital garden (fork of jackyzha0/quartz, origin `Mynanase/quartz`), published at `blog.qttao.net`. Site generator source lives in `quartz/`; the actual notes are Chinese Obsidian-flavored Markdown in `content/` (`Life/`, `Notes/`, `Posts/`, `00 Assets/`). `docs/` is itself a Quartz site documenting the framework.

## Commands

- `npx quartz build --serve` — build + hot-reload dev server over `content/`
- `npm run docs` — build + serve the documentation site (uses `-d docs`, a different content root)
- `npm run check` — `tsc --noEmit` + `prettier . --check` (what CI runs; run before pushing)
- `npm run format` — prettier write
- `npm test` — `tsx --test`; discovers `*.test.ts` files (e.g. `quartz/util/path.test.ts`, `fileTrie.test.ts`)
- `npx quartz build --bundleInfo -d docs` — CI's build smoke test
- `npx quartz sync` — commit/pull/push content changes (source of the `[PUBLISHER] Merge #N` commits)
- Requires Node >= 22, npm >= 10.9.2.

## Architecture

Build pipeline (`quartz/build.ts`): glob content → **transformers** (Markdown → HTML AST transforms) → **filters** (e.g. drop drafts) → **emitters** (write pages) → `public/`.

- `quartz.config.ts` — site config: theme, baseUrl, ignorePatterns (`private`, `templates`, `.obsidian`), plugin list
- `quartz.layout.ts` — page composition (`beforeBody` / `left` / `right` / `afterBody`); giscus comments configured here
- `quartz/components/` — Preact `.tsx` components; `pages/` full page types, `scripts/*.inline.ts` client-side scripts, `styles/*.scss` per-component styles
- `quartz/plugins/{transformers,filters,emitters}` — plugins, re-exported via `quartz/plugins/index.ts`
- `quartz/util/path.ts` — slug/URL conventions; `quartz/i18n/` — locale strings
- `quartz/cli/` + `quartz/bootstrap-cli.mjs` — the `quartz` CLI

## Conventions

- **Preact, not React**: tsconfig sets `jsxImportSource: preact`; never import from `react`.
- New components must be exported from `quartz/components/index.ts` before use in `quartz.layout.ts`.
- New plugins must be added to `quartz/plugins/index.ts` (transformer/filter/emitter index) **and** enabled in `quartz.config.ts`.
- TypeScript is strict with `noUnusedLocals`/`noUnusedParameters`; prettier formatting is enforced by `npm run check`.
- Content follows Obsidian conventions (wikilinks, callouts, frontmatter: `title`, `tags`, `status`, `share`, ...). Link resolution strategy is `shortest`.

## Gotchas

- CI workflows are gated on `github.repository == 'jackyzha0/quartz'`, so **CI does not run on this fork** — run `npm run check` and `npm test` locally before pushing.
- This repo intentionally tracks **upstream v4** (4.5.2), not v5: upstream released v5.0.0 (2026-09) with plugins extracted to external npm packages, which would require re-porting the local typst customization as a plugin package. Decision (2026-10): stay on v4; don't suggest migrating.
- `CustomOgImages` emitter significantly slows builds (see comment in `quartz.config.ts`); comment it out for fast iteration.
- LaTeX is rendered with the **typst** engine using `preamble.typ` at the repo root — keep that file present, the config reads it at import time.
- The typst stack is **locally customized and intentionally diverged from upstream**: `rehypeTypstCustom` in `quartz/plugins/transformers/latex.ts` (preamble injection, inline-math baseline alignment, em-based sizing) and `.typst-display` styles in `base.scss` (flex centering + horizontal scroll for wide equations) have no upstream equivalent. When merging upstream, preserve them; upstream's typst CSS (`g.typst-text` / `path.typst-shape` color rules) is complementary — the local SVG output uses the same class names, so both apply.
- **MathJax fallback (whole-note granularity)**: the typst branch of `latex.ts` chains `rehype-mathjax` after `rehypeTypstCustom`. All math in a note is compiled with typst first; if ANY formula fails (e.g. LaTeX-syntax notes with `\pqty`/`\vb`/`\begin{equation}`), NO typst replacement is applied and the entire note is rendered by MathJax (per-note engine consistency). Successful typst output carries `typst-display`/`typst-inline` classes but NOT `math-display`/`math-inline` (those trigger rehype-mathjax's detection — only failed elements keep `language-math` for the fallback). Fallback macros (physics-package style) live in `customMacros` in `quartz.config.ts`. Preserve this chain order when merging upstream.
- Default `quartz build` targets `content/`; anything under ignored folders (`private`, `templates`, `.obsidian`) is excluded from the build.

## Docs to read first

- `docs/configuration.md`, `docs/layout.md`, `docs/layout-components.md` — before touching config/layout
- `docs/plugins/` and `docs/features/` — before writing or changing plugins/components
