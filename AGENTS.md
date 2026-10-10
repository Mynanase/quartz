# AGENTS.md

Personal Quartz **v5** digital garden (fork of jackyzha0/quartz, origin `Mynanase/quartz`), published at `blog.qttao.site`. Site generator source lives in `quartz/`; the actual notes are Chinese Obsidian-flavored Markdown in `content/` (`Life/`, `Notes/`, `Posts/`, `00 Assets/`). `docs/` is itself a Quartz site documenting the framework.

以配置为主，而不是直接修改原项目的组件。

## Commands

- `npm run build` — install configured plugins via `prebuild`, then build blog `content/` into `public/`
- `npm run deploy` — deploy the built `public/` to Cloudflare Worker `quartz` using `wrangler.json`; use `npm run deploy -- --dry-run` to validate without publishing
- `npx quartz build --serve` — build + hot-reload dev server over `content/`
- `npm run docs` — build + serve the documentation site (uses `-d docs`, a different content root)
- `npm run check` — `tsc --noEmit` + `prettier . --check` (what CI runs; run before pushing)
- `npm run format` — prettier write
- `npm test` — `tsx --test`; discovers `*.test.ts` files (e.g. `quartz/util/path.test.ts`, `fileTrie.test.ts`)
- `npm run install-plugins` — prebuild step: installs/symlinks external & local plugins listed in `quartz.config.yaml`
- `npx quartz build --bundleInfo -d docs` — CI's build smoke test
- `npx quartz sync` — commit/pull/push content changes (source of the `[PUBLISHER] Merge #N` commits)
- Requires Node >= 22, npm >= 10.9.2.

## Architecture

