import { readFileSync } from "node:fs"
import { h } from "preact"

// Keep font declarations with the site; browsers fetch only needed WOFF2 subsets from the CDN.
export default function WebFonts({ baseUrl } = {}) {
  if (!baseUrl) throw new Error("WebFonts requires a public CDN baseUrl")
  const cdn = new URL(baseUrl)
  if (cdn.protocol !== "https:" || cdn.search || cdn.hash) {
    throw new Error("WebFonts baseUrl must be an HTTPS directory without a query or fragment")
  }
  const directory = cdn.href.endsWith("/") ? cdn.href : `${cdn.href}/`
  const declarations = readFileSync(new URL("./font.css", import.meta.url), "utf8").replace(
    /url\(["']?\.\/([^"')]+)["']?\)/g,
    (_match, filename) => `url("${new URL(filename, directory).href}")`,
  )

  return {
    name: "WebFonts",
    // Quartz validates transformers by their processing hooks, even for resource-only plugins.
    htmlPlugins() {
      return []
    },
    externalResources() {
      return {
        css: [{ content: declarations, inline: true }],
        additionalHead: [
          h("link", { rel: "preconnect", href: cdn.origin, crossOrigin: "anonymous" }),
        ],
      }
    },
  }
}
