import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/links.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"

interface Options {
  title: string
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  title: "",
})

interface LinkItem {
  slug: SimpleSlug
  title: string
  desc: string
}

const links: LinkItem[] = [
  { slug: "Posts" as SimpleSlug, title: "Posts", desc: "长推文与随笔" },
  { slug: "Notes" as SimpleSlug, title: "Notes", desc: "学习笔记" },
  { slug: "Life" as SimpleSlug, title: "Life", desc: "生活记录" },
  { slug: "Research" as SimpleSlug, title: "My Research", desc: "我的研究" },
  // { slug: "aboutme" as SimpleSlug, title: "About Me", desc: "关于我" },
]

export default ((userOpts?: Partial<Options>) => {
  function Links({ allFiles, fileData, displayClass, cfg }: QuartzComponentProps) {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    
    const makeLink = (slug: string) => {
      const slugPath = fileData.slug!
      return resolveRelative(slugPath, slug as SimpleSlug)
    }

    return (
      <div class={`links ${displayClass ?? ""}`}>
        <h3>{opts.title}</h3>
        <ul>
          {links.map((link) => (
            <li>
              <h3 style={{ marginTop: 0, marginBottom: 0 }}>
                <a href={makeLink(link.slug)}>{link.title}</a>
              </h3>
              <i>{link.desc}</i>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  Links.css = style
  return Links
}) satisfies QuartzComponentConstructor
