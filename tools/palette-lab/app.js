const presets = {}

const tokens = {
  light: "页面背景",
  lightgray: "边框 / 代码底色",
  gray: "图谱灰",
  darkgray: "正文 / 公式",
  dark: "标题 / 图标",
  secondary: "链接",
  tertiary: "悬停",
  highlight: "链接底色",
  textHighlight: "标记底色",
}
const modes = ["lightMode", "darkMode"]
const sides = ["a", "b"]
const transparentTokens = new Set(["highlight", "textHighlight"])
const panelElements = {}
const connectedDocuments = new WeakSet()
let state
let storageKey
let savingTimer

function parseColor(value) {
  const hex = value.trim().match(/^#([\da-f]{6})([\da-f]{2})?$/i)
  if (hex) {
    return {
      rgb: [0, 2, 4].map((offset) => parseInt(hex[1].slice(offset, offset + 2), 16)),
      alpha: hex[2] ? parseInt(hex[2], 16) / 255 : 1,
    }
  }
  const rgba = value
    .trim()
    .match(
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0(?:\.\d+)?|1(?:\.0+)?|\.\d+))?\s*\)$/i,
    )
  if (!rgba) return null
  const rgb = rgba.slice(1, 4).map(Number)
  const alpha = rgba[4] === undefined ? 1 : Number(rgba[4])
  return rgb.every((channel) => channel <= 255) ? { rgb, alpha } : null
}

function hexColor(rgb) {
  return "#" + rgb.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")
}

function withAlpha(rgb, alpha) {
  return `rgba(${rgb.join(", ")}, ${Number(alpha.toFixed(2))})`
}

function validColor(value, token) {
  if (typeof value !== "string" || value.length > 80) return false
  const parsed = parseColor(value)
  return parsed !== null && (transparentTokens.has(token) || parsed.alpha === 1)
}

function composite(value, background) {
  const { rgb, alpha } = parseColor(value)
  const base = parseColor(background).rgb
  return rgb.map((channel, index) => channel * alpha + base[index] * (1 - alpha))
}

function luminance(rgb) {
  const channels = rgb.map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrast(foreground, background) {
  const [low, high] = [luminance(parseColor(foreground).rgb), luminance(background)].sort(
    (a, b) => a - b,
  )
  return (high + 0.05) / (low + 0.05)
}

function newPanel(preset) {
  return { preset, mode: "lightMode", drafts: {} }
}

function paletteFor(side) {
  const panel = state.panels[side]
  panel.drafts[panel.preset] ??= Object.fromEntries(
    modes.map((mode) => [mode, structuredClone(presets[panel.preset][mode])]),
  )
  return panel.drafts[panel.preset]
}

function colorsFor(side) {
  return paletteFor(side)[state.panels[side].mode]
}

function yamlFor(side) {
  const palette = paletteFor(side)
  return (
    "colors:\n" +
    modes
      .map(
        (mode) =>
          `  ${mode}:\n` +
          Object.keys(tokens)
            .map((token) => `    ${token}: ${JSON.stringify(palette[mode][token])}`)
            .join("\n"),
      )
      .join("\n") +
    "\n"
  )
}

function restoreState(saved) {
  const restored = {
    panels: { a: newPanel("current"), b: newPanel("ink") },
    layout: "both",
    width: "auto",
    sync: true,
    content: "sample",
    currentBase: Object.fromEntries(
      modes.map((mode) => [mode, structuredClone(presets.current[mode])]),
    ),
  }
  if (!saved || typeof saved !== "object") return restored
  if (["a", "b", "both"].includes(saved.layout)) restored.layout = saved.layout
  if (["auto", "390", "720", "1440"].includes(saved.width)) restored.width = saved.width
  if (typeof saved.sync === "boolean") restored.sync = saved.sync
  if (typeof saved.content === "string") restored.content = saved.content
  for (const side of sides) {
    const source = saved.panels?.[side]
    if (!source || typeof source !== "object") continue
    const panel = restored.panels[side]
    if (Object.hasOwn(presets, source.preset)) panel.preset = source.preset
    if (modes.includes(source.mode)) panel.mode = source.mode
    for (const preset of Object.keys(presets)) {
      const draft = source.drafts?.[preset]
      if (!draft) continue
      if (preset === "current") {
        // Refresh untouched snapshots after a config change; preserve edited drafts.
        const previousBase = saved.currentBase ?? presets.quartz
        if (
          previousBase &&
          modes.every((mode) =>
            Object.keys(tokens).every(
              (token) => draft[mode]?.[token] === previousBase[mode]?.[token],
            ),
          )
        )
          continue
      }
      const result = {}
      for (const mode of modes) {
        result[mode] = structuredClone(presets[preset][mode])
        for (const token of Object.keys(tokens)) {
          if (validColor(draft[mode]?.[token], token)) result[mode][token] = draft[mode][token]
        }
      }
      panel.drafts[preset] = result
    }
  }
  return restored
}

function saveState() {
  clearTimeout(savingTimer)
  savingTimer = setTimeout(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
      document.querySelector("#save-status").textContent = "已保存在此浏览器 · 可随时导出"
    } catch {
      document.querySelector("#save-status").textContent = "浏览器存储不可用 · 请下载 YAML 保存"
    }
  }, 150)
}

