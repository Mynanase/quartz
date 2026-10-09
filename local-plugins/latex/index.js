/**
 * Local Quartz v5 port of the v4 Latex transformer
 * (quartz/plugins/transformers/latex.ts on the v4 branch).
 *
 * Renders math with the Typst engine, injecting the repo-root `preamble.typ`
 * into every formula compilation. If ANY formula in a note fails to compile,
 * the whole note is left untouched so the subsequent rehype-mathjax pass in
 * the same chain renders it with MathJax (keeps engine/style consistent
 * within a note).
 *
 * Local customizations vs upstream @myriaddreamin/rehype-typst
 * (preserve these when merging upstream):
 *   - preamble.typ injection into both inline and display templates
 *   - whole-note MathJax fallback on any typst failure
 *   - inline baseline alignment (pin/state measurement + vertical-align)
 *   - em-based sizing and .typst-display / .typst-inline class names
 *   - scope Typst's SVG fill reset so it cannot hide other page icons
 *
 * Options:
 *   renderEngine    "typst" (default) | "mathjax"
 *   typstPreamble   inline preamble string; defaults to reading preamble.typ
 *                   from the repo root (cwd)
 *   customMacros    MathJax fallback macros (physics-package style)
 *   typstOptions    passthrough options for the typst rehype chain
 *   mathJaxOptions  passthrough options for rehype-mathjax
 *
 * Note: "katex" is intentionally unsupported here (no rehype-katex dep);
 * re-enable @quartz-community/latex if KaTeX is ever needed.
 */
import fs from "node:fs"
import path from "node:path"
import remarkMath from "remark-math"
import rehypeMathjax from "rehype-mathjax/svg"
import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler"
import { visitParents } from "unist-util-visit-parents"
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic"
import { toText } from "hast-util-to-text"

/** @type {import("@myriaddreamin/typst-ts-node-compiler").NodeCompiler | undefined} */
let compilerIns

// 注入仓库自带数学字体（assets/typst-fonts，如 IBM Plex Math），
// 与内嵌默认字体（New CM 家族）合并供 preamble 的 set text(font:) 选用
function createCompiler() {
  const fontDir = path.join(process.cwd(), "assets", "typst-fonts")
  if (fs.existsSync(fontDir)) {
    return NodeCompiler.create({ fontArgs: [{ fontPaths: [fontDir] }] })
  }
  console.warn(`[Latex] font dir not found: ${fontDir}; using embedded fonts only`)
  return NodeCompiler.create()
}

function readPreamble() {
  const p = path.join(process.cwd(), "preamble.typ")
  try {
    return fs.readFileSync(p, "utf-8")
  } catch {
    console.warn(`[Latex] preamble.typ not found at ${p}; compiling formulas without preamble`)
    return ""
  }
}

