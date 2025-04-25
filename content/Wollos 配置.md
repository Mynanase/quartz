---
title: Wollos 配置
filename: 
tags:
  - docker
categories: 
status:
  - done
share: true
image: 
description: 
created: 2025-04-21T05:07:33+08:00
updated: 2025-04-23T19:47:38+08:00
---

> [!info] Wollos 
> Open-Source Personal Subscription Tracker

## 用 Docker 部署

``` yaml
services:
  wallos:
    container_name: wallos
    image: bellamy/wallos:latest
    ports:
      - "8282:80/tcp"
    environment:
      TZ: 'Asia/Shanghai'
    volumes:
      - './db:/var/www/html/db'
      - './logos:/var/www/html/images/uploads/logos'
    restart: unless-stopped
```

## 通知
Wollos 支持非常多种通知形式：

![[./00 Assets/Pasted image 20250421234346.png|496]]

除此之外，Wallos 还支持将订阅信息发布为 iCal 日历，你可以用支持 iCalendar 的软件订阅。

![[./00 Assets/Pasted image 20250421234718.png|462]]

我主要采用 iCal 和 Ntfy 两种通知方式，iCal 通过滴答清单订阅。关于 Ntfy，如果设定授权系统，则需要添加自定义标头，比如通过 Token 登录 [^1]：
```
{"Authorization": "Bearer your-token-here"}
```

[^1]: https://github.com/ellite/Wallos/issues/389#issuecomment-2182851309
