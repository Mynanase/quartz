---
title: hugo 博客搭建
filename:
tags:
  - "#hugo"
  - "#obsidian"
  - "#yaml"
  - ticktick
  - hugo
  - obsidian
  - yaml
categories:
status:
share: true
image:
description:
created: 2026-04-24T03:26:35+08:00
modified: 2026-05-11T03:32:14+08:00
updated: 2025-06-12T20:18:03+08:00
states:
---

**更新计划**

- [ ] 评论系统 [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67ea7d1db798ec59006ee8ee) #ticktick %%[ticktick_id:: 67ea7d1db798ec59006ee8ee]%%
- [ ] 修改样式 [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67ea7d1cb798ec59006ee8e2) #ticktick %%[ticktick_id:: 67ea7d1cb798ec59006ee8e2]%%
- [ ] 添加相册边栏 [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67ea7d1cb798ec59006ee8dc) #ticktick %%[ticktick_id:: 67ea7d1cb798ec59006ee8dc]%%
- [ ] 去除主页 [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67ea7c4db798ec59006ee61a) #ticktick %%[ticktick_id:: 67ea7c4db798ec59006ee61a]%%
- [ ] 添加系列边栏 [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67ea7b3ab798ec59006ee51e) #ticktick %%[ticktick_id:: 67ea7b3ab798ec59006ee51e]%%
- [ ] 音乐收藏 [link](https://dida365.com/webapp/#p/inbox1024498369/tasks/67ea7b35b798ec59006ee4d0) #ticktick %%[ticktick_id:: 67ea7b35b798ec59006ee4d0]%%

## Stack 主题文档

### Frontmatter configs

#### Discription

- type: `string`
- 对文章的描述

#### Image

#### Commets

- Type: `bool`

#### License

- Type: `string|bool`
- 一般情况下 `False` 隐藏就好

#### Math

- Type: `bool`
- 使用 KaTeX 进行渲染

#### Toc

- Type: `bool`
- 确保该页面至少有一个一级标题

#### Readingtime

- Type: `bool`

### Shortcodes

首先, shortcodes 是 hugo 设计的一种文本语法, hugo 会渲染相应内容成网页内容.
而 stack 主题就预先设计了一些语法.

#### Bilibili video

```md
{{/*<  bilibili VIDEO_ID PART_NUMBER >*/}}
```

#### Tencent video

```
{{/*<  tencent VIDEO_ID  >*/}}
```

#### YouTube video

```
{{/*< youtube VIDEO_ID >*/}}
```

#### Video file

```
{{/*< video VIDEO_URL >*/}}
{{/*< video src="VIDEO_URL" autoplay="true" poster="./video-poster.png" >*/}}
```

这里的 `VIDEO_ID` 可以是相对路径和绝对路径.

#### GitLab

```c
{{/* < gitlab SNIPPET_ID > */}}
```

#### Quote

```markdown
{{/*< quote author="A famous person" source="The book they wrote" url="https://en.wikipedia.org/wiki/Book" >*/}}
content
{{/*< /quote >*/}}
```

### Widgets

利用 widgets 可以实现一些特殊的界面.

#### Archives

- 使用 `layout: archives` 即可创建一个按照年份排列的清单页面.
- 使用参数 `limits` 控制展示年份的数目.

#### Search

- `layout: search`

#### Categories

- 展示类别
- `limits` 设置最大展示数目.

#### Toc

#### Tag-cloud

- `limits` 设置最大展示数目.

### 文件结构

利用组件则可以自定义界面以及内容管理了.
page 文件夹. 像主页, 关于等组件, [[它们本事就是由|它们本事就是由]] `.md` 形成的页面, 由于在 yaml 区添加了 `layout` 指令使它们同时能够作为组件存在.
![image.png|300](https://obsidian-1317142608.cos.ap-nanjing.myqcloud.com/obsidian/20240402205534.png?imageSlim)

#### 发布设置

待发布的文件放在 `./content/post` 下
官网推荐每个 `.md` 和相关附件绑定在一起发布, 不过我已经准备了 [[obsidian 图床|图床]], 就没有必要了.
直接将所有文件存在该目录下.
现在编辑文件的 `yaml`.

```yaml
title: '001'
description:
date: 2024-04-01T12:52:10+08:00
image:
math: true        # 默认 true
license: false    # 默认 false
categories:
  - category1
  - category2
tags:
  - tag1
  - tag2
comments: true
draft: false       # 默认 false
```

综上, 结合 obsidian 的基本配置, yaml 区基本模板为

```yaml
title:
date:
image:
tags:
categories:
commets:
description:
share:
```

5: 243 194 217
57: 222 105 76
75: 216 8 53
96: 197 154 197
118: 184 189 204
132: 40 116 175
148: 25 33 89
166: 252 222 95
211: 228 200 99
253: 28 141 108
230: 70 140 55
292: 137 93 49
317: 166 171 182
351: 241 242 229

## 改样式
