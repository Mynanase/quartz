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
modified: 2026-08-19T04:40:35+08:00
updated: 2026-01-16T16:49:16+08:00
---

## 微信聊天数据提取

最近发现了一个项目可以非常轻易的提取微信的聊天记录。它就是
> [!info] [WeFlow](https://github.com/hicccc77/WeFlow)
> WeFlow 是一个**完全本地**的微信**实时**聊天记录查看、分析与导出工具

只需要按照提示登录微信账号，并且自动获取数据库密钥即可。提取之后，WeFlow 本身就可以做简单的分析，但是如果需要更全面的分析，可以使用另一个项目：[ChatLab](https://chatlab.fun/cn/)

这里将所有群聊数据导出为 `.json` 格式用于后续，截至目前为止收集到鱼大人的发言 3.6 万有余，应该足够拿来训练了。

## 微调框架

硬件要求：

| Method                              | Bits | 7B    | 14B   | 30B   | 70B    | `x`B    |
| ----------------------------------- | ---- | ----- | ----- | ----- | ------ | ------- |
| Full (`bf16` or `fp16`)             | 32   | 120GB | 240GB | 600GB | 1200GB | `18x`GB |
| Full (`pure_bf16`)                  | 16   | 60GB  | 120GB | 300GB | 600GB  | `8x`GB  |
| Freeze/LoRA/GaLore/APOLLO/BAdam/OFT | 16   | 16GB  | 32GB  | 64GB  | 160GB  | `2x`GB  |
| QLoRA / QOFT                        | 8    | 10GB  | 20GB  | 40GB  | 80GB   | `x`GB   |
| QLoRA / QOFT                        | 4    | 6GB   | 12GB  | 24GB  | 48GB   | `x/2`GB |
| QLoRA / QOFT                        | 2    | 4GB   | 8GB   | 16GB  | 24GB   | `x/4`GB |

- 服务器上不方便使用 huggaface 转而使用魔塔（ModelScope）



## 机器人框架

现在打算使用 AstrBot 作为机器人的框架。目前能够想到的问题有
- [x] 如何在桌面端写插件？
- [x] 在没有公网 IP 的情况下，如何通过设置代理，获得固定的 IP，这样才能通过 QQ 官方机器人的 IP 白名单检测。
- [ ] 学习一下 AstrBot 人格风格应该怎么定义

## Astrbot 安装和配置

[利用 docker 部署](https://docs.astrbot.app/deploy/astrbot/docker.html)，首先 clone 仓库到本地：
```
git clone https://github.com/AstrBotDevs/AstrBot
cd AstrBot
```

然后，运行 Compose：
```
sudo docker compose up -d
```

### 模型提供商

首先配置模型提供商，分别需要配置以下 6 种：
![[undefinedcontent/img/2026-05-13_03-11-43.png|2026-05-13_03-11-43.png]]

- 对话可以用 Deepseek 和 Siliconflow。由于 Deepseek 没有多模态能力，可以配置一个 Siliconflow 的 `GLM-4.6V`
- STT 和 TTS 使用 [小米的 MIMO](https://platform.xiaomimimo.com/console/balance)
- Embedding 和 Rerank 使用 Siliconflow 的 `Qwen`

### 自定义配置文件

- 在模型部分，可以设置对话模型，图片转述模型，STT 和 TTS 模型
- 自定义一个人格文件
- 设置外接知识库
- 其他的配置等之后再探索

### 配置 QQ bot

需要去 [QQ 开放平台](https://q.qq.com/#/apps) 创建新 APP，提取 appid 和 token。然后去 APP 界面，将服务器 ip 添加至白名单即可。

### 配置 Discord Bot

- 登录 [Discord Developer Portal](https://www.google.com/search?q=https://discord.com/developers/applications&authuser=1)，创建 APP。
- 左侧点击 Bot 页面，重置并获取令牌，并且开启三个选项
  ![[undefinedcontent/img/2026-05-13_03-32-03.png|510]]
- Oauth2 界面，范围选择 Bot。为了简单起见，勾选管理员权限，然后翻到底部，复制 URL。
  ![[undefinedcontent/img/2026-05-13_03-33-47.png|519]]
- 在 AstrBot Bot 配置界面，填写 Discord Bot Token。

如果服务器在国内，机器人无法和 Discord 建立通信。这个时候需要在服务器上部署代理服务。然后在 AstrBot 配置界面填写代理链接。

## 插件

