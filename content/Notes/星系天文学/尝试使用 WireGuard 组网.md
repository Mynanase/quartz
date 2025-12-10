---
title: 尝试使用 WireGuard 组网
filename:
tags:
categories:
status:
  - todo
share: true
image:
description:
created: 2025-10-03T16:23:41+08:00
updated: 2025-10-03T23:18:29+08:00
---

为什么使用 WireGuard，主要原因是我的爱快路由器原生支持 WireGuard，那么我也就不折腾了，暂时使用 WireGuard。

## 服务端配置
服务端采用 docker 配置，所有配置存储在配置文件夹 `wg.conf`，通常把它挂在到本地。配置文件主要分为两部分：`interface` 和 `peer`。interface 申明服务端的私钥，网关等信息
```toml
[Interface]
Address = 10.13.13.2
PrivateKey = 6BDGz6JvWrMzBLTYQ0Ov6u9fN1stG3YxF1NuMLuPhmk=
ListenPort = 8097
```
而 peer 申明各个客户端的信息：
```toml
[Peer]
# peer_wg01
PublicKey = QGkqRG+pi88h0DCS8KIg2cd6oixqlFIwSG+W4eUJVRo=
PresharedKey = pf5+a0qGVrPbBawhUANN0P9wCcPSBQUxKEf2JHWZPUA=
AllowedIPs = 10.13.13.2/32, 192.168.9.0/24
PersistentKeepalive = 25

[Peer]
# peer_wg02
PublicKey = SkRBR4P+s/xujG2F1+qm/hiVPW9VmKmELgFvQ4aHsxI=
PresharedKey = b/F+Np9Z9Sm28lGPjbhopcQ1RIIcRQaPl3RhV22h01Q=
AllowedIPs = 10.13.13.3/32, 192.168.9.0/24
PersistentKeepalive = 25
```