Build pipeline (`quartz/build.ts` + `quartz/processors/parse.ts`): glob content → **transformers** (Markdown → HTML AST transforms; each plugin's `htmlPlugins()` is flattened in `order`) → **filters** (e.g. drop drafts) → **emitters** (write pages) → `public/`.

- `quartz.config.yaml` — everything in one file: `configuration` (theme, baseUrl, ignorePatterns: `private`, `templates`, `.obsidian`), `plugins` (list with `source`/`enabled`/`options`/`order`), `layout` (per-component positions/groups, page-type overrides)
- Plugins resolve from npm packages (`@quartz-community/*`), git repos, or **local paths** (symlinked into `.quartz/plugins/`); loading logic in `quartz/plugins/loader/`
- `quartz/components/` — Preact `.tsx` core components; plugin-provided components register via the component registry
- `quartz/cli/*.js` + `quartz/bootstrap-cli.mjs` — plain-JS CLI (esbuild bundles `quartz/build.ts` with `packages: "external"`)
- `quartz/util/path.ts` — slug/URL conventions; `quartz/i18n/` — locale strings

## Conventions

- **Preact, not React**: tsconfig sets `jsxImportSource: preact`; never import from `react`.
- Prefer configuring existing plugin packages via `quartz.config.yaml` options; add local plugins under `local-plugins/` (see `local-plugins/latex/` for the pattern: `package.json` with a `quartz` manifest + plain ESM `index.js` default-exporting a factory).
- TypeScript is strict with `noUnusedLocals`/`noUnusedParameters`; prettier formatting is enforced by `npm run check`.
- Content follows Obsidian conventions (wikilinks, callouts, frontmatter: `title`, `tags`, `status`, `share`, ...). Link resolution strategy is `shortest`.

## Gotchas

- **Cloudflare Workers**: `blog.qttao.site` is bound to Worker `quartz`, separate from the legacy Pages project of the same name. Root `wrangler.json` preserves the v4 static-assets configuration (`public/`, `404-page`, compatibility date `2026-10-01`). Workers Builds should target branch `v5`, use `npm run build` and `npm run deploy`, with Node 24. Publishing is controlled through the Cloudflare Web dashboard; only push to GitHub unless the user explicitly requests direct deployment.
- CI workflows are gated on `github.repository == 'jackyzha0/quartz'`, so **CI does not run on this fork** — run `npm run check` and `npm test` locally before pushing.
- **v5 migration (2026-10)**: this branch tracks upstream `v5` (plugin-package architecture). The v4 line is preserved on the `v4` branch. Config was migrated from v4's `quartz.config.ts`/`quartz.layout.ts` into `quartz.config.yaml`; keep that file (plus `local-plugins/`, `preamble.typ`) when merging upstream.
- `CustomOgImages` (`@quartz-community/og-image`) emitter significantly slows builds; disable it for fast iteration.
- LaTeX is rendered with the **typst** engine via the local plugin `./local-plugins/latex` (v4 port). It reads `preamble.typ` at the repo root when the plugin factory runs — keep that file present. The math font is **Lete Sans Math 0.63** (OFL, Regular / Bold vendored in `assets/typst-fonts/`; sans-serif style chosen to match IBM Plex Sans body text), injected via `NodeCompiler.create({ fontArgs })` in the plugin. Missing symbols may fall back per-glyph to embedded New CM; whole-note MathJax fallback retains its CM style. Latin Modern Math (GFL) and IBM Plex Math (OFL) are kept as revert candidates.
- The typst stack is **locally customized and intentionally diverged from upstream**: `rehypeTypstCustom` in `local-plugins/latex/index.js` (preamble injection, inline-math baseline alignment, em-based sizing) and `.typst-display` styles in `quartz/styles/base.scss` (flex centering + horizontal scroll for wide equations) have no upstream equivalent (`@myriaddreamin/rehype-typst` / `@quartz-community/latex`). When merging upstream, preserve them; upstream's typst CSS (`g.typst-text` / `path.typst-shape` color rules) is complementary — the local SVG output uses the same class names, so both apply.
- **MathJax fallback (whole-note granularity)**: the `typst` engine chains `rehype-mathjax` after `rehypeTypstCustom`. All math in a note is compiled with typst first; if ANY formula fails (e.g. LaTeX-syntax notes with `\pqty`/`\vb`/`\begin{equation}`), NO typst replacement is applied and the entire note is rendered by MathJax (per-note engine consistency). Successful typst output carries `typst-display`/`typst-inline` classes but NOT `math-display`/`math-inline` (those trigger rehype-mathjax's detection — only failed elements keep `language-math` for the fallback). Fallback macros (physics-package style) live in `customMacros` under the local plugin entry in `quartz.config.yaml`. Preserve this chain order when merging upstream.
- **Typst SVG styles**: 内联 SVG 的 `<style>` 会作用于整页；编译器输出的全局 `svg { fill: none }` 会以无层叠样式覆盖 Quartz 的 `quartz-base` 组件样式，使主题/阅读模式等图标消失。`rehypeTypstCustom` 在解析 SVG 后将该选择器限定为 `svg.typst-doc`。保留此隔离处理，不用按钮 CSS 覆盖掩盖问题。
- **Reading layout**: 当前使用墨蓝提亮版（`themes/colors/ink-bright.yaml`，原版保存在 `ink.yaml`）配色（亮色背景 `#f8f9fa`、正文 `#3f4854`；暗色背景 `#191c21`、正文 `#e3e3e3`）。墨蓝、Catppuccin 与原 Quartz 等配色以普通 YAML 文件保存在 `themes/colors/`；切换时将所选文件的 `colors` 块复制到 `configuration.theme.colors`，再重新构建。优先采用配置与现有能力，避免为简单配置需求新增管理组件、抽象层或命令体系。颜色和组件分组在 `quartz.config.yaml` 配置；阅读宽度与字号在 `custom.scss` 中设置。`default` frame 正文最大 720px、两侧栏各 280px、网格栏间距 32px、侧栏左右内边距各 24px（正文与侧栏内容留白 56px），页面外侧留白各 24px；≥1400px 三栏，800–1400px 之间两栏（右栏在正文下方、隐藏目录），≤800px 单栏。尺寸由 `--reading-*` 变量控制；不覆盖其他 frame。正文 18px / 1.6，标题按 1.8 / 1.45 / 1.2 / 1.05 / 1 em 缩放，`antialiased` / Firefox `grayscale` 生效；正文 1.75 行高与标题行高、间距试验仍保留为注释。搜索按钮、主题/阅读模式图标和 callout 沿用 Quartz 默认样式。Typst 公式为 1em，随所在正文的字号缩放，保留公式居中/宽公式滚动、正文色；附加字形描边关闭（`--typst-stroke-width: 0`）。详见 `BLOG-CONFIG.md`。
- Default `quartz build` targets `content/`; anything under ignored folders (`private`, `templates`, `.obsidian`) is excluded from the build.
- **Fonts**: 正文字体 **IBM Plex Sans**（Latin，含 italic）+ **IBM Plex Sans SC**（简中优先，ImageKit 按需加载）+ **PingFang SC**（Apple 原生回退）+ **Noto Sans SC**（非 Apple 回退，CJK 无斜体）+ IBM Plex Mono（code），在 `quartz.config.yaml` theme.typography 声明（字重 400/600/700，`$semiBoldWeight: 600`）。当前 `cdnCaching: true`：访客直接从 Google Fonts CDN 加载 IBM Plex Sans / Noto Sans SC / IBM Plex Mono（Head.tsx 输出链接），构建零字体工作。核心 theme.typography 槽位只生成单族变量；完整混排栈（IBM Plex Sans → IBM Plex Sans SC → PingFang SC → Noto SC → 系统 CJK 回退；苹方最粗 Semibold(600)，header 的 700 取最接近字重）由 YAML 中启用的 `@quartz-community/quartz-fonts` 插件生成，body/header/title/interface 共用 `reading-font-stack` 锚点。插件设 `useThemeFonts: false`、`fontOrigin: local`，只负责 CSS 字体栈，不重复下载字体；theme.typography 继续负责 Google Fonts 加载。树中保留三个仅自托管模式（`cdnCaching: false`）才生效的休眠补丁，切回或合并上游时均需保留：(1) `componentResources.ts` browserUA（无 UA 时 Google 返回整只 TTF，CJK 每字重 ~6MB 且无分片）；(2) `theme.ts` processGoogleFonts 分片号正则（上游正则把上百分片互相覆盖，实测 351→21 个唯一文件）；(3) `componentResources.ts` 下载持久缓存（`node_modules/.cache/quartz-fonts`，8 路并行；否则每次 rebuild 串行下载 300+ 分片实测 ~3min，缓存后冷 19s/热 2s）。IBM Plex Sans SC 由 `./local-plugins/web-fonts` 接入：版本 1.1.0，字重 400/600/700，648 个官方 `unicode-range` WOFF2 分片。字体声明及 OFL 许可证保留在插件内，构建时生成独立 CSS；浏览器从 YAML `baseUrl` 指定的 ImageKit 目录按需加载字体，使用 `font-display: swap`，本机已安装字体仍优先命中 `local()`。博客构建不下载或复制这些 WOFF2。旧的 `quartz/static/fonts/plex-sc/`、`plex-sc-fonts.scss`、`scripts/vendor-plex-sc.mjs` 已移出仓库，备份在仓库外 `../font-cdn/ibm-plex-sans-sc/legacy-quartz/`。

## Docs to read first

- `docs/configuration.md`, `docs/layout.md`, `docs/layout-components.md` — before touching config/layout
- `docs/plugins/` and `docs/features/` — before writing or changing plugins/components
- `docs/cli/plugin.md` — plugin management, incl. local plugin development
