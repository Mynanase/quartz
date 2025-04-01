import { max } from "d3"
import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        // from data-repo
        repo: 'Mynanase/quartz',
        // from data-repo-id
        repoId: 'R_kgDOOIs5yg',
        // from data-category
        category: 'Announcements',
        // from data-category-id
        categoryId: 'DIC_kwDOOIs5ys4CoC4p',
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/Mynanase/quartz",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      spacerSymbol: "/",
      rootName: "Home",
      resolveFrontmatterTitle: true,
      showCurrentPage: true,
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    // Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
      direction: "row",
      gap: "1rem",
    }),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Most Recent",
        showTags: false,
        limit: 5,
        linkToMore: "tags/" as SimpleSlug, 
        filter: (f) => {
          if (f.filePath?.endsWith("index.md")) {
            return false
          }
          return true
        },
        sort: (f1, f2) => {
          if (f1.dates && f2.dates) {
            if (Math.abs(f2.dates.modified.getDay() - f1.dates.modified.getDay())<=3) {
              return f2.dates.created.getTime() - f1.dates.created.getTime()
            }
            return f2.dates.modified.getTime() - f1.dates.modified.getTime()
          } else if (f1.dates && !f2.dates) {
            return -1
          }
          return 1
        }
      })
    ),    
    Component.Explorer({
      title: "Explorer",
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      // mapFn: (node) => {
      //   if (node.isFolder) {
      //     node.displayName = "📁 " + node.displayName
      //   } else {
      //     node.displayName = "📄 " + node.displayName
      //   }
      // },
    }),
  ],
  right: [
    Component.TagList(),
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents({
      // maxDepth: 3,
      // minEntries: 1,
    })),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
