# 博客配置速查

日常设置集中在仓库根目录的 [quartz.config.yaml](quartz.config.yaml)。按组件的 `source` 搜索即可找到对应配置；没有写出来的选项会使用插件默认值，可以在 `enabled` 下补充 `options`。

## 常用设置的位置

| 想调整什么             | 在哪里找                                                | 主要字段                                                             |
| ---------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| 站点名称、语言、域名   | `configuration`                                         | `pageTitle`、`locale`、`baseUrl`                                     |
| 字体与颜色             | `configuration.theme`、`@quartz-community/quartz-fonts` | `typography`、`colors`、混排字体栈                                   |
| 正文字号和行高         | [custom.scss](quartz/styles/custom.scss)                | `.page .center > article`                                            |
| 正文宽度和侧栏间距     | [custom.scss](quartz/styles/custom.scss)                | `.page[data-frame="default"]` 的 `--reading-*` 变量                  |
| 博客栏目导航           | `./local-plugins/blog-navigation`                       | `options.links` 中的 `text`、`slug`                                  |
| 左侧文件树（已停用）   | `@quartz-community/explorer`                            | `enabled`、`folderClickBehavior`、`folderDefaultState`               |
| 最近更新               | `@quartz-community/recent-notes`                        | `limit`、`hideTagPages`、`hideFolderPages`、`showTags`、`linkToMore` |
| 文章目录               | `@quartz-community/table-of-contents`                   | `maxDepth`、`minEntries`、`collapseByDefault`、`options.layout`      |
| 右侧关系图             | `@quartz-community/graph`                               | `localGraph`、`globalGraph`、`layout.priority`                       |
| 日期来源与日期类型     | `@quartz-community/created-modified-date`               | `options.priority`、`defaultDateType`                                |
| 文章日期和预计阅读时间 | `@quartz-community/content-meta`                        | `showReadingTime`                                                    |
| RSS 与站点地图         | `@quartz-community/content-index`                       | `enableRSS`、`rssLimit`、`enableSiteMap`                             |
| 页脚链接               | `@quartz-community/footer`                              | `options.links`                                                      |
| 评论                   | `@quartz-community/comments`                            | 插件 `enabled`、Giscus 仓库配置                                      |
| 页面属性面板           | `@quartz-community/note-properties`                     | `hidePropertiesView`、`includedProperties`                           |
| 栏目名称和介绍         | 各目录的 `index.md`                                     | frontmatter 的 `title`、`description`，以及正文                      |
| 首页入口               | [content/index.md](content/index.md)                    | 正文中的栏目链接和订阅链接                                           |

## 中文字体与 CDN

IBM Plex Sans SC 1.1.0 已通过 `./local-plugins/web-fonts` 接入。400、600、700 三个字重使用 IBM 官方 648 个 `unicode-range` 分片，浏览器只加载页面需要的字符；`font-display: swap` 让正文先使用回退字体显示，本机安装的 IBM Plex Sans SC 仍优先使用。

字体声明与 OFL 许可证在 `local-plugins/web-fonts/`，构建生成一个独立 CSS 文件。WOFF2 位于 ImageKit，日常博客构建不下载、复制或重新上传字体。更换 CDN 时只需修改插件的 `baseUrl`，保持版本目录中的文件名不变：

```yaml
- source: ./local-plugins/web-fonts
  enabled: true
  options:
    baseUrl: https://ik.imagekit.io/eosmos/WebFonts/ibm-plex-sans-sc/1.1.0/
  order: 93
```

正文、标题和界面继续使用 YAML 的 `reading-font-stack`：IBM Plex Sans → IBM Plex Sans SC → PingFang SC → Noto Sans SC → 系统回退。Latin、Noto Sans SC 与等宽字体仍由现有 Google Fonts 配置提供。旧的 Plex SC 本地分片、样式和下载脚本已移出博客仓库，备份在 `../font-cdn/ibm-plex-sans-sc/legacy-quartz/`；完整上传包也保留在该字体项目中。

## 阅读宽度与响应式布局

