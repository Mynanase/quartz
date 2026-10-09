#set page(margin: 0pt, width: auto, height: auto)
#show raw: set text(size: 1.25em)

// 数学字体：Latin Modern Math（与 MathJax 兜底的 CM 观感一致）；
// 文件在 assets/typst-fonts/，由 local-plugins/latex 经 fontArgs 注入；
// 缺字形的符号会静默回退到内嵌 New CM（同为 CM 系，风格差异极小）。
// 1em：公式字号与正文一致，SVG 尺寸随所在段落的字号缩放。
#show math.equation: set text(font: "Latin Modern Math", size: 1em)

#import "@preview/physica:0.9.5": *
#import "@preview/cetz:0.4.2": *

// 定制化数学符号
// #let vb(x) = math.upright(math.bold(x))
// #let vu(x) = math.hat(math.upright(math.bold(x)))
#set math.mat(delim: "[")
