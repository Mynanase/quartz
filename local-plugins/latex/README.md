# latex (local plugin)

Quartz v5 本地插件：v4 `quartz/plugins/transformers/latex.ts` 的移植，实现
**typst + `preamble.typ`** 的公式渲染方式。

## 渲染链

- `markdownPlugins`: `remark-math`
- `htmlPlugins`（`renderEngine: typst`，默认）:
  1. `rehypeTypstCustom` —— 用 `@myriaddreamin/typst-ts-node-compiler` 编译每条公式，
     编译模板注入仓库根目录的 `preamble.typ`（physica / cetz / `vb` / `vu` 等）；
     成功项替换为 SVG（em 尺寸、内联公式带 `vertical-align` 基线修正），
     display 公式包裹 `<div class="typst-display math">`。
  2. `rehype-mathjax/svg` —— 兜底：任一公式 typst 编译失败时整篇笔记不做替换，
     全部由 MathJax 渲染（配合 `customMacros` 的 physics 风格宏），保证篇内引擎一致。

## 与上游的差异（merge 时保留）

上游 `@myriaddreamin/rehype-typst` / `@quartz-community/latex` 的 typst 分支
**没有**以下本地定制：

| 定制                                              | 位置                                                       |
| ------------------------------------------------- | ---------------------------------------------------------- |
| preamble.typ 注入                                 | `index.js` 的 `inlineMathTemplate` / `displayMathTemplate` |
| 整篇 MathJax 兜底                                 | `pending` / `failures` 逻辑                                |
| 内联基线对齐（pin/state 测量 + `vertical-align`） | `index.js`                                                 |
| `.typst-display` flex 居中 + 横向滚动             | `quartz/styles/base.scss`                                  |

配套文件：仓库根目录 `preamble.typ`（缺失时仅 warn 并以空 preamble 编译）；
`assets/typst-fonts/`（数学字体库，经 `fontArgs.fontPaths` 注入，当前为
Latin Modern Math（GFL）+ IBM Plex Math（OFL，备选），由 preamble 的
`set text(font:)` 选用）。

## 依赖

由仓库根 `package.json` 提供（本插件经符号链接加载，Node 按真实路径解析）：
`remark-math`、`rehype-mathjax`、`@myriaddreamin/typst-ts-node-compiler`、
`hast-util-from-html-isomorphic`、`hast-util-to-text`、`unist-util-visit-parents`。

注意：`renderEngine: "katex"` 未实现（无 rehype-katex 依赖），选择该值会直接报错；
如需 KaTeX 请重新启用 `@quartz-community/latex`。