默认页面的布局在 `quartz/styles/custom.scss` 中设置，Quartz 当前没有对应的 YAML 字段。正文最大 720px，左右侧栏各 280px，网格栏间距 32px，侧栏左右内边距各 24px；侧栏内容与正文的实际留白为 56px。页面左右至少留出 24px，三栏区域为 1344px，包含外侧留白的页面最大宽度为 1392px。

- 窗口宽度 ≥ 1400px：三栏布局。
- 800px < 窗口宽度 < 1400px：左栏加正文，右栏移至正文下方，沿用 Quartz 的平板布局并隐藏目录；页面最大宽度 1080px。
- 窗口宽度 ≤ 800px：单栏布局，正文按窗口收缩，左右各留 24px。

修改 `--reading-width`、`--reading-sidebar-width`、`--reading-column-gap`、`--reading-page-padding` 可调整布局尺寸；三栏断点在该块的媒体查询中设置。规则仅作用于 `default` 页面模板，画布、全宽与 404 页面保留各自布局。标题、正文、评论和页脚共用正文列宽；宽公式在列内横向滚动。

## 组件选项与布局

以博客栏目导航为例（链接顺序就是显示顺序）：

```yaml
- source: ./local-plugins/blog-navigation
  enabled: true
  options:
    links:
      - text: Home
        slug: index
      - text: Posts
        slug: posts/index
      - text: Tags
        slug: tags/index
  layout:
    position: left
    priority: 50
```

当前入口为 Home、Posts、Notes、Life、Tags。界面语言由 `configuration.locale: en-US` 统一控制，搜索、目录、图谱、提示及日期均使用英文；栏目页 `title` 和首页入口也使用相同名称。笔记正文、文章标题与实际标签名保持作者使用的语言。桌面端纵向排列，手机端横向排列并按需换行；进入栏目中的文章时，对应栏目保持高亮。每个栏目只有一个链接，不展开文件树。若要增加 About 或 Publications，先创建对应页面，再在 `links` 中加入其 `text` 和 `slug`。例如 `content/about.md` 对应 `slug: about`；`content/Publications/index.md` 对应 `slug: publications/index`。`slug` 是生成后的 URL 路径，不含 `.md`，Quartz v5 会将路径转成小写。

Explorer 是文件树组件，当前已停用；固定栏目由本地插件提供，入口仍集中在 YAML 配置。

- `enabled`：是否启用插件。
- `options`：组件自身的设置。
- `layout.position`：组件放在哪里，如 `left`、`right`、`beforeBody`、`afterBody`、`footer`。
- `layout.priority`：同一位置的排列顺序，数值越小越靠前。
- `layout.display`：`all`、`desktop-only`、`mobile-only`。
- 插件顶层 `order`：构建处理顺序，不是页面组件排列顺序。

目录组件的 `options.layout: modern` 是目录外观，而插件的 `layout.position: right` 是页面位置，两者不同。

`linkToMore` 接受目标页面 slug 或 `false`，不能设为 `true`。当前为 `all-notes`，Recent Notes 显示最近 4 篇，并在还有其他笔记时显示英文的 `See N more →` 链接，指向 `/all-notes`。`quartz.ts` 中的 `filter` 回调与全量 PageList 共用 `local-plugins/page-list/notes.js` 的 `isListedNote`，确保两处的内容范围和剩余数量一致。筛选回调无法写进 YAML，因此放在配置入口中。

当前目录插件要求标题数量 **大于** `minEntries`；`minEntries: 1` 表示至少两个标题才展示目录。

## 文件夹页与标签页

- **文件夹就是栏目**：在对应目录的 `index.md` 中设置 `title`、`description` 和介绍正文，例如 `content/Posts/index.md`。`folder-page` 自动附加该目录的文章和子栏目列表；当前关闭条目数量提示，保留子栏目，并使用不带「Folder:」的标题。`showSubfolders` 控制子栏目入口，不会把所有层级的文章平铺在一起。
- **标签就是跨栏目的主题**：文章 frontmatter 中的 `tags` 自动生成 `/tags/<标签>` 页面；`categories` 不会自动生成分类页。`数学/几何` 这样的标签还会生成父级主题页面。
- **标签总览**：`content/tags/index.md` 设置 `/tags/` 的名称和介绍。`tag-page.options.numPages: 5` 只限制总览中每个主题的预览数量，单个标签页仍展示完整列表。
- **单个主题介绍**：例如新建 `content/tags/math.md`，用 `title` 和正文介绍该主题；具体文章列表仍自动生成。实际标签必须与文件名对应。

