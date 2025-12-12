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
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href={makeLink("Posts")}>Posts</a></h3>
            <i>长推文与随笔</i>
          </li>
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href={makeLink("Notes")}>Notes</a></h3>
            <i>学习笔记</i>
          </li>
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href={makeLink("Life")}>Life</a></h3>
            <i>生活记录</i>
          </li>
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href={makeLink("Research")}>My Research</a></h3>
            <i>我的研究</i>
          </li>
          <li>
            <h3 style={{marginTop: 0, marginBottom: 0}}><a href={makeLink("aboutme")}>About Me</a></h3>
            <i>关于我</i>
          </li>
        </ul>
      </div>
    )
  }

  Links.css = style
  return Links
}) satisfies QuartzComponentConstructor
