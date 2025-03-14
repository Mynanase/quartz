---
title: 2Fauth-自托管二次验证Web应用
date: 2024-06-03T21:04:14+08:00
tags:
  - github
  - application
  - docker
categories: 
series: 
commets: false
share: true
归档: true
status:
  - 完成
description: 
image: 
date modified: 2024-06-26T10:21:27+08:00
platform:
  - Web
banner: https://obsidian-1317142608.cos.ap-nanjing.myqcloud.com/obsidian/202406032115764.png
banner_y: 0.208
---
> [!summary] [2Fauth](https://2fa.qttao.net)
> 2FAuth 是一种基于网络的自托管替代方案，可替代 Google Authenticator 等一次性密码 (OTP) 生成器，专为移动设备和桌面设备设计。

# Docker-compose 部署
```yml title:docker-compose.yml
version: "3"
services:
  2fauth:
    image: 2fauth/2fauth
    container_name: 2fauth
    volumes:
      - ./2fauth:/2fauth
    ports:
      - 9040:8000/tcp
    environment:
      - APP_NAME=2FAuth
      
      # 你可以将其保留为“local”。如果你将其更改为“production”，大多数控制台命令将要求额外确认。
      # 永远不要将其设置为“testing”。
      - APP_ENV=local
      
	  - APP_DEBUG=false
      
      # 这应该是你的电子邮件地址
      - SITE_OWNER=3547577912@qq.com
      
      # 加密键用于你的数据库和会话。请确保这个非常安全。
      # 如果你生成了一个新的，所有现有的数据必须被视为丢失。
      # 将其更改为一个确切的32个字符的字符串，或使用命令`php artisan key:generate`来生成它
      - APP_KEY=SomeRandomStringOf32CharsExactly
      
      # 这个变量必须与你安装的外部地址匹配，但请记住，
      # 它只在命令行中使用作为回退值。
      - APP_URL=https://2fa.qttao.net
      
      # 如果你想让你的应用程序像演示一样反应，可以将此设置为true。
      # 演示模式每小时重置应用程序内容，并设置一个通用的演示用户。
      - IS_DEMO_APP=false
      
      # 日志通道定义了你的日志条目去哪里。
      # “daily”是默认的日志模式，为你提供在/storage/logs/下的5个日轮换日志文件。
      # 还存在多个其他选项。你可以使用“single”来获取一个很大的错误日志（不推荐）。
      # 还可以使用'syslog'、'errorlog'和'stdout'，它们会记录到系统本身。
      - LOG_CHANNEL=daily
      
      # 日志级别。你可以从最不严重到最严重设置：
      # debug, info, notice, warning, error, critical, alert, emergency
      # 如果设置为debug，你的日志会很快变大。如果设置为emergency，可能
      # 永远不会记录任何东西。
      - LOG_LEVEL=notice
      
      # 数据库配置（只能是sqlite）
      - DB_DATABASE="/srv/database/database.sqlite"
      
      # 如果你正在寻找性能改进，你可以安装memcached。
      - CACHE_DRIVER=file
      - SESSION_DRIVER=file
      
      ## 认证设置
      # 默认的认证守护
      # 支持：
      #   'web-guard' : Laravel内置的auth系统（如果为null则为默认）
      #   'reverse-proxy-guard' : 当2FAuth部署在处理认证的反向代理后面时
      # 警告
      # 使用'reverse-proxy-guard'时，2FAuth只查找专用的头部信息并跳过所有其他内置的
      # 认证检查。这意味着你的代理完全负责认证过程，只要头部信息存在，2FAuth就
      # 会信任它。
      - AUTHENTICATION_GUARD=web-guard
```

> [!warning] 在部署时, 日志报错 `2fauth`  权限不够

这是容器内的某文件, 这时可以修改宿主机上对应目录解决这一问题
```bash
chmod -R 777 /path/to/2fauth
```