标签页与文件夹页的右栏保留图谱，隐藏文章目录和反向链接；同时隐藏汇总页自身的日期、阅读模式。配置位于 `layout.byPageType.folder/tag.exclude`，npm 插件需使用完整名称，例如 `@quartz-community/content-meta`。图谱优先级为 10，文章目录为 20，避免目录有无改变图谱的位置。手机端沿用 Quartz 的布局，右栏会位于正文下方。

`tag-page.order: 40` 使标签页先于文件夹页加载：两者的页面匹配优先级相同，而 `tags/index` 同时满足两种匹配规则。保留这个顺序，才能使自定义标签总览继续显示标签列表。

学习笔记索引当前还有一段手写的入口列表，来自 `content/Notes/index.md`；它属于介绍正文，下方才是自动生成的列表。自动列表中的子文件夹仍是「日期、标题、标签」三列，但虚拟文件夹条目缺少选中的日期类型，日期为空，标签默认也是空数组，因此看起来只有标题。日期为空的行现在也保留日期列宽度，标题与其他条目对齐。若需要给子栏目设置名称、日期或标签，在子目录创建自己的 `index.md`，填写真实的 `created` / `updated` 和 `tags` 即可；不要为了显示日期而编造元信息。

日期沿用 Quartz 原字号，仅通过 `white-space: nowrap` 保持完整日期单行。列表按文字基线对齐，日期列至少预留 `9em`，并可按内容宽度扩展；标题列仍可换行。

## 标签页可自定义项

当前在 YAML 中通过 `./local-plugins/tag-page` 配置；它复用 `@quartz-community/tag-page` 的生成器与正文组件，仅修正当前安装版本未将 `numPages` / `sort` 传给正文组件的问题。

| 自定义项                           | 配置方式                                                            | 范围与限制                                                          |
| ---------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 每个主题的预览数量                 | `options.numPages`，当前为 `5`                                      | 仅标签总览；单个标签页显示完整列表                                  |
| 自动生成的标题前缀                 | `options.prefixTags`，当前为 `false`                                | 开启后添加本地化的前缀（当前英文界面为 `Tag:`）；自定义页面标题优先 |
| 主题名称与介绍                     | `content/tags/index.md`、`content/tags/<标签>.md` 的 `title` 与正文 | 总览各主题的链接文字仍取实际标签名，`title` 主要控制独立主题页标题  |
| 标签及层级                         | 文章 frontmatter 的 `tags`，如 `数学/几何`                          | 自动生成父级和子级主题页                                            |
| 主题内文章排序                     | `sort` 回调函数，需要 TS override                                   | 默认按所选日期倒序；此选项不改变总览中主题的排列顺序                |
| 侧栏与页面组件                     | `layout.byPageType.tag`                                             | 可排除组件、清空位置、改变页面模板；当前保留图谱                    |
| 列表间距、标签外观、数量提示的显示 | `custom.scss`                                                       | 样式定制；插件没有相应 YAML 开关                                    |

现有标签插件没有提供标签云、卡片视图、标签自定义顺序或筛选栏的 YAML 选项。这类结构或交互调整需要本地组件；仅调整颜色、字号、间距和可见性可以使用 CSS。

```yaml
- source: ./local-plugins/tag-page
  enabled: true
  order: 40
  options:
    numPages: 5
    prefixTags: false
```

## 全站笔记列表（PageList）

`./local-plugins/page-list` 生成 `/all-notes` 页面，标题为 All Notes，通过 Recent Notes 的更多链接进入。页面复用 `@quartz-community/folder-page/components` 导出的 PageList 和栏目列表样式，使用 folder 布局，不显示自身日期、阅读模式或目录。