const rehypeTypstCustom = (options) => {
  const preamble = options.preamble || ""

  return async (tree, file) => {
    const matches = []
    visitParents(tree, "element", (element, parents) => {
      const classes = Array.isArray(element.properties?.className)
        ? element.properties.className
        : []
      if (
        classes.includes("language-math") ||
        classes.includes("math-display") ||
        classes.includes("math-inline")
      ) {
        matches.push({ element, parents })
      }
    })

    if (matches.length === 0) return

    compilerIns ||= createCompiler()
    const $typst = compilerIns

    // 先编译收集全部结果；只要有一条失败，整篇笔记都不替换，
    // 全部交给链路中后续的 rehype-mathjax 渲染（保证篇内引擎/风格一致）
    const pending = []
    const failures = []

    for (const { element, parents } of matches) {
      const classes = element.properties.className || []
      const languageMath = classes.includes("language-math")
      const mathDisplay = classes.includes("math-display")
      let displayMode = mathDisplay

      let scope = element
      let parent = parents[parents.length - 1]

      // ```math 代码块：作用域提升到 <pre>，按 display 处理
      if (
        element.tagName === "code" &&
        languageMath &&
        parent &&
        parent.type === "element" &&
        parent.tagName === "pre"
      ) {
        scope = parent
        parent = parents[parents.length - 2]
        displayMode = true
      }

      if (!parent) continue

      const value = toText(scope, { whitespace: "pre" })

      const inlineMathTemplate = `
#set page(height: auto, width: auto, margin: 0pt)
${preamble}
#let s = state("t", (:))
#let pin(t) = context {
  let width = measure(line(length: here().position().y)).width
  s.update(it => it.insert(t, width) + it)
}
#show math.equation: it => {
  box(it, inset: (top: 0.5em, bottom: 0.5em))
}
$pin("l1")${value}$
#context [
  #metadata(s.final().at("l1")) <label>
]
`
      const displayMathTemplate = `
#set page(height: auto, width: auto, margin: 0pt)
${preamble}
$ ${value} $
`
      const mainFileContent = displayMode ? displayMathTemplate : inlineMathTemplate

      let result
      try {
        const docRes = $typst.compile({ mainFileContent })
        if (!docRes.result) {
          const takenDiags = docRes.takeDiagnostics()
          if (takenDiags && failures.length === 0) {
            // 只在首个失败时打印诊断，避免日志噪声
            const diags = $typst.fetchDiagnostics(takenDiags)
            console.warn("Typst compilation diagnostics:", JSON.stringify(diags, null, 2))
          }
          throw new Error("Typst compilation failed")
        }
        const doc = docRes.result
        const svg = $typst.svg(doc)

        let baselinePosition = 0
        if (!displayMode) {
          const query = $typst.query(doc, { selector: "<label>" })
          if (query && query.length > 0) {
            const val = query[0].value
            if (typeof val === "number") baselinePosition = val
            else if (typeof val === "object" && val !== null && "pt" in val)
              baselinePosition = val.pt
            else if (typeof val === "string") baselinePosition = parseFloat(val)
          }
        }

        const root = fromHtmlIsomorphic(svg, { fragment: true })
        // <style> inside an inline SVG applies to the whole HTML document.
        // Typst's unlayered `svg { fill: none }` otherwise overrides Quartz's
        // layered component styles and hides the theme/reader-mode icons.
        visitParents(root, "element", (node) => {
          if (node.tagName !== "style") return
          for (const child of node.children) {
            if (child.type === "text") {
              child.value = child.value.replace(/(^|})(\s*)svg(?=\s*\{)/g, "$1$2svg.typst-doc")
            }
          }
        })
        const defaultEm = 11
        const rootChild = root.children[0]
        const height = parseFloat(rootChild.properties["dataHeight"])
        const width = parseFloat(rootChild.properties["dataWidth"])

        if (!isNaN(height) && !isNaN(width)) {
          rootChild.properties.height = `${height / defaultEm}em`
          rootChild.properties.width = `${width / defaultEm}em`

          if (!displayMode) {
            const shift = height - baselinePosition
            const shiftEm = shift / defaultEm
            rootChild.properties.style =
              (rootChild.properties.style || "") + `; vertical-align: -${shiftEm}em;`
          }
        }

        if (displayMode) {
          result = [
            {
              type: "element",
              tagName: "div",
              properties: {
                // 不携带 math-display/math-inline：这些 class 会触发后续
                // rehype-mathjax 接管；仅失败的公式（保留 language-math）才应被兜底
                className: ["typst-display", "math"],
              },
              children: [rootChild],
            },
          ]
        } else {
          if (!rootChild.properties.className) rootChild.properties.className = []
          rootChild.properties.className.push("typst-inline", "math")
          result = [rootChild]
        }
      } catch {
        failures.push(value)
        continue
      }

      pending.push({ scope, parent, result })
    }

    if (failures.length > 0) {
      console.warn(
        `[Latex] ${file?.data?.filePath ?? "(unknown file)"}: ${failures.length}/${matches.length} formulas failed typst; ` +
          `rendering the whole note with MathJax instead (e.g. ${failures[0].slice(0, 60)})`,
      )
      return
    }

    for (const { scope, parent, result } of pending) {
      const index = parent.children.indexOf(scope)
      parent.children.splice(index, 1, ...result)
    }
  }
}

export default function Latex(opts) {
  const engine = opts?.renderEngine ?? "typst"
  const macros = opts?.customMacros ?? {}
  const preamble = opts?.typstPreamble ?? readPreamble()

  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      switch (engine) {
        case "katex": {
          throw new Error(
            `[Latex] renderEngine "katex" is not supported by this local plugin ` +
              `(no rehype-katex dependency). Use "typst" or "mathjax", ` +
              `or re-enable @quartz-community/latex.`,
          )
        }
        case "typst": {
          // typst 优先；编译失败的公式保留原样，由随后的 MathJax 兜底
          return [
            [rehypeTypstCustom, { ...(opts?.typstOptions ?? {}), preamble }],
            [
              rehypeMathjax,
              {
                ...(opts?.mathJaxOptions ?? {}),
                tex: {
                  ...(opts?.mathJaxOptions?.tex ?? {}),
                  macros,
                },
              },
            ],
          ]
        }
        default:
        case "mathjax": {
          return [
            [
              rehypeMathjax,
              {
                ...(opts?.mathJaxOptions ?? {}),
                tex: {
                  ...(opts?.mathJaxOptions?.tex ?? {}),
                  macros,
                },
              },
            ],
          ]
        }
      }
    },
  }
}