function updatePreview(side) {
  const frame = panelElements[side].querySelector("iframe")
  const doc = frame.contentDocument
  if (!doc?.documentElement || doc.URL === "about:blank") return
  const panel = state.panels[side]
  const root = doc.documentElement
  root.dataset.theme = panel.mode === "darkMode" ? "dark" : "light"
  root.setAttribute("saved-theme", root.dataset.theme)
  root.style.colorScheme = root.dataset.theme
  for (const [token, value] of Object.entries(colorsFor(side)))
    root.style.setProperty(`--${token}`, value)
}

function syncScroll(side) {
  if (!state.sync || state.layout !== "both") return
  const other = side === "a" ? "b" : "a"
  const source = panelElements[side].querySelector("iframe").contentWindow
  const target = panelElements[other].querySelector("iframe").contentWindow
  if (!source.document.documentElement || !target.document.documentElement) return
  if (source.document.URL !== target.document.URL) return
  const sourceRange = Math.max(0, source.document.documentElement.scrollHeight - source.innerHeight)
  const targetRange = Math.max(0, target.document.documentElement.scrollHeight - target.innerHeight)
  const next = sourceRange > 0 ? (source.scrollY / sourceRange) * targetRange : 0
  if (Math.abs(target.scrollY - next) > 1) target.scrollTo({ top: next, behavior: "instant" })
}

function connectPreview(side) {
  const frame = panelElements[side].querySelector("iframe")
  const doc = frame.contentDocument
  if (!doc?.body || doc.URL === "about:blank") return
  updatePreview(side)
  if (connectedDocuments.has(doc)) return
  connectedDocuments.add(doc)
  // Keep both panes on the same reading content.
  doc.addEventListener(
    "click",
    (event) => {
      if (event.target.closest("a")) event.preventDefault()
    },
    true,
  )
  frame.contentWindow.addEventListener("scroll", () => syncScroll(side), { passive: true })
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin || event.data?.type !== "quartz-palette-ready") return
  const side = sides.find(
    (key) => panelElements[key]?.querySelector("iframe").contentWindow === event.source,
  )
  if (side) connectPreview(side)
})

function loadPreview(side) {
  const frame = panelElements[side].querySelector("iframe")
  frame.src =
    state.content === "sample"
      ? "/sample.html"
      : "/preview/" + state.content.split("/").map(encodeURIComponent).join("/") + ".html"
  frame.title = `${side.toUpperCase()} · ${state.content === "sample" ? "阅读样张" : "博客文章"}`
}

function updateField(side, token) {
  const value = colorsFor(side)[token]
  const field = panelElements[side].querySelector(`[data-token="${token}"]`)
  const parsed = parseColor(value)
  field.querySelector(".picker").value = hexColor(parsed.rgb)
  const text = field.querySelector(".value")
  if (document.activeElement !== text) text.value = value
  field.querySelector(".alpha").value = Math.round(parsed.alpha * 100)
  field.querySelector("output").textContent = `${Math.round(parsed.alpha * 100)}%`
}

