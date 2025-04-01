import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
  showUpdated: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
  showUpdated: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      // Add creation date
      if (fileData.dates) {
        segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
      }

      // Add updated date if available and option enabled
      if (options.showUpdated && fileData.dates && fileData.dates.updated) {
        const creationDate = getDate(cfg, fileData)
        const updatedDate = fileData.dates.updated
        
        // Only show updated date if it's different from creation date
        if (!creationDate || updatedDate.getTime() > creationDate.getTime()) {
          // Fix: Use type-safe access for the updatedDate property
          const contentMeta = i18n(cfg.locale).components?.contentMeta
          const updatedText = cfg.locale && 
            contentMeta && 'updatedDate' in (contentMeta as any) ? 
            (contentMeta as any).updatedDate : 
            "󰚰"
          segments.push(
            <span>
              {updatedText}{" "}
              <Date date={updatedDate} locale={cfg.locale} />
            </span>
          )
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
