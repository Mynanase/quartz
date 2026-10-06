---
title: goldendict 使用
filename:
tags:
categories:
status:
share: true
image:
description:
created: 2024-10-14T06:55:22+08:00
updated: 2025-03-24T22:31:48+08:00
---

## Goldendict 使用

### 导入词典

首先通过 `编辑` → `词典` 进入词典配置界面。

在 `词典来源` → `文件` 添加词典的路径。之后你可以去 `词典` 条目查看、排序和禁用词典。如果词典数目过多，可以设置 `Group` 应对不同的使用场景。

![](undefinedcontent/img/goldendict%20%E4%BD%BF%E7%94%A8_PixPin_2024.webp)

### 导入语音

和上述步骤类似，解压下载的声音文件，并将目录添加至 `词典来源` -> `音频文件目录`。

![](undefinedcontent/img/goldendict%20%E4%BD%BF%E7%94%A8_202407211843.png)

### 语法检查

下载 Hunspell 字典，在构词法规则库中，添加 `.aff` 和 `.dic` 所在路径。如果有多种语言，可以将它们的 `.aff` 和 `.dic` 文件放在统一目录，然后统一添加目录。
