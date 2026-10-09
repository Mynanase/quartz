import { TagContent, TagPage } from "@quartz-community/tag-page"

// The installed TagPage factory forwards options to generation, but its body is
// an unbound constructor. Quartz invokes body(undefined), losing numPages/sort.
// Keep the community renderer and bind the same options to both entry points.
export default function ConfiguredTagPage(options) {
  return {
    ...TagPage(options),
    body: () => TagContent(options),
  }
}
