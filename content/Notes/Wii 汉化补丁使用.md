---
title: Wii 汉化补丁使用
filename:
tags:
  - game
categories:
  - Posts
status:
share: true
image:
description:
created: 2024-09-16T23:40:04+08:00
updated: 2025-03-24T22:57:39+08:00
---

## Wii 汉化补丁使用

汉化资源可以在老男人网下载。该汉化是「英伟达神盾移植版本」，使用的是韩版的 Rom。补丁支持 `Riivolution`，但该功能需要较新的模拟器支持（Dolphin 5.0-15407），解决办法是手动打补丁。

### Riivolution Mods

补丁包含两个文件夹：

配置文件：`riivolution` 

```plain
riivolution
├── TPNvidia-RZDK.xml
└── config
    └── RZDK.xml
```

补丁本体：`TPNvidia-RZDK`。

```plain
TPNvidia-RZDK
└── files
    ├── opening.bnr
    └── res
        ├── Fontkr
        ├── HomeBtn
        ├── LayoutRevo
        ├── Msgkr
        └── Object
```

将两个文件夹复制到 `Path\to\Dolphin\User\Load\Riivolution` 即可。

```plain
Riivolution
├── TPNvidia-RZDK
│   └── files
│       ├── opening.bnr
│       └── res
└── riivolution
    ├── TPNvidia-RZDK.xml
    └── config
        └── RZDK.xml
```

打开 Dolphin，可在 `游戏→右键→启用时附带 Riivolution 补丁` 动态开启补丁。

![](../00%20Assets/Wii%20%E6%B1%89%E5%8C%96%E8%A1%A5%E4%B8%81%E4%BD%BF%E7%94%A8_Clip_2024-09-17.webp)

### 手动打补丁

需要使用到 [WIT: Wiimms ISO Tools](https://wit.wiimm.de/)。

首先需要从常见的 Wii 游戏文件（`.wbfs` 和 `.iso`）中提取出电脑可读的文件「FST」。

```plain
wit extract game.wbfs game_extracted
wit extract game.iso game_extracted
```

我们注意到 `game_extracted` 下存在一个 `files` 文件夹：

```plain
game_extracted 62.97 MiB ]
├─ files                  │ ██████████████████████████████████████████│  97%     61.17 MiB
├─ sys                    │                                           │   2%      1.71 MiB
├─ h3.bin                 │                                           │   0%     96.00 KiB
├─ cert.bin               │                                           │   0%      2.50 KiB
├─ ticket.bin             │                                           │   0%         676 B
├─ tmd.bin                │                                           │   0%         520 B
├─ align-files.txt        │                                           │   0%         423 B
├─ disc                   │                                           │   0%         328 B
├─ setup.txt              │                                           │   0%         222 B
├─ setup.bat              │                                           │   0%         113 B
└─ setup.sh
```

因此次需要将补丁文件下的 `files` 文件复制到该 `files` 即可。

最后通过万能命令 `wit copy` 将「」转换为可使用的 `.wbfs` 或 `.iso`。

```plain
wit copy game_extracted game_patched.wbfs -o
wit copy game_extracted game_patched.iso -o
```