#set page(margin: 0pt, width: auto, height: auto)
#show raw: set text(size: 1.25em)

#import "@preview/physica:0.9.5": *
#import "@preview/cetz:0.4.2": *

// 定制化数学符号
#let vb(x) = math.upright(math.bold(x))
#let vu(x) = math.hat(math.upright(math.bold(x)))
#set math.mat(delim: "[")
