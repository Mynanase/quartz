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
          segments.push(
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="update-icon"
                aria-label="Updated"
                style={{ marginRight: '4px', verticalAlign: 'middle' }}
              >
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 12a9 9 0 0 0 6.7 15L13 21"></path>
                <path d="M13 21h6v-6"></path>
              </svg>{" "}
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
