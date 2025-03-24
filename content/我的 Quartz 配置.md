---
title: 我的 Quartz 配置
filename: 
tags: 
categories: 
status:
  - todo
share: true
image: 
description: 
created: 2025-03-15T18:31:43+00:00
updated: 2025-03-24T12:40:10+08:00
---

## MathJax
因为 MathJax 渲染的公式更美观，并且 MathJax 支持预加载包和自定义命令，所以我更倾向于使用 MathJax，而不是 KaTeX 或者 Typst（还不太完善）。

这一节主要完善的功能有
- 加载包
- 加载自定义宏
- 设置行间公式居中
### 添加包
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
### 自定义宏
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
### 公式居中显示
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

### 外观
#### 使用自定义字体
- 正文 `body`：`LXGW Neo ZhiSong`
- 代码块 `code`：`Iosveka Nerd Font` + `LXGW Neo XiHei`
##### 引用字体的一般方法
参考 [LazyJack 的配置](https://lazyjack.12123123.xyz/%E5%85%B6%E5%AE%83%E8%B5%84%E6%BA%90/%E8%B8%A9%E5%9D%91%E8%AE%B0%E5%BD%95/Google-Fonts%E4%B8%8B%E8%BD%BD%E5%88%B0%E6%9C%AC%E5%9C%B0%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%8A%A0%E9%80%9F%E7%BD%91%E7%AB%99%E5%93%8D%E5%BA%94)，可以用本地字体的方法，首先在 `quartz.config.ts` 中将 fontOrigin 设置为 `local`，然后将你的字体放在 `/quartz/static/`，然后在 `custom.css` 中使用下面的代码引用：
```scss
// 我的字体文件夹 /quartz/static/fonts/
@font-face {
    font-family: "Iosevka Nerd Font";
    src: url('../static/fonts/IosevkaNerdFont-Regular.woff2') format('woff2');
    font-style: normal;
    font-display:swap;
}
```
对于中文字体，为了提高加载速度，可以先进行 [字体分包](https://chinese-font.netlify.app/zh-cn/post/deploy_to_cdn)，完成之后将分包之后的字体文件放到 `static/` 下，注意分包后的 `result.css`, 我们只需要将其中字体路径替换为 `static` 下的对应路径，然后引用到 `custom.scss` 即可。
```scss
@use "result.css" 
```
### 发布到各个搜索引擎
#### Google
前往 [Google Search Console](https://search.google.com/search-console)
- 使用「HTML 文件上传」的方法验证网站所有权，只需要把 `.html` 放在构造目录，我的是 `/content`，构建时会自动把它复制到 `public` 下。
- 添加站点地图（通常位于 `https://{{base_url}}/sitemap.xml`）
#### Bing
前往 [Webmaster Tools](https://www.bing.com/webmasters)，Bing 支持直接从 Google Search Console 导入，当然也可以手动验证，步骤和 Google 的类似，将 `BingSiteAuth.xml` 放入 `/content`。


