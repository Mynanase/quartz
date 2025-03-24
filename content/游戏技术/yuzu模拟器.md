---
title: yuzu模拟器
filename: 
tags:
  - yuzu
  - switch
categories:
  - 游戏技术
status: 
share: true
image: 
description: 
created: 2024-09-15T19:28:13+00:00
updated: 2025-03-24T12:40:43+08:00
---

## Yuzu 模拟器配置
### User 文件夹
这里储存了你的模拟器设置，存档信息等
```
user
├───cache  
├───config    # 包含了Yuzu模拟器的配置文件，包括图形设置、控制器设置和其他选项
├───dump
├───keys    # 包含了解密任天堂Switch游戏所需的密钥。你需要自己获取这些密钥。
├───load    # mod 数据存放处
│   ├───010038D0133C2000 # 不同游戏ID，每个游戏都是固定的
│   ├───0100F2C0115B6000
│   │   ├───60fpsBlackscreenFix
│   │   ├───60fps_stable_static_totk
│   │   ├───ChuckPatch_FSRDisable+QualityReduceFix+Shadow1024+1008p
│   │   ├───DynamicFPSv1.5.1
│   │   └───VisualFixes_AnisotropicFix_totk
│   └───0100F3400332C000
├───log
├───nand  # 包含了Switch控制台的NAND备份。这是在Yuzu模拟器上运行游戏必需的。
│   ├───system
│   │   ├───Contents
│   │   │   ├───placehld
│   │   │   └───registered
│   │   └───save
│   │       └───8000000000000010
│   │           └───su
│   │               └───avators
│   └───user
│       └───Contents
│           ├───placehld
│           └───registered
│               ├───00000000
│               ├───0000002D
│               ├───00000030
│               └───0000006A
│       └───save
│           ├───0000000000000000
│           │   ├───00000000000000000000000000000000
│           │   │   └───0100152000022000
│           │   ├───692F66FAAD512B74A7B59BA9102A8196
#### 模拟器可以建立用户，这是相应用户的编码进行重排之后得到的，当模拟器选择不同用户，就会调用不同用户存档进行游戏
│           │   │   ├───01007E3006DDA000
│           │   │   └───0100ABF008968000
│           │   └───9CBBF18F53B18438C44DC1BB383A7884
│           │       ├───0100F2C0115B6000 # 相应游戏存档地址
│           │       │   ├───album
│           │       │   ├───picturebook
│           │       │   ├───slot_00
│           │       │   ├───slot_01
│           │       │   ├───slot_02
│           │       │   ├───slot_03
│           │       │   ├───slot_04
│           │       │   ├───slot_05
│           │       │   └───storage
│           │       └───0100F3400332C000
│           └───cache
│               └───0000000000000000
│                   ├───icon
│                   └───storage
├───screenshots  # 截图
├───sdmc
│   ├───atmosphere
│   │   └───contents
│   │       ├───010038D0133C2000
│   │       ├───0100F2C0115B6000
│   │       └───0100F3400332C000
│   └───Nintendo
│       └───Contents
│           ├───placehld
│           └───registered
├───shader  # 着色器
│   └───nvidia
└───tas
```

从上可以看出，许多文件都与游戏 ID 挂钩，之后的操作也都是将补丁，存档等文件复制到相应的编号文件夹下。

### 模拟器界面介绍
- 右键游戏选择进入存档文件夹，mod 文件夹等

![Pasted image 20230528172007|660|660](https://article.biliimg.com/bfs/article/6ffa62b4145c0210af25afa64c11e7e03190a074.png)

- 属性中配置该游戏的局部设定
- 首先会显示游戏的版本，ID，以及右边会显示添加在 Mod 文件下的 mod，勾选即视为打开

![Pasted image 20230528172126|660](https://article.biliimg.com/bfs/article/bfceb2eb3bb646288d32d6cb5eeb2997c8091f10.png)

- 根据自己电脑配置图形，高级图形等设置
- 也可直接进入设置配置全局设置，例如设置手柄映射

![Pasted image 20230528172656|660|660](https://article.biliimg.com/bfs/article/e5c26c5d1706fc3287c3f14d7cbf7c5a23f77cce.png)

### 安装组件
#### 固件安装
将固件 Fireware.zip 解压后放在 
```
user\nand\system\Contents\registered
```

#### Keys 安装

解压 prod.zip 得到 prod.keys 文件，放到
```
user\keys
```

#### 游戏安装
游戏文件主要有两个格式：`.nsp` 和 `.xci`（还有一种 `.nsz`，是一种压缩格式），分别对应数字版和卡带版，没什么区别。
游戏文件分为三类：本体，补丁 (*upd*) 和 DLC。
本体的安装只需要把本体所在路径添加到 yuzu 的游戏路径就可以。
upd 和 DLC 的安装点击 文件 :luc_arrow_big_right: 安装在 nand 进行安装。

![Pasted image 20230528173805|660](https://article.biliimg.com/bfs/article/227aa6ef5f150606fc1efd130e874a5c8b2f8fbb.png)

### 数据转移备份
#### 游戏数据
备份 save 文件夹下相应游戏 ID 的文件夹即可

#### 模拟器配置

### NSCB
之前介绍的先安装游戏，在安装补丁和 dlc 的方式有些繁琐，可以借助工具 **NSCB** 将他们打包为一个文件，直接 yuzu 运行。还可以将压缩格式 `.nsz` 转为可用的 `.nsp`。
利用这个工具可以将本体 + upd + DLC 进行一个整合即可。
#### Nsz 转 nsp
- 首先将零散的 .nsp 文件放在一个文件夹
- 打开 nscb，输入 8 进入解压/压缩模式
- 拖动文件夹到程序窗口
- 输入指令 1 开始处理，输入 3 直接压缩/解压即可
- 导出文件在 NSCB_output 目录下

![nscp|660](https://article.biliimg.com/bfs/article/c9e175271e2b880cf59c00ada6f4ec94ef996711.gif)

#### 打包 nsp
- 将 .nsp 或者 .xci 放在同一个文件夹内
- 输入 2 多文件处理，将文件夹拖入程序窗口
- 输入 1 开始处理
- 输入 1 重新打包为 nsp
- 输入 0 不魔改
- 输入 1 合并为一个文件
- 导出文件在 NSCB_output 目录下

![nscp2 1|660](https://article.biliimg.com/bfs/article/35b67ba26a5451ff71b2857be74926d3bcf448bb.gif)

