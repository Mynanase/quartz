import { h } from "preact"
import { resolveRelative, simplifySlug, slugifyPath } from "@quartz-community/utils/path"

/** Fixed section links configured in YAML; Quartz handles SPA navigation. */
export function BlogNavigation({ links = [], label } = {}) {
  const Navigation = ({ fileData, cfg, displayClass }) => {
    const current = simplifySlug(fileData.slug)
    const navigationLabel = label ?? (cfg.locale?.startsWith("zh") ? "主导航" : "Main navigation")

    return h(
      "nav",
      {
        class: [displayClass, "blog-navigation"].filter(Boolean).join(" "),
        "aria-label": navigationLabel,
      },
      h(
        "ul",
        null,
        links.map(({ text, slug }) => {
          const linkSlug = slugifyPath(slug)
          const target = simplifySlug(linkSlug)
          const isCurrent = current === target
          // Folder links stay highlighted while reading a note in that section.
          const isSection = target.endsWith("/") && current.startsWith(target)
          return h(
            "li",
            { key: slug },
            h(
              "a",
              {
                href: resolveRelative(fileData.slug, linkSlug),
                class: ["internal", isCurrent || isSection ? "active" : ""]
                  .filter(Boolean)
                  .join(" "),
                "aria-current": isCurrent ? "page" : isSection ? "location" : undefined,
              },
              text,
            ),
          )
        }),
      ),
    )
  }

  Navigation.css = `
.blog-navigation > ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
.blog-navigation a {
  display: inline-block;
  background: transparent;
  color: var(--darkgray);
  font-weight: 400;
  padding: 0.25rem 0;
}
.blog-navigation a.active {
  color: var(--secondary);
  font-weight: 600;
}
.blog-navigation a:hover {
  color: var(--tertiary);
}
@media (max-width: 800px) {
  .page > #quartz-body > .sidebar.left:has(.blog-navigation) {
    flex-wrap: wrap;
  }
  .blog-navigation {
    flex-basis: 100%;
    margin-top: 1rem;
  }
  .blog-navigation > ul {
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 1.25rem;
    row-gap: 0.25rem;
  }
}
`
  return Navigation
}