- 显示日期、标题和标签，按完整的更新时间倒序排列，与 Recent Notes 使用相同的日期排序规则。日期沿用配置的 `defaultDateType: modified`（优先 frontmatter，其次 Git、文件系统）。
- 覆盖所有目录及子目录；排除索引页、标签页、素材、私有与模板目录、草稿、`unlisted` 内容和没有 Markdown 源文件的生成页。
- 不设置 `limit`，显示全部匹配笔记；在手机端沿用现有 PageList 响应式布局，日期保持单行，标题可换行。
- 标题和路径在 `quartz.config.yaml` 中配置；若修改 `slug`，同时更新 Recent Notes 的 `linkToMore`。

```yaml
- source: ./local-plugins/page-list
  enabled: true
  options:
    slug: all-notes
    title: All Notes
```

## 单篇文章的设置

写在 Markdown 开头的 frontmatter 中：

```yaml
---
title: 文章标题
description: 一句话说明文章内容。
tags:
  - 流体力学
created: 2026-01-02
updated: 2026-01-16
enableToc: true
---
```

按需添加：`draft: true` 不发布；`unlisted: true` 发布但不进入导航和索引；`comments: false` 关闭这篇的评论；`quartz-properties: true` 显示这篇的属性面板。

当前 `defaultDateType: modified` 使用修改日期，影响文章日期、最近更新和 RSS 排序。`updated` 是 `modified` 的别名。`status`、`share` 和 `categories` 本身不控制当前发布行为。

## Cloudflare Worker 发布

博客域名 `blog.qttao.site` 绑定的是 Worker `quartz`；同名 Pages 项目是另一套旧服务。仓库根目录的 `wrangler.json` 沿用 `v4` 设置：上传 `./public`，使用 `404-page` 处理不存在的页面，兼容日期为 `2026-10-01`。

在 Worker 的 Settings → Builds 中设置：

| 设置项       | 值                |
| ------------ | ----------------- |
| 仓库         | `Mynanase/quartz` |
| 生产分支     | `v5`              |
| 根目录       | `/`               |
| 构建命令     | `npm run build`   |
| 部署命令     | `npm run deploy`  |
| 构建环境变量 | `NODE_VERSION=24` |

`npm run build` 会先执行现有 `prebuild` 钩子安装配置中的插件，再构建博客内容。`npm run deploy` 使用固定版本 Wrangler 读取仓库配置，发布已有构建产物。设置保存后，可在 Web 端触发或重试生产构建。

本地仅验证部署配置，不上传：

```sh
npm run build
npm run deploy -- --dry-run
```

## 去哪里查完整参数

优先阅读 [docs/plugins/](docs/plugins/) 中对应组件的文档；核对已安装版本时，查 `node_modules/@quartz-community/<插件名>/README.md`。例如 [Explorer README](node_modules/@quartz-community/explorer/README.md) 和 [RecentNotes README](node_modules/@quartz-community/recent-notes/README.md)。

- [全站配置](docs/configuration.md)
- [组件位置与页面布局](docs/layout.md)
- [分组、显示范围和条件](docs/layout-components.md)
- [单篇文章属性](docs/plugins/Frontmatter.md)
- [插件管理命令](docs/cli/plugin.md)

仓库中的文档与已安装插件可能有差异，插件 README、类型声明和实际实现可以用于核对选项。YAML 文件第一行已经关联 schema，支持 YAML 的编辑器可以提供部分补全和校验。

## 终端管理与预览

在项目根目录运行：

```sh
npx quartz tui
```

已安装 TUI 和 Bun，可用终端界面管理设置、插件和布局。当前 TUI 对 npm 形式的插件目录识别不完整，部分插件默认选项可能无法显示；直接编辑 YAML 并查插件 README 最可靠。

查看单个插件当前配置时，本仓库的 npm 插件需要使用完整名称：

```sh
npx quartz plugin config '@quartz-community/explorer'
npx quartz plugin config '@quartz-community/table-of-contents'
```

预览博客与浏览文档分别使用：

```sh
npx quartz build --serve
npm run docs
```

两条命令默认使用同一个端口，分别运行即可。发布前运行 `npm run check`；需要检查核心代码变动时再运行相关测试。
