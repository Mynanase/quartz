---
title: 我的 Quartz 配置
filename: 
tags: 
categories: 
status: 
share: true
image: 
description: 
created: 2025-03-15T18:31:43+00:00
updated: 2025-03-16T03:45:10+00:00
---

# MathJax
因为 MathJax 渲染的公式更美观，并且 MathJax 支持预加载包和自定义命令，所以我更倾向于使用 MathJax，而不是 KaTeX 或者 Typst（还不太完善）。

这一节主要完善的功能有
- 加载包
- 加载自定义宏
- 设置行间公式居中
## 添加包
在 `quartz.config.ts` 的 tex 设置中添加：
```ts
Plugin.Latex({ 
		renderEngine: "mathjax",
		mathJaxOptions: {
		  tex: {
			packages: {'[+]': ['physics', 'configmacros']},
		  }
		},
	})
```
我所使用的包有
- physics
- configmacros：用于之后自定义宏
成功加载 physics 的测试
```latex
\curl \vb{B} = \mu_0 \vb{J} + \mu_0\epsilon_0\pdv{\vb{E}{t}}
```
$$
\curl \vb{B} = \mu_0 \vb{J} + \mu_0\epsilon_0\pdv{\vb{E}}{t}
$$
## 自定义宏
需要按照上述步骤配置好 `configmacros`，然后添加
```ts
tex: {
	packages: {'[+]': ['physics', 'configmacros']},
	macros: {
	  RR: "{\\bf R}",
	}
```
自定义宏测试
```latex
\RR
```
$$
\RR
$$
## 公式居中显示
修改 `quartz/styles/custom.scss`，添加
```scss
// mathjax
mjx-container.MathJax[jax="SVG"][display="true"] {
    display: flex ;
    justify-content: center ;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}
```
