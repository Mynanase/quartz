import assert from "node:assert/strict"
import { test } from "node:test"
import { renderToString } from "preact-render-to-string"
import ConfiguredTagPage from "./index.js"

const allFiles = Array.from({ length: 6 }, (_, index) => {
  const date = new Date(Date.UTC(2026, 0, index + 1))
  return {
    slug: `posts/note-${index + 1}`,
    frontmatter: { title: `Note ${index + 1}`, tags: ["math"] },
    dates: { created: date, modified: date, published: date },
    defaultDateType: "modified",
  }
})

function renderPage(slug: string, options: Record<string, unknown>) {
  const plugin = ConfiguredTagPage(options)
  // The dispatcher calls this constructor without the YAML options.
  const body = plugin.body(undefined)
  return renderToString(
    body({
      fileData: { slug, frontmatter: { title: "Tags" } },
      cfg: { locale: "en-US" },
      tree: { type: "root", children: [] },
      allFiles,
    }),
  )
}

test("tag overview applies the configured preview limit and date order", () => {
  const html = renderPage("tags/index", { numPages: 1 })
  assert.ok(html.includes("Note 6"))
  assert.ok(!html.includes("Note 5"))
})

test("individual tag pages keep the full list despite the overview limit", () => {
  const html = renderPage("tags/math", { numPages: 1 })
  for (const file of allFiles) assert.ok(html.includes(file.frontmatter.title))
})

test("tag overview applies a custom article sort before limiting", () => {
  const html = renderPage("tags/index", {
    numPages: 1,
    sort: (first: (typeof allFiles)[number], second: (typeof allFiles)[number]) =>
      first.frontmatter.title.localeCompare(second.frontmatter.title),
  })
  assert.ok(html.includes("Note 1"))
  assert.ok(!html.includes("Note 6"))
})
