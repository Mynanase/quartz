---
title: 修复obsidisn表格光标消失
filename: 
tags: 
categories: 
status:
  - done
share: true
image: 
description: 
created: 2025-03-31T22:42:26+08:00
updated: 2025-04-03T07:22:59+08:00
---

原来一直使用 obsidian 的 [obsidian-banners](https://github.com/noatpad/obsidian-banners) 插件，然而今天发现了它存在的严重问题：会使得表格中的光标消失 [^1]，像这样
![[./00 Assets/PixPin_2025-03-31_22-48-27.webp|463]]

好在 banner 的功能十分简单，很容易找到替代，比如可以通过添加 css snippets[^2] 解决。除此之外，它还支持页首的 icon，非常适合放在主页。

## 使用方法
首先需要在 yaml 区添加
```yaml
cssclasses: obsidian-banner obsidian-icon
```
添加普通的 banner 图片：
```plain
![[xxx.png|banner]] OR ![banner](xxx.png)
```
banner 默认横向会填充，因此一般图片比例下，纵向无法完全展示，该 css 提供有一个 banner 参数，用于调节居中点的垂直坐标，默认是 `![[xxx.png|banner50%]]`，也就是垂直居中

![[./00 Assets/Pasted image 20250331231514.png|589]]
添加 icon
```yaml 
![[xxx.png|icon]] OR ![icon](xxx.png)
```
添加 profile、circle、round 同理
## 效果展示
![[./00 Assets/Pasted image 20250401001602.png|528]]


[^1]: https://forum.obsidian.md/t/tables-no-cursor-when-selecting-a-cell/76839/2
[^2]: https://forum.obsidian.md/t/banner-images-icons-experimental-more-image-options-css-snippet/53738/16

