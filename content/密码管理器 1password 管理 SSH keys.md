---
title: 密码管理器 1password 管理 SSH keys
filename: 
tags: 
categories: 
status:
  - todo
share: true
image: 
description: 
created: 2025-03-28T15:00:41+08:00
updated: 2025-03-28T16:18:24+08:00
---

首先，1Password 支持保存 ssh key，配置 1Password 的 SSH agent，可以实现通过 1Password 
1. 进行 ssh 登录服务器
2. 验证 git 仓库
3. Sign git commits

## 配置 ssh agent
首先自然是在 1Password 启动 `SSH Agent` 选项，下一步需要修改配置文件，方法有很多种，具体可以查看 1Password 的文档。这里以 macos 为例：

将下列字段添加到 `~/.ssh/config` 中
```yaml
Host *
  IdentityAgent "~/Library/Group Containers/2BUA8C4S2C.com.1password/t/agent.sock"
```
你也可以通过设置 `SSH_AUTH_SOCK` 环境变量实现同样的效果：
```sh
export SSH_AUTH_SOCK=~/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock
```
对于 Nix 添加
```json
sessionVariables = {
	SSH_AUTH_SOCK = "/Users/${username}/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock";
};
```

## 配置 ssh 登录
修改 `~/.ssh/config`，为每一个 ip 添加以下内容，
```yaml
Host hostname
  Port port 
  User username
  HostName ip
```
设置 `hostname` 用于快捷登录。之后使用 `ssh hostname` 直接登录，效果等效于
```sh
ssh username@ip:port 
```
不必指定 `IdentityFile`，系统会自动通过 1Password 上传密钥。
对于不希望使用代理的登录，可以设置 `IdentityAgent none` 然后配置本地密钥。
```
Host ec2-server
  HostName 54.123.45.67
  User ec2-user
  IdentityFile ~/.ssh/ssh-key-not-on-1password.pem
  IdentityAgent none
```

## 配置 git ssh
git 的 ssh 配置稍有不同，由于国内的网络环境，如果直接使用
```yaml
Host github.com
  Port 22
  HostName github.com
```
会连接不上。替代的做法是使用
```
Host github.com
  Port 443
  HostName ssh.github.com
```
然后
## 配置 git sign commit
首先需要修改 git 配置
1. Set `gpg.format` to `ssh`
2. Set `user.signingkey` to the public key you chose to sign commits with.
3. Set `commit.gpgsign` to `true`
4. Set `gpg.ssh.program` to `/Applications/1Password.app/Contents/MacOS/op-ssh-sign`
5. Set `tag.gpgsign` to `true`. *(optional)*
然后在 1password 创建一个密钥对，并且把公钥上传至 github。

## For Nix
对于 nixos or nix-darwin，上面两节内容的可替代配置是
ssh 相关
```
programs.ssh = {
    enable = true;
    matchBlocks = {
      "hostname" = {
        hostname = "ip";
        user = "username";
        port = port;
    };
```
git 相关
```
programs.git = {
    enable = true;
    userName = username;
    userEmail = useremail;

    signing = {
      key = "your-public-key";
      signByDefault = true;
      gpgPath = "/Applications/1Password.app/Contents/MacOS/op-ssh-sign";
    };

    extraConfig = {
      gpg.format = "ssh";
      tag.gpgsign = true;
    };
```
