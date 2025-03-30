---
title: 配置 bitwarden(vaultwarden) 的一些坑
filename: 
tags:
  - docker
categories: 
status:
  - archived
share: true
image: 
description: 
created: 2025-03-27T01:23:46+08:00
updated: 2025-03-29T23:36:07+08:00
---

## 服务端
使用 docker 配置，docker-compose 文件如下：
```yaml
services:
  vaultwarden:
    container_name: vaultwarden
    image: vaultwarden/server:latest
    restart: unless-stopped
    volumes:
      - ./data/:/data/
    ports:
      - 14680:80
    environment:
      - DOMAIN=https://xxx.xxx.xxx # 这是您希望与您的Vaultwarden实例关联的域名。
      - LOGIN_RATELIMIT_MAX_BURST=10 # 允许在一阵登录/两步验证尝试中的最大请求次数。
      - LOGIN_RATELIMIT_SECONDS=60 # 这是来自同一IP的登录请求之间的平均秒数，在Vaultwarden限制登录次数之前。
      - ADMIN_RATELIMIT_MAX_BURST=10 # 这与LOGIN_RATELIMIT_MAX_BURST相同，只争对admin面板。
      - ADMIN_RATELIMIT_SECONDS=60 # 这与LOGIN_RATELIMIT_SECONDS相同
      - ADMIN_SESSION_LIFETIME=20 # 会话持续时间
      - ADMIN_TOKEN="key" # 此值是Vaultwarden管理员面板的令牌（一种密码）。为了安全起见，这应该是一个长的随机字符串。如果未设置此值，则管理员面板将被禁用。建议openssl rand -base64 48 生成ADMIN_TOKEN确保安全
      - SENDS_ALLOWED=true  # 此设置决定是否允许用户创建Bitwarden发送 - 一种凭证共享形式。
      - EMERGENCY_ACCESS_ALLOWED=true # 此设置控制用户是否可以启用紧急访问其账户的权限。例如，这样做可以在用户去世后，配偶可以访问密码库以获取账户凭证。可能的值：true / false。
      - WEB_VAULT_ENABLED=true # 此设置决定了网络保险库是否可访问。一旦您配置了您的账户和客户端，停止您的容器，然后将此值切换为false并重启Vaultwarden，可以用来防止未授权访问。可能的值：true/false。
      - SIGNUPS_ALLOWED=true # 此设置控制新用户是否可以在没有邀请的情况下注册账户。可能的值：true / false。
	  - EXPERIMENTAL_CLIENT_FEATURE_FLAGS=ssh-key-vault-item,ssh-agent # 实验特性，开启 ssh 支持
```
如何需要 vaultwarden 支持保存 ssh 类似的密钥以及 ssh-agent，需要在 `docker-compose.yml` 中声明。

## 桌面应用配置
Macos 端的 vaultwarden 配置非常抽象。当你选择从第三方安装软件时，他不能支持在浏览器上 biometrics 解锁，也就是指纹解锁；而当你选择从 app store 安装软件时，他无法支持实验功能（ssh 相关）。

好在这些都有解决方案，对于第三方安装的软件，可以通过添加环境变量
```plain
ALLOW_BROWSER_INTEGRATION_OVERRIDE=true
```
以增强浏览器集成。但是这又遇到一个问题 ------ 只在终端运行的时候生效，如何直接从应用启动无法继承环境变量。
为了让应用通过 launchctl 继承环境变量，可以在 `~/Library/LaunchAgents/` 下创建 `.plist` 文件，内容如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.user.env.vars</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/launchctl</string>
        <string>setenv</string>
        <string>ALLOW_BROWSER_INTEGRATION_OVERRIDE</string>
        <string>true</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>

```