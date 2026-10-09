import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import { isListedNote } from "./local-plugins/page-list/notes.js"

// Use the same note scope for the sidebar preview, remaining count, and full list.
componentRegistry.setOptionOverrides("@quartz-community/recent-notes", {
  filter: isListedNote,
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
