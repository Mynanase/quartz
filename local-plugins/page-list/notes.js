import { isFolderPath } from "@quartz-community/utils/path"

/** Shared scope for Recent Notes and the full chronological list. */
export function isListedNote(file) {
  const slug = file.slug
  if (
    !slug ||
    !file.filePath?.endsWith(".md") ||
    file.unlisted === true ||
    file.frontmatter?.unlisted === true ||
    file.frontmatter?.draft === true ||
    isFolderPath(slug) ||
    slug === "tags" ||
    slug.startsWith("tags/")
  ) {
    return false
  }

  const relativePath = file.relativePath ?? slug
  return !["00 Assets", "private", "templates", ".obsidian"].some((folder) =>
    relativePath.startsWith(`${folder}/`),
  )
}
