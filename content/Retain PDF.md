---
title: Retain PDF
filename:
tags:
  - github
  - pdf
  - ocr
  - app
categories:
  - Notes
status:
share: true
description:
created: 2026-05-07T03:27:44+08:00
modified: 2026-05-11T04:00:02+08:00
---

官方网站上对 [Retain PDF](https://github.com/wxyhgk/retain-pdf) 的定义是一款 **PDF 保留排版翻译工具**。在我的体验下来，它的表现在同类工具中非常优秀：
- 项目整体完整，只需要配置 OCR 和 LLM 的 Provider 和 Key，再经过简单设置即可完整使用。
- 对于开发者，项目各个部分是解耦的，非常方便接入自己的工作流。
- 在保留排版翻译领域，效果非常好，可以硬刚市面上常见模型。

![[./assets/2026-05-07_04-05-55.png|615]]

![[./assets/Pasted image 20260507043700.png|Pasted image 20260507043700.png]]

## 项目的整体流程

进入项目，最开始需要配置 OCR 和翻译的 Provider，其中 OCR 可以配置百度的 [PaddleOCR](https://aistudio.baidu.com/overview) 和开源的 MinerU，翻译服务可以配置 DeepSeek。（当前版本 `v4.12`）

整体流程：
1. 用户上传 PDF 之后，项目利用 OCR 服务将整个 PDF 转换为 markdown
2. 分批次传送给大模型翻译。
3. 将翻译结果嵌入到原 PDF。

## 项目存在的问题

由于翻译前后，文本的长短不一致，中文往往更短。在选中 PDF 内容时，视觉上文字的区域，与嵌入的可复制层不太一致，导致复制的体验不好。

据作者描述，是为了数学公式显示的兼容性，暂时保留了原来的文字层。

![[./assets/2026-05-07_04-12-35.png|605]]

**书签在翻译之后消失**
