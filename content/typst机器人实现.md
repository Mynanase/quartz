---
title: typst机器人实现
filename: 
tags:
  - bot
  - typst
  - python
  - 计算机技术
categories: 
status:
  - 完成
share: true
image: 
description: 
created: 2024-09-30T06:20:05+00:00
updated: 2025-03-08T17:20:46
---

使用到的技术主要是 `NapCat` 和 `NoneBot`.
# 配置 NapCat
## For Window
- 安装 NapCat 和相应版本的 NTQQ
- 运行脚本文件并扫码登录
```bash
.\napcat-utf8.ps1
## 或者
.\napcat-utf8.bat
```
这时会在 `\config` 下生成 `onebot<qq-id>.json` 
- 修改配置文件, 对于配置 typst 机器人, 只需要开始反向 ws 即可. 

```json title:onebot<qq-id>.json hl:18-23,30
{  
  "http": {  
    "enable": true,  
    "host": "127.0.0.1",  
    "port": 3095,  
    "secret": "qttao123",  
    "enableHeart": false,  
    "enablePost": false,  
    "postUrls": [  
      "http://127.0.0.1:3070/onebot/v11/http"  
    ]  
  },  
  "ws": {  
    "enable": true,  
    "host": "",  
    "port": 3085  
  },  
  "reverseWs": {  
    "enable": true,  
    "urls": [  
      "ws://127.0.0.1:10080/onebot/v11/ws"  
    ]  
  },  
  "debug": false,  
  "heartInterval": 30000,  
  "messagePostFormat": "array",  
  "enableLocalFile2Url": true,  
  "musicSignUrl": "",  
  "reportSelfMessage": false,  
  "token": "qttao123",  
  "GroupLocalTime": {  
    "Record": false,  
    "RecordList": []  
  }  
}
```

注意 `reverseWs` 的 `urls` 需要与 `nonebot` 的接口保持一致.
记得设置一个 `token`.
- 重启, 扫码登录, 这时会显示 `reverseWs` 失败, 这是正常的.

可以试着发送消息, 正常情况下, 终端会显示收到的信息.
# 配置 NoneBot
在 python 虚拟环境中安装, 需要版本大于 3.9.
## 安装 nb
创建虚拟环境
```bash
conda create -n nonebot python==3.10
```
安装 `pipx`
```python
python -m pip install --user pipx  
```
```
python -m pipx ensurepath
```
安装脚手架
```python
pipx install nb-cli 
```

## 使用 nb
直接输出 nb, 后可根据提示创建项目
```bash
nb
```
创建项目
```bash
nb create 
```
安装插件
```bash
## nb-cli 
nb plugin install <插件名称>

## 交互式安装
nb plugin install
[?] 想要安装的插件名称: <插件名称>

## pip 
pip install <插件名称>
```


## 配置 nb
用 nb 生成一个项目
修改 `.env` 文件如下
```
ENVIRONMENT=prod  
DRIVER=~fastapi
```
修改 `.env.prod` 文件如下
```
HOST=127.0.0.1  
PORT=10080  
ONEBOT_ACCESS_TOKEN=qttao123
```
这里的 `HOST` 和 `PORT` 应与 napcat 中 反向 `ws` 一致
`ONEBOT_ACCESS_TOKEN` 与 `token` 一致

# 编写 typst 机器人
思路其实很简单
1. napcat 用于与 qq 通信
2. nonebot 插件接收的信息后, 提取其中的 typst 脚本
3. 用 python 的 typst 库渲染为 png 
4. 发送回 qq

用 nonebot 创建项目时选择 `src` 模式
在 `/src/plugins/` 创建插件文件
```python title:typst.py
import nonebot
from nonebot import on_message
from nonebot.adapters.onebot.v11 import Bot, MessageEvent, MessageSegment
from nonebot.typing import T_State
import base64
import asyncio
import tempfile
import os
from pathlib import Path
import typst

typst_renderer = on_message(priority=5)

async def compile_typst(input_file: Path, output_file: Path) -> None:
    await asyncio.to_thread(
        typst.compile,
        str(input_file),
        str(output_file),
        format="png",
        ppi=300  # 调整为更合理的 PPI
    )

async def send_image(bot: Bot, event: MessageEvent, image_path: Path) -> None:
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    await bot.send(event, MessageSegment.image(file=f"base64://{encoded_string}"))

@typst_renderer.handle()
async def handle_typst(bot: Bot, event: MessageEvent, state: T_State):
    msg = event.get_plaintext().encode('utf-8', errors='ignore').decode('utf-8')
  
    if not msg.startswith("typ "):
        return

    code = msg[4:].strip()
    wrapped_code = f"""
        #import "@preview/physica:0.9.3": *
        #set page(
        width: auto,
        height: auto,
        margin: (x: 4pt, y: 8pt)
        )            
  
        {code}
        """
        
    with tempfile.TemporaryDirectory() as tmpdir:
        input_file = Path(tmpdir) / "input.typ"
        output_file = Path(tmpdir) / "output.png"
        input_file.write_text(wrapped_code, encoding='utf-8')
  
        try:
            await asyncio.wait_for(compile_typst(input_file, output_file), timeout=30)  # 30秒超时
            if not output_file.exists():
                raise FileNotFoundError(f"Output file not found: {output_file}")
            await send_image(bot, event, output_file)
        except asyncio.TimeoutError:
            await bot.send(event, "渲染超时，请尝试简化你的代码。")
        except FileNotFoundError as e:
            await bot.send(event, f"渲染失败: {str(e)}")
        except Exception as e:
            await bot.send(event, f"发生错误: {str(e)}")
            
nonebot.load_plugin(__name__)

```

1. `wrapped_code` 中补充的一段是为了匹配图片宽度, 否则默认渲染为一整个 pdf 界面
2. 注意设置 `ppi` 调整图片清晰度
3. 在该的虚拟环境中安装 typst 方法: 

首先注意到, 先用 conda 创建了一虚拟环境, 在虚拟环境下安装了 `nb`, `nb` 创建项目时, 项目文件中又会有一虚拟环境, 该虚拟环境没有 `pip`, 那么需要用 `nb` 所在虚拟环境的 `pip` 来进行安装: 
```bash
## 之前安装的环境 conda create -n nonebot python==3.10
conda activate nonebot
pip install typst --target==\path\.venv\Lib\site-packages
```


