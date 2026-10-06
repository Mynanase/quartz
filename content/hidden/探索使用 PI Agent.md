---
title: 探索使用 PI Agent
filename:
tags:
status:
share: true
description:
created: 2026-07-31T17:13:31+08:00
modified: 2026-10-07T03:53:26+08:00
---

> 准备重新探索 PI Agent 的使用。

我现在感觉，随着大模型的能力越来越强，需要在 Agent 的结构方面做一些简化。

而我认为比较重要的几个功能有：

1. 记忆系统
2. Subagent

我将会一一配置。

## Subagent

Agent 许多操作只是在大量代码，文字中寻找特定的内容，但是会把全文都带到上下文当中。给 Agent 配置 agent 去干这些查找的活，可以分配不太聪明的模型，然后将结果返回给主代理，这样主 Agent 的上下文不会被污染，还能够节约花费。

我主要使用 Deepseek 官方 API 和 Opencode-go coding plan。然后现在已经确定的是关于直接操作的模型，选用的 deepseek-v4-flash-vision。主模型和用于编排模型用 GLM-5.3-flash。

scout：deepseek/deepseek-v4-flash-vision-exp low
planner：opencode-go/glm-5.3-flash max
worker: deepseek/deepseek-v4-flash-vision-exp high
reviewer: opencode-go/glm-5.3-flash max
主模型：opencode-go/glm-5.3-flash high

## PI Agent 的架构

### 核心包

PI Agent 由四个核心包构成，其中 `pi-ai / pi-agent-core / pi-coding-agent` 构成一个三维堆栈（它们各自能独立使用）。`pi-tui` 是一个与它们正交的 UI 库。核心功能之外的功能通过扩展实现。

`pi-ai` 负责调用调用模型。它支持 30+ 供应商、流式输出、跨供应商上下文交接、token 成本追踪等等。

`pi-agent-core` 用于构建“模型思考 → 调工具 → 看结果 → 再思考”的循环。

`pi-coding-agent` 是堆栈的最顶层，把下面两层组装成一个完整的编码 Agent 产品。同时也暴露出 SDK 接口，让你以”无头”模式在自己的应用中嵌入 Agent。

`pi-tui` 是一个与 Agent 无关的终端 UI 库。

PI 的扩展可以实现：

- 自定义工具 — 定义新的 tool，带 TypeBox schema 参数校验
- UI 组件 — 在终端里嵌入自定义界面
- 斜杠命令 — 注册新的 `/` 命令
- 事件监听 — 在工具调用、turn 结束等时机插入逻辑
- 主题 — 定制 TUI 外观
- 提示词模板 — 可复用的 prompt 片段

## Plugin

### npm:pi-web-access

### npm:pi-subagents

### pi-conversation-outline

右侧大纲

### pi-session-peek

更好的会话查看器
