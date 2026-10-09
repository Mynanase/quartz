# 配色备份

当前使用 [墨蓝提亮版](ink-bright.yaml)，暗色正文为 `#E3E3E3`；[墨蓝原版](ink.yaml) 也保留，暗色正文为 `#CDD3DA`。两版亮色相同，暗色颜色独立保存，共享现有布局与阅读样式。[Catppuccin](catppuccin.yaml) 和 [原 Quartz 配色](quartz.yaml) 同样保留。

Ink 提亮版的暗色正文与公式为 `#E3E3E3`，标题为 `#F0F2F4`，链接 / 悬停为 `#9EC4E0` / `#A2D4C6`；背景 `#191C21` 和边框 `#343B45` 保持不变。文章日期使用正文与背景的 85% 混合色，暗色选区使用悬停色的 24% 强度，保持浅色文字清晰。这两处阅读样式位于 `quartz/styles/custom.scss`，亮色沿用原配置。

切换时，把所选文件的 `colors` 块复制到 `quartz.config.yaml` 的 `configuration.theme.colors`，调整缩进后运行 `npm run build`。字体与布局继续使用原配置。

调试页会读取这些文件。以后调出新方案，直接将下载的 YAML 保存在此目录，并参考已有文件补上 `name`、`description` 即可。将这些普通配置文件随仓库提交、推送，就能长期备份。

Catppuccin 保存的是调试页中的 Latte / Mocha 阅读适配版；代码语法颜色、callout 语义色仍由原插件控制。

另有基于用户提供测量色值的 [Gemini 深灰方案](gemini.yaml) 和 [纯黑对照](gemini-black.yaml)。两者正文均为 `#E3E3E3`，背景分别为 `#131314` / `#000000`，正文对比度为 14.47:1 / 16.36:1；纯黑版仅改变背景，便于比较。亮色沿用 Ink。Quartz 的边框与代码底色共享 `lightgray`，这里采用 `#282A2C`，其余表面层级与次要文字角色沿用现有组件样式。

两套 Gemini 方案已在现有调试页中测试真实中文文章、18px 正文、Typst 公式、六组文字对比度、YAML 导出及 390px 手机布局。它们是阅读适配方案；阅读舒适度仍需实际试读判断。