function renderPanel(side) {
  const element = panelElements[side]
  const panel = state.panels[side]
  const c = colorsFor(side)
  element.querySelector(".preset").value = panel.preset
  element
    .querySelectorAll("[data-mode]")
    .forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.mode === panel.mode)),
    )
  element.querySelector(".preset-description").textContent = presets[panel.preset].description
  const edited = modes.some((mode) =>
    Object.keys(tokens).some(
      (token) => paletteFor(side)[mode][token] !== presets[panel.preset][mode][token],
    ),
  )
  element.querySelector(".edit-badge").textContent = edited ? "已调整" : "预设颜色"
  for (const token of Object.keys(tokens)) updateField(side, token)
  const summary = element.querySelector(".summary-colors")
  summary.replaceChildren()
  for (const token of ["light", "darkgray", "secondary", "tertiary"]) {
    const item = document.createElement("div")
    item.className = "summary-color"
    const swatch = document.createElement("span")
    swatch.style.background = c[token]
    item.append(swatch, `${tokens[token]} ${c[token]}`)
    summary.append(item)
  }
  const checks = [
    ["正文", c.darkgray, composite(c.light, c.light)],
    ["链接", c.secondary, composite(c.light, c.light)],
    ["悬停", c.tertiary, composite(c.light, c.light)],
    ["内链", c.secondary, composite(c.highlight, c.light)],
    ["内链悬停", c.tertiary, composite(c.highlight, c.light)],
    ["标记", c.darkgray, composite(c.textHighlight, c.light)],
  ]
  const metrics = element.querySelector(".contrast-strip")
  metrics.replaceChildren()
  for (const [name, foreground, background] of checks) {
    const ratio = contrast(foreground, background)
    const metric = document.createElement("span")
    metric.className = "metric" + (ratio < 4.5 ? " low" : "")
    metric.textContent = `${name} ${ratio.toFixed(2)}:1`
    metric.title = ratio < 4.5 ? "低于普通文字参考线 4.5:1" : "达到普通文字参考线 4.5:1"
    metrics.append(metric)
  }
  element.querySelector(".yaml").textContent = yamlFor(side)
  updatePreview(side)
}

function commitColor(side, token, value) {
  colorsFor(side)[token] = value
  renderPanel(side)
  saveState()
}

function clearFieldError(field) {
  field.querySelector(".value").setAttribute("aria-invalid", "false")
  field.querySelector(".field-error").textContent = ""
}

function resetFieldErrors(side) {
  panelElements[side].querySelectorAll(".color-field").forEach(clearFieldError)
}

