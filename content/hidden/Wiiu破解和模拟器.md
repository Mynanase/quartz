---
title: Wiiu破解和模拟器
filename:
tags:
  - wiiu
  - 模拟器
categories:
  - 技术
status:
share: true
image:
description:
created: 2024-06-12T14:52:00+00:00
updated: 2026-01-29T02:57:24+08:00
---

## Cemu 模拟器游戏安装配置
### Wiiu 游戏相关的文件介绍
  
![72ge8|300|300x268](https://obsidian-1317142608.cos.ap-nanjing.myqcloud.com/obsidian/72ge8.jpg?imageSlim)
![0agf7|300](https://obsidian-1317142608.cos.ap-nanjing.myqcloud.com/obsidian/0agf7.jpg?imageSlim)
![86t6i|300|300](https://obsidian-1317142608.cos.ap-nanjing.myqcloud.com/obsidian/86t6i.jpg?imageSlim)

### 下载设置
- 模拟器下载地址

[Cemu Emulator](https://cemu.info/)

- .Wup 转 .rpx 工具

[Releases · VitaSmith/cdecrypt (github.com)](https://github.com/VitaSmith/cdecrypt/releases)

### 格式转换
- 安装 cdeceypt
- 将游戏文件夹中的 `*.tik` 拖动至 cdeceypt 程序上即开始转换
- 完成会得到如下格式文件夹

```
- code
- content
- meta
```

### Cemu 的目录结构
根目录
```

```

### 游戏安装
- 安装 Cemu 时自选两个位置作为游戏本体文件夹 `Game` 和数据文件夹 `MLC`. (文件名任意英文)
- 在 Cemu 中安装 rpx 文件，他通常有三个文件夹
```
- code
- content
- meta
```
- 在 `Game` 下新建一个文件夹，这里以风之杖 `The Wind Waker HD` 为例
- 复制以上三个文件夹到 `The Wind Waker HD` 下，此时打开 Cemu 以可以看到游戏
- 找到游戏的编号
- 在 MLC/


#### Rule 文件模板
```
[Definition]
titleIds = 000500001019C800
name = "塞尔达传说"
path = "汉化/塞尔达传说黄昏公主HD简中"
description = 
version = 4
```
文件设置为标题为 rules 的 text 文件，编码为 ANSI.

