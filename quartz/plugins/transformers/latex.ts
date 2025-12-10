import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeMathjax from "rehype-mathjax/svg"
//@ts-ignore
import rehypeTypst from "@myriaddreamin/rehype-typst"
import { QuartzTransformerPlugin } from "../types"
import { KatexOptions } from "katex"
import { Options as MathjaxOptions } from "rehype-mathjax/svg"
//@ts-ignore
import { Options as TypstOptions } from "@myriaddreamin/rehype-typst"
import { NodeCompiler } from "@myriaddreamin/typst-ts-node-compiler"
import { visitParents } from "unist-util-visit-parents"
// @ts-ignore
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic"
import { toText } from "hast-util-to-text"

interface Options {
  renderEngine: "katex" | "mathjax" | "typst"
  customMacros: MacroType
  katexOptions: Omit<KatexOptions, "macros" | "output">
  mathJaxOptions: Omit<MathjaxOptions, "macros">
  typstOptions: TypstOptions
  typstPreamble: string
}

interface MacroType {
  [key: string]: string
}

let compilerIns: NodeCompiler

const rehypeTypstCustom = (options: any) => {
  const preamble = options.preamble || ""

  return async (tree: any, file: any) => {
    const matches: any[] = []
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

    compilerIns ||= NodeCompiler.create()
    const $typst = compilerIns

    for (const { element, parents } of matches) {
      const classes = element.properties.className || []
      const languageMath = classes.includes("language-math")
      const mathDisplay = classes.includes("math-display")
      let displayMode = mathDisplay

      let scope = element
      let parent = parents[parents.length - 1]

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
          if (takenDiags) {
            const diags = $typst.fetchDiagnostics(takenDiags)
            console.error("Typst compilation diagnostics:", JSON.stringify(diags, null, 2))
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
            else if (typeof val === "object" && val !== null && "pt" in val) baselinePosition = val.pt
            else if (typeof val === "string") baselinePosition = parseFloat(val)
          }
        }

        const root = fromHtmlIsomorphic(svg, { fragment: true })
        const defaultEm = 11
        const rootChild = root.children[0] as any
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
                className: ["typst-display"],
              },
              children: [rootChild],
            },
          ]
        } else {
          if (!rootChild.properties.className) rootChild.properties.className = []
          rootChild.properties.className.push("typst-inline")
          result = [rootChild]
        }
      } catch (err) {
        console.error("Typst compilation error:", err)
        result = [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: ["typst-error"],
              style: "color: red",
              title: String(err),
            },
            children: [{ type: "text", value: `Typst Error: ${err}` }],
          },
        ]
      }

      const index = parent.children.indexOf(scope)
      parent.children.splice(index, 1, ...result)
    }
  }
}

export const Latex: QuartzTransformerPlugin<Partial<Options>> = (opts) => {
  const engine = opts?.renderEngine ?? "katex"
  const macros = opts?.customMacros ?? {}
  return {
    name: "Latex",
    markdownPlugins() {
      return [remarkMath]
    },
    htmlPlugins() {
      switch (engine) {
        case "katex": {
          return [[rehypeKatex, { output: "html", macros, ...(opts?.katexOptions ?? {}) }]]
        }
        case "typst": {
          return [[rehypeTypstCustom, { ...opts?.typstOptions, preamble: opts?.typstPreamble }]]
        }
        case "mathjax": {
          return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]]
        }
        default: {
          return [[rehypeMathjax, { macros, ...(opts?.mathJaxOptions ?? {}) }]]
        }
      }
    },
    externalResources() {
      switch (engine) {
        case "katex":
          return {
            css: [{ content: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" }],
            js: [
              {
                // fix copy behaviour: https://github.com/KaTeX/KaTeX/blob/main/contrib/copy-tex/README.md
                src: "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/copy-tex.min.js",
                loadTime: "afterDOMReady",
                contentType: "external",
              },
            ],
          }
      }
    },
  }
}
