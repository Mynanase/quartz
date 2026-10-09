import assert from "node:assert/strict"
import { test } from "node:test"
import { renderToString } from "preact-render-to-string"
import AllNotesPageList from "./index.js"
import { isListedNote } from "./notes.js"

function note(slug: string, updated = "2026-01-01T00:00:00Z", extra = {}) {
  const date = new Date(updated)
  return {
    slug,
    filePath: `content/${slug}.md`,
    relativePath: `${slug}.md`,
    frontmatter: { title: slug, tags: ["math"] },
    dates: { created: date, modified: date, published: date },
    defaultDateType: "modified",
    ...extra,
  }
}

test("full list and recent notes exclude indexes, generated pages, and hidden content", () => {
  assert.equal(isListedNote(note("posts/article")), true)
  assert.equal(isListedNote(note("notes/nested/article")), true)
  for (const file of [
    note("index"),
    note("notes/index"),
    note("tags/index"),
    note("tags/math"),
    note("00 Assets/example"),
    note("private/example"),
    note("templates/example"),
    note(".obsidian/example"),
    note("all-notes", undefined, { filePath: undefined }),
    note("404", undefined, { filePath: undefined }),
    note("query", undefined, { filePath: "content/query.base" }),
    note("hidden", undefined, { unlisted: true }),
    note("hidden-frontmatter", undefined, { frontmatter: { title: "Hidden", unlisted: true } }),
    note("draft", undefined, { frontmatter: { title: "Draft", draft: true } }),
  ]) {
    assert.equal(isListedNote(file), false, file.slug)
  }
})

test("PageList shows every listed note in descending update order without mutating allFiles", () => {
  const allFiles = [
    note("oldest", "2026-01-01T00:00:00Z"),
    ...Array.from({ length: 6 }, (_, i) => note(`note-${i}`, `2026-01-0${i + 2}T00:00:00Z`)),
    note("newest", "2026-01-08T15:00:00Z"),
    note("same-day-earlier", "2026-01-08T09:00:00Z"),
    note("excluded", "2026-01-09T00:00:00Z", { unlisted: true }),
  ]
  const original = [...allFiles]
  const body = AllNotesPageList().body(undefined)
  const html = renderToString(
    body({
      fileData: { slug: "all-notes", frontmatter: { title: "All Notes" } },
      cfg: { locale: "en-US" },
      allFiles,
      tree: { type: "root", children: [] },
    }),
  )
  assert.equal((html.match(/class="section-li"/g) ?? []).length, 9)
  assert.ok(html.indexOf('href="./newest"') < html.indexOf('href="./same-day-earlier"'))
  assert.ok(html.indexOf('href="./same-day-earlier"') < html.indexOf('href="./oldest"'))
  assert.ok(!html.includes("excluded"))
  assert.ok(html.includes('datetime="2026-01-08T15:00:00.000Z"'))
  assert.ok(html.includes('href="./tags/math"'))
  assert.deepEqual(allFiles, original)
})

test("PageList generates the configured full-list page using the folder layout", () => {
  const page = AllNotesPageList({ slug: "all-notes", title: "All Notes" })
  assert.deepEqual(page.generate(), [{ slug: "all-notes", title: "All Notes", data: {} }])
  assert.equal(page.layout, "folder")
  assert.equal(page.match({ slug: "all-notes" }), true)
  assert.equal(page.match({ slug: "posts/example" }), false)
})
