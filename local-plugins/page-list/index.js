import { h } from "preact"
import { FolderContent, PageList } from "@quartz-community/folder-page/components"
import { byDateAndAlphabetical } from "@quartz-community/utils/sort"
import { isListedNote } from "./notes.js"

export default function AllNotesPageList({ slug = "all-notes", title = "All Notes" } = {}) {
  const Body = (props) =>
    h(
      "div",
      { class: "popover-hint" },
      h(
        "div",
        { class: "page-listing" },
        h(PageList, {
          ...props,
          allFiles: props.allFiles.filter(isListedNote),
          sort: byDateAndAlphabetical(),
        }),
      ),
    )

  // Reuse the community PageList's standard folder/tag listing styles.
  Body.css = FolderContent().css

  return {
    name: "AllNotesPageList",
    priority: 20,
    match: ({ slug: pageSlug }) => pageSlug === slug,
    generate: () => [{ slug, title, data: {} }],
    layout: "folder",
    body: () => Body,
  }
}
