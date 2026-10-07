---
title: 鱼 bot 开发日志
filename:
tags:
  - shao
categories:
  - Notes
status:
  - todo
share: true
image:
description:
created: 2025-12-10T15:22:42+08:00
updated: 2026-01-16T04:04:00+08:00
---

## 微信聊天数据提取

最近发现了一个项目可以非常轻易的提取微信的聊天记录。它就是
> [!info] [WeFlow](https://github.com/hicccc77/WeFlow)
> WeFlow 是一个**完全本地**的微信**实时**聊天记录查看、分析与导出工具

只需要按照提示登录微信账号，并且自动获取数据库密钥即可。提取之后，WeFlow 本身就可以做简单的分析，但是如果需要更全面的分析，可以使用另一个项目：[ChatLab](https://chatlab.fun/cn/)

这里将所有群聊数据导出为 `.json` 格式用于后续，截至目前为止收集到鱼大人的发言 3.6 万有余，应该足够拿来训练了。

## 微调框架

