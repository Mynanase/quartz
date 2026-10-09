# 配色备份

当前使用 [墨蓝](ink.yaml)。[Catppuccin](catppuccin.yaml) 和 [原 Quartz 配色](quartz.yaml) 也保留在这里，均包含亮色、暗色两套颜色。

切换时，把所选文件的 `colors` 块复制到 `quartz.config.yaml` 的 `configuration.theme.colors`，调整缩进后运行 `npm run build`。字体与布局继续使用原配置。

调试页会读取这些文件。以后调出新方案，直接将下载的 YAML 保存在此目录，并参考已有文件补上 `name`、`description` 即可。将这些普通配置文件随仓库提交、推送，就能长期备份。

Catppuccin 保存的是调试页中的 Latte / Mocha 阅读适配版；代码语法颜色、callout 语义色仍由原插件控制。
