#set page(margin: 0pt, width: auto, height: auto)
#show raw: set text(size: 1.25em)

// 数学字体：Lete Sans Math 0.63（OFL，无衬线风格与 IBM Plex Sans 正文搭配）；
// Regular / Bold 文件在 assets/typst-fonts/，由 local-plugins/latex 经 fontArgs 注入。
// 缺字形的符号可回退到内嵌 New CM；MathJax 兜底仍使用 CM 风格。
// 1em：公式字号与正文一致，SVG 尺寸随所在段落的字号缩放。
#show math.equation: set text(font: "Lete Sans Math", size: 1em)

#import "@preview/physica:0.9.5": *
#import "@preview/cetz:0.4.2": *

// 定制化数学符号
// #let vb(x) = math.upright(math.bold(x))
// #let vu(x) = math.hat(math.upright(math.bold(x)))
#set math.mat(delim: "[")
