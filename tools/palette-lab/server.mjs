import { createServer } from "node:http"
import { readFile, readdir, stat } from "node:fs/promises"
import { dirname, extname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import serve from "serve-handler"
import { parse } from "yaml"

const toolDirectory = dirname(fileURLToPath(import.meta.url))
const repository = resolve(toolDirectory, "../..")
const publicDirectory = resolve(repository, "public")
const assets = new Map([
  ["/", ["index.html", "text/html"]],
  ["/index.html", ["index.html", "text/html"]],
  ["/app.js", ["app.js", "text/javascript"]],
  ["/preview.js", ["preview.js", "text/javascript"]],
  ["/styles.css", ["styles.css", "text/css"]],
  ["/sample.html", ["sample.html", "text/html"]],
])

async function configuration() {
  return parse(await readFile(resolve(repository, "quartz.config.yaml"), "utf8"))
}

async function previewPresets(colors) {
  const presets = {
    current: {
      name: "当前博客配置",
      description: "读取 quartz.config.yaml 中的当前配色。",
      ...colors,
    },
  }
  const directory = resolve(repository, "themes/colors")
  const aliases = { catppuccin: "cat", "rose-pine": "rose" }
  for (const file of (await readdir(directory)).filter((name) => name.endsWith(".yaml")).sort()) {
    const preset = parse(await readFile(resolve(directory, file), "utf8"))
    const name = file.slice(0, -5)
    presets[aliases[name] ?? name] = {
      name: preset.name,
      description: preset.description,
      ...preset.colors,
    }
  }
  return presets
}

async function pages() {
  try {
    const index = JSON.parse(
      await readFile(resolve(publicDirectory, "static/contentIndex.json"), "utf8"),
    )
    const entries = await Promise.all(
      Object.entries(index).map(async ([slug, note]) => {
        const file = resolve(publicDirectory, `${slug}.html`)
        if (!file.startsWith(`${publicDirectory}/`)) return null
        try {
          const info = await stat(file)
          return info.isFile() ? { slug, title: note.title ?? slug } : null
        } catch {
          return null
        }
      }),
    )
    return entries.filter(Boolean).sort((a, b) => {
      if (a.slug === "index") return -1
      if (b.slug === "index") return 1
      return a.title.localeCompare(b.title, "zh-CN")
    })
  } catch {
    return []
  }
}

function reply(response, type, body, status = 200) {
  response.writeHead(status, {
    "Content-Type": `${type}; charset=utf-8`,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  })
  response.end(body)
}

// Keep the built styles and SVG math; omit page scripts for a stable color comparison.
function readingPreview(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<link\b(?=[^>]*\bas=["']script["'])[^>]*>/gi, "")
    .replace(/<link\b[^>]*>/gi, (link) => {
      // Remote font CSS must not hold the reading preview's first paint.
      if (/rel=["']stylesheet["']/i.test(link) && /href=["']https?:\/\//i.test(link)) {
        return link.replace(/\/?>(\s*)$/, ' media="print">$1')
      }
      return link
    })
    .replace(/<head\b[^>]*>/i, '$&<script src="/preview.js"></script>')
}

export function createPaletteServer() {
  return createServer(async (request, response) => {
    try {
      if (request.method !== "GET" && request.method !== "HEAD") {
        reply(response, "text/plain", "Method not allowed", 405)
        return
      }
      const url = new URL(request.url, "http://127.0.0.1")
      const pathname = decodeURIComponent(url.pathname)
      if (pathname === "/favicon.ico") {
        response.writeHead(204)
        response.end()
        return
      }
      if (pathname === "/api/context") {
        const [config, builtPages] = await Promise.all([configuration(), pages()])
        reply(
          response,
          "application/json",
          JSON.stringify({
            colors: config.configuration.theme.colors,
            presets: await previewPresets(config.configuration.theme.colors),
            pages: builtPages,
            storageKey: `quartz-palette-lab:${repository}`,
          }),
        )
        return
      }
      if (pathname === "/font.css") {
        const config = await configuration()
        const fonts = config.plugins.find((plugin) => plugin.source === "./local-plugins/web-fonts")
        const css = await readFile(resolve(repository, "local-plugins/web-fonts/font.css"), "utf8")
        const baseUrl = fonts?.options?.baseUrl
        if (!baseUrl) throw new Error("Web font baseUrl is missing from quartz.config.yaml")
        reply(
          response,
          "text/css",
          css.replaceAll('url("./', `url("${baseUrl.replace(/\/?$/, "/")}`),
        )
        return
      }
      if (assets.has(pathname)) {
        const [file, type] = assets.get(pathname)
        reply(response, type, await readFile(resolve(toolDirectory, file)))
        return
      }
      if (pathname.startsWith("/preview/")) {
        const relativePath = pathname.slice("/preview/".length)
        if (extname(relativePath) === ".html") {
          const slug = relativePath.slice(0, -5)
          if (!(await pages()).some((page) => page.slug === slug)) {
            reply(
              response,
              "text/plain",
              "Built page not found. Run npm run build to refresh public/.",
              404,
            )
            return
          }
          reply(
            response,
            "text/html",
            readingPreview(await readFile(resolve(publicDirectory, relativePath), "utf8")),
          )
          return
        }
        // serve-handler resolves and validates static paths within public/.
        request.url = request.url.slice("/preview".length)
        await serve(request, response, {
          public: publicDirectory,
          directoryListing: false,
          cleanUrls: false,
          headers: [{ source: "**", headers: [{ key: "Cache-Control", value: "no-store" }] }],
        })
        return
      }
      reply(response, "text/plain", "Not found", 404)
    } catch (error) {
      console.error("[palette]", error.message)
      if (!response.headersSent)
        reply(response, "text/plain", "Could not load preview resources", 500)
      else response.end()
    }
  })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const portArgument = process.argv.indexOf("--port")
  const port = Number(
    portArgument === -1 ? (process.env.PALETTE_PORT ?? 4175) : process.argv[portArgument + 1],
  )
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("Choose a port between 1 and 65535: npm run palette -- --port 4176")
    process.exit(1)
  }
  const server = createPaletteServer()
  server.on("error", (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? `Port ${port} is occupied. Try npm run palette -- --port ${port + 1}.`
        : error.message,
    )
    process.exitCode = 1
  })
  server.listen(port, "127.0.0.1", () => {
    console.log(`配色对比调试页：http://127.0.0.1:${port}`)
    console.log("修改保存在浏览器中；下载 YAML 后可放入 configuration.theme.colors。")
  })
}
