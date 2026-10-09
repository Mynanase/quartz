# 配色对比调试页

在仓库根目录运行：

```sh
npm run palette
```

打开 <http://127.0.0.1:4175>。端口被占用时可指定另一个端口：

```sh
npm run palette -- --port 4176
```

页面默认比较 A 侧的当前博客配置和 B 侧的定制墨蓝，也提供 Flexoki、Rosé Pine、Catppuccin 的阅读适配方案。每一侧独立选择方案与亮暗模式；可以交换两侧、复制配色、只显示一侧，以及同步滚动。

编辑器覆盖 Quartz 的九个颜色字段，支持拾色器和颜色文本输入。链接底色与 Markdown 标记底色额外提供透明度滑块。不同方案、不同亮暗模式及左右两侧的调整独立保存，切换预设不会丢失已编辑的颜色。「重置此方案」恢复该侧所选方案的亮暗两套预设。

修改自动保存在浏览器的 localStorage 中，按仓库路径区分。下载的 YAML 包含完整的亮暗两套 `colors`。长期保存时直接将文件保存到 [themes/colors/](../../themes/colors/README.md)，参考已有文件补上 `name`、`description`。应用配色时，将该文件的 `colors` 块复制到 `quartz.config.yaml` 的 `configuration.theme.colors`，再运行 `npm run build`。调试服务只读仓库文件，只监听本机地址。

## 阅读内容

- **阅读样张**：中文段落、链接、标记、引用、代码、表格和示例 callout；使用博客字体栈，公式采用浏览器 MathML。
- **博客页面**：从已有 `public/static/contentIndex.json` 列出构建页面，使用真实正文、字体、样式、Typst / MathJax 公式及代码颜色。阅读预览省略页面脚本，所以搜索、图谱、评论等交互不会运行。页面内链接不会导航，以保持两侧比较同一段内容。

没有构建产物时仍可使用阅读样张。需要更新真实页面时运行 `npm run build`，再刷新调试页；当前配色预设会重新读取 YAML，未编辑的当前配色快照会随配置更新，已编辑的草稿继续保留，可用「重置此方案」恢复最新当前配置。

预览宽度可选自适应、720px、390px 手机和 1440px 桌面。固定宽度超过面板时可在预览区域横向滚动；单侧显示更适合检查完整博客布局。

## 对比度

实时显示正文、普通链接、悬停、内部链接、内部链接悬停、标记文字的对比度。半透明底色先与页面背景合成，再计算相对亮度。低于 4.5:1 的组合用橙色标出，供普通文字阅读比较。这些数值不包含元信息透明度、callout 自有语义色或代码语法颜色，也不代表全站无障碍认证。

## 预设来源

- [Flexoki](https://stephango.com/flexoki)：正文 `base-800` / `base-200`，链接 `blue-600` / `blue-400`，悬停 `cyan-700` / `cyan-400`。
- [Rosé Pine](https://rosepinetheme.com/palette/)：Dawn / Moon。Dawn 悬停使用 `text` 代替对比度较低的 `iris`。
- [Catppuccin](https://catppuccin.com/palette/)：Latte / Mocha。Latte 链接蓝从 `#1e66f5` 加深为 `#1a5cdb`。

透明底色为网页阅读适配，定制墨蓝全部为新设计。完整色值与调整说明在 `themes/colors/*.yaml` 中。字体 CSS 直接复用 `local-plugins/web-fonts/font.css`，分片地址读取 YAML 的 `baseUrl`；Latin 字体沿用 Google Fonts，离线时使用系统回退。