function buildPanel(side) {
  const element = document
    .querySelector("#panel-template")
    .content.firstElementChild.cloneNode(true)
  element.dataset.side = side
  element.querySelector(".panel-letter").textContent = side.toUpperCase()
  const select = element.querySelector(".preset")
  for (const [key, preset] of Object.entries(presets)) select.add(new Option(preset.name, key))
  select.setAttribute("aria-label", `${side.toUpperCase()} 侧方案`)
  select.addEventListener("change", () => {
    state.panels[side].preset = select.value
    resetFieldErrors(side)
    renderPanel(side)
    saveState()
  })
  element.querySelectorAll("[data-mode]").forEach((button) =>
    button.addEventListener("click", () => {
      state.panels[side].mode = button.dataset.mode
      resetFieldErrors(side)
      renderPanel(side)
      saveState()
    }),
  )
  for (const [token, name] of Object.entries(tokens)) {
    const field = document
      .querySelector("#color-template")
      .content.firstElementChild.cloneNode(true)
    field.dataset.token = token
    const text = field.querySelector(".value")
    text.id = `${side}-${token}`
    const label = field.querySelector(".token-label")
    label.htmlFor = text.id
    label.textContent = name
    const code = document.createElement("small")
    code.textContent = token
    label.append(code)
    const picker = field.querySelector(".picker")
    picker.setAttribute("aria-label", `${side.toUpperCase()} ${name}拾色器`)
    const alpha = field.querySelector(".alpha")
    field.querySelector(".alpha-label").hidden = !transparentTokens.has(token)
    text.addEventListener("input", () => {
      if (!validColor(text.value, token)) {
        text.setAttribute("aria-invalid", "true")
        field.querySelector(".field-error").textContent = transparentTokens.has(token)
          ? "输入 #RRGGBB、#RRGGBBAA 或 rgba(...)"
          : "输入不透明的 #RRGGBB 或 rgb(...)"
        return
      }
      clearFieldError(field)
      commitColor(side, token, text.value.trim())
    })
    text.addEventListener("blur", () => {
      if (validColor(text.value, token)) text.value = colorsFor(side)[token]
    })
    picker.addEventListener("input", () => {
      clearFieldError(field)
      const opacity = parseColor(colorsFor(side)[token]).alpha
      const value = transparentTokens.has(token)
        ? withAlpha(parseColor(picker.value).rgb, opacity)
        : picker.value
      commitColor(side, token, value)
    })
    alpha.addEventListener("input", () => {
      clearFieldError(field)
      commitColor(
        side,
        token,
        withAlpha(parseColor(colorsFor(side)[token]).rgb, Number(alpha.value) / 100),
      )
    })
    element.querySelector(".color-grid").append(field)
  }
  element.querySelector(".reset").addEventListener("click", () => {
    delete state.panels[side].drafts[state.panels[side].preset]
    resetFieldErrors(side)
    renderPanel(side)
    saveState()
  })
  element.querySelector(".copy").addEventListener("click", () => {
    const other = side === "a" ? "b" : "a"
    const panel = state.panels[side]
    state.panels[other].preset = panel.preset
    state.panels[other].mode = panel.mode
    state.panels[other].drafts[panel.preset] = structuredClone(paletteFor(side))
    resetFieldErrors(other)
    renderPanel(other)
    saveState()
  })
  element.querySelector(".download").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([yamlFor(side)], { type: "text/yaml;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `quartz-colors-${side.toUpperCase()}-${state.panels[side].preset}.yaml`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  })
  const frame = element.querySelector("iframe")
  frame.addEventListener("load", () => connectPreview(side))
  return element
}

function updateLayout() {
  document.querySelector("#board").dataset.layout = state.layout
  for (const side of sides) {
    panelElements[side].querySelector("iframe").style.width =
      state.width === "auto" ? "100%" : `${state.width}px`
    panelElements[side].querySelector(".viewport").scrollLeft = 0
  }
  if (state.layout === "both") requestAnimationFrame(() => syncScroll("a"))
}

async function start() {
  const response = await fetch("/api/context")
  if (!response.ok) throw new Error("无法加载博客配置，请检查本地服务日志。")
  const context = await response.json()
  Object.assign(presets, context.presets)
  if (!presets.current) throw new Error("请重启配色调试服务，以加载仓库中的预设。")
  for (const mode of modes) {
    for (const token of Object.keys(tokens)) {
      if (validColor(context.colors?.[mode]?.[token], token))
        presets.current[mode][token] = context.colors[mode][token]
    }
  }
  storageKey = context.storageKey
  let saved
  try {
    saved = JSON.parse(localStorage.getItem(storageKey))
  } catch {
    /* Start with defaults when browser storage is unavailable or damaged. */
  }
  state = restoreState(saved)
  const content = document.querySelector("#content")
  for (const page of context.pages)
    content.add(new Option(`${page.title} · ${page.slug}`, page.slug))
  if (state.content !== "sample" && !context.pages.some((page) => page.slug === state.content))
    state.content = "sample"
  content.value = state.content
  function contentNote() {
    document.querySelector("#content-hint").textContent =
      state.content === "sample"
        ? "两侧独立调色，向下展开编辑器。亮暗模式各有一套颜色。"
        : "正在比较 public/ 中已有的构建页面；颜色即时生效，正文、字体与公式沿用构建结果。"
    document.querySelector("#preview-note").textContent = context.pages.length
      ? "阅读样张的公式使用 MathML；博客页面沿用已有 Typst / MathJax 和代码样式。重新构建博客后刷新本页可更新文章。"
      : "尚无可用的博客构建。运行 npm run build 后刷新，可选择真实文章；当前样张公式使用 MathML。"
  }
  for (const side of sides) {
    panelElements[side] = buildPanel(side)
    document.querySelector("#board").append(panelElements[side])
    renderPanel(side)
    loadPreview(side)
  }
  document.querySelector("#layout").value = state.layout
  document.querySelector("#width").value = state.width
  document.querySelector("#sync").checked = state.sync
  content.addEventListener("change", () => {
    state.content = content.value
    sides.forEach(loadPreview)
    contentNote()
    saveState()
  })
  document.querySelector("#layout").addEventListener("change", (event) => {
    state.layout = event.target.value
    updateLayout()
    saveState()
  })
  document.querySelector("#width").addEventListener("change", (event) => {
    state.width = event.target.value
    updateLayout()
    saveState()
  })
  document.querySelector("#sync").addEventListener("change", (event) => {
    state.sync = event.target.checked
    syncScroll("a")
    saveState()
  })
  document.querySelector("#swap").addEventListener("click", () => {
    const previous = state.panels.a
    state.panels.a = state.panels.b
    state.panels.b = previous
    sides.forEach(resetFieldErrors)
    sides.forEach(renderPanel)
    saveState()
  })
  contentNote()
  updateLayout()
  saveState()
}

start().catch((error) => {
  document.querySelector("#save-status").textContent = error.message
  document.querySelector("#save-status").style.color = "#a6412c"
})
