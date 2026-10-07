---
title: Inviscid Flows
filename:
tags:
categories:
  - Notes\FluidMechanics
status:
share: true
image:
description:
created: 2025-10-19T03:36:34+08:00
updated: 2025-10-21T20:08:07+08:00
---

## The Euler Equation

在一定时间 $delta t$ 内，穿过某个边界的动量通量为
$$
"Momentum Flux" = delta t cprod integral_S (rho vb(u)) vb(u) dprod dd(vb(S))
$$
其中 $S = partial V$。那么考虑某个体积 $V$，总的动量变化率可以看成体积中动量的流入通量加上所受的合外力：
$$
dv(,t) integral_V rho vb(u) dd(V) = - integral_S (rho vb(u)) vb(u) dprod dd(vb(S)) + "Force" 
$$
利用散度定理将动量通量那一项转换为体积分，考虑某个分量 $i$，
$$
integral_S (rho u_i) vb(u) dprod dd(vb(S)) = integral_V rho div u_i vb(u) dd(V)
= integral_V rho pdv(,x^j)(u_i u_j) dd(V)
$$
由于不可压缩流体 $div vb(u) = partial_j u_j = 0$。可以有下面的化简：
$$
partial_j (u_i u_j) = u_i partial_j u_j + u_j partial_j u_i = cancel(vb(u) div vb(u)) + (vb(u) dprod grad ) vb(u) 
$$
所以最终方程转化为：
$$
integral_V rho (pdv(vb(u), t) + (vb(u) dprod grad ) vb(u)) dd(V) 
= integral_V rho dv(vb(u), t, d:upright(D)) dd(V) = "Force"
$$
为了理解这个方程，我们回顾 [[./Basis|Basis]] 中关于物质微分的定义，它表示某个物质团在流动过程中的变化率，研究的对象是物质团而不是该固定点。在这里，它表示该物质团动量的变化率，我们将视角转换为拉格朗日描述，某个物质团动量的变化率自然就是其所受的合外力。

### Pressure

从微观上来讲，压强来自于原子和分子的运动。这里只把压强表现为作用于流体表面的力。施加在流体团 $V$ 表面 $delta S$ 的力表示为：
$$
F_"pressure" = - P(vb(x),t) vb(n) delta S 
$$
流体运动方程转换为
$$
integral_V rho dv(vb(u), t, d:upright(D)) dd(V) = - integral_S P dd(vb(S)) + "Other Forces"
$$
利用散度定义将压强项转换为体积分，然后约去积分号，得到微分形式为：
$$
rho dv(vb(u), t, d:upright(D)) = - grad P + vb(f) 
$$
这就是欧拉方程 (*Eular equation*)。满足欧拉方程的流体称为理想 (*ideal*) 流体。

欧拉方程是向量方程，其包含三个方程，加上不可压缩流体的方程，求解四个动力学量 $vb(u)$ 和 $P$ 就是本章的主要内容。

### Momentum Conservation

假设没有其余的外力，即 $vb(f) = 0$，那么欧拉方程能被写为
$$
pdv(rho u_i,t) + pdv(,x^j)( rho u_i u_j + P delta_(i j) ) = 0
$$
从方程可以看出守恒量为三个方向的动量，方向 $i$ 的动量对应一个流。不过和电流守恒方程不同的是，这里的动量是一个矢量，与之对应的流是一个二阶张量
$$
Pi_(i j) = rho u_i u_j + P delta_(i j)
$$
张量表示了 $i$ 方向的动量向 $j$ 方向的传播量。

## Application of the Euler equation

### Archimedes’ Principle





