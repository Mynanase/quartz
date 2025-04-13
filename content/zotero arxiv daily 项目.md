---
title: zotero arxiv daily 项目
filename: 
tags:
  - ticktick
categories: 
status:
  - todo
share: true
image: 
description: 
created: 2025-04-13T23:36:36+08:00
updated: 2025-04-14T03:52:49+08:00
---


---
> [!info] Zotero-arXiv-Daily
> 一个从 arXiv 上推荐论文的项目，它会读取你的 Zotero 仓库，根据仓库中的内容生成每日的 arXiv 论文推荐，并生成 TL;DR

原项目的部署非常简单，fork [TideDra/zotero-arxiv-daily](https://github.com/TideDra/zotero-arxiv-daily) 整个项目之后，在 `Settings` 界面的如下位置配置环境变量：

![[./00 Assets/Pasted image 20250414033756.png|645]]
其中 `Secrest` 配置私密信息，`Variables` 配置公共信息。
关于 `ZOTERO_KEY` 和 `ZOTERO_ID` 的配置，项目中已经介绍的很详细了，对于邮箱配置，用 outlook 邮箱失败了，因此改用 gmail，当然项目中推荐使用的 qq 邮箱也可以。
稍微麻烦一些的是 `SENDER_PASSWORD`，这在邮箱服务中通常是指 `app password`，对于 gmail 的密码获取可以参考这一篇教程 [Gmail SMTP Settings](https://www.gmass.co/blog/gmail-smtp/)
```plain 
# gmail config

SMTP_SERVER: smtp.gmail.com
SMTP_PORT: 465
SENDER: xxxxxx@gmail.com
SENDER_PASSWORD: xxxxxx
```
其余配置按照项目说明进行设置。随后开启 Actions，运行 `Test workflow`，随着程序的运行，你的接受邮箱很快会收到一副测试邮件，里面有 5 篇文章。

## 功能改进
当我稍微了解了项目之后，我发现有许多细节实现不好，加上整个项目非常轻量级，于是我就有了利用 AI IDE 动手修改的想法。我的初步想要的功能如下
- [x] zotero arxiv daily 插件  [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67fa5117191a110c34a7107d) #ticktick  %%[ticktick_id:: 67fa5117191a110c34a7107d]%% ✅ 2025-04-14 📅 2025-04-13
	- [x] 新增 RSS Feed 功能  [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67fabdd6c99ed10c34a719d9) #ticktick  %%[ticktick_id:: 67fabdd6c99ed10c34a719d9]%% ✅ 2025-04-14 📅 2025-04-13
	- [x] 新增多个 RECIVER  [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67fabdf1ce97110c34a71aac) #ticktick  %%[ticktick_id:: 67fabdf1ce97110c34a71aac]%% ✅ 2025-04-14 📅 2025-04-13
	- [x] 新增中文标题功能  [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67fbdd5cf6a3f3a89c92a122) #ticktick  %%[ticktick_id:: 67fbdd5cf6a3f3a89c92a122]%% ✅ 2025-04-14

首先是中文标题，既然项目利用 LLM 生成了中文的 TL;DR，那么在利用它翻译一下标题也无可厚非，并且这能极大的增加条目查看速度。

项目貌似只支持单一的接受者，于是我增加了多个接受者的解析，通过 `RECIVER` 环境变量引入，多个邮箱通过逗号分隔

最后是 RSS 功能。我本就是通过 Zotero 社区才得以了解到这个项目，使用了之后才发现，整个项目主要利用 Zotero 论文库的数据用于推荐论文，然后推荐的论文通过 Email 发出，你必须每天打开邮箱，找到感兴趣的内容之后，打开 pdf，在导入至 Zotero，因为貌似 Email 不能直接和 Zotero 交互。Email 不行，但是有一个东西正好合适---RSS。在此之前，我就在 Zotero 订阅了 arXiv 官方的 Rss Feed，而 Zotero 可以一键添加论文到库中。于是我的目的十分简单：保留原来的邮箱功能，但同时生成一个结构和 arXiv 官方相似的 index.xml，最后通过 Github pages 发布，通过 Zotero 订阅。

其余的一些小改动：
- 把一些没那么隐私的参数由 `Secrets` 更改为 `Variables`
- 修改了测试使用的 `ARXIV_QUERY`；减少了测试渲染的文章数