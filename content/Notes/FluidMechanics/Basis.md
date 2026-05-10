---
title: Basis
filename:
tags:
categories:
  - Notes\FluidMechanics
status:
share: true
image:
description:
created: 2025-10-16T23:37:45+08:00
updated: 2025-12-12T16:09:36+08:00
---

## 基本假设

连续性假设：流体能够用两个光滑连续的场描述：
- 密度 $rho(vb(x),t)$ 
- 速度场 $vb(u)(vb(x),t)$

这里使用的位置矢量 $vb(x)$ 看作是空间中固定的点，而不是随流体流动的物质的运动。因此这里场可以看作是 $vb(u)(vb(x);t)$，也就是一个分布在空间的场，并且整个场随着时间 $t$ 演化，但是 $vb(x)$ 和 $t$ 是无关，$t$ 作为某个一个参数影响 $vb(x)( vb(x) )$。这种描述流体的时间被称为**欧拉描述** (*Eulerian description*)。

另一个观点是研究流体微元，然后用牛顿力学的方法研究微元的轨迹和相互作用等，这种观点被称为**拉格朗日描述**（*Lagrangian description*）。那么速度场 $vb(u)(vb(x),t)$ 表示为粒子运动的速度，随着时间 $t$ 的演化，整体随时间变化：$vb(u) (vb(x)(t), t)$。

对于速度场 $vb(u)(vb(x),t)$，拉格朗日描述可以直接用迹线 (*pathline*) 表示，而欧拉描述的速度场可以用流线 (*streamline*) 描述。

拉格朗日描述中，粒子的位置在速度 $vb(u)$ 下演化形成的轨迹即为迹线，迹线方程满足：
$$
dv(vb(x),t)(t) = vb(u)(vb(x)(t), t)
$$
通过给定边界条件 (初始点) 可以确定一条迹线，根据初始条件的不同，可以形成一系列迹线族。

欧拉描述中某个固定时刻 $t$ 即确定了空间的速度场 $vb(u)(vb(x))$，流线即用于描述这个瞬时速度场。定义流线方程 $vb(x)(s)$ 使得 $vb(x)(s)$ 处的速度和 $vb(u)(vb(x)(s))$ 一致，
$$
dv(vb(x),s)(s) = vb(u)(vb(x)(s), t)
$$
$t$ 整体作为另一个参数影响速度场从而影响流线形状。

## 物质时间微分

假设存在一个标量场 $phi.alt (vb(x), t)$，它告诉我们固定点 $vb(x)$ 处的值随着时间 $t$ 的改变。如果我们跟随一条迹线 $vb(x)(t)$，也就是拉格朗日视角，那么该场随着时间的演化写为：
$$
dv(,t) phi.alt(vb(x)(t), t) = pdv(phi.alt,t) + dot(vb(x)) dprod grad phi.alt = pdv(phi.alt,t) + vb(u) dprod grad phi.alt 
$$
附加项表示 $vb(x)$ 处的 $phi.alt$ 的值由于流体流动被带走的部分，这个传输的过程成为平流 (*advection*) 而附加项 $vb(u) dprod grad phi.alt$ 成为平流变化率。定义质量微分 (*material derivative*)：
$$
dv(phi.alt, t, d:upright(D)) = pdv(phi.alt, t) + vb(u) dprod grad phi.alt  
$$
这个表达式将拉格朗日描述和欧拉描述联系起来。$pdv(phi.alt,t,s:slash )$ 是欧拉描述中场随时间的变化率；而质量微分 $dv(phi.alt, t, d:upright(D), s:slash )$ 物理含义为，跟随位置 $(vb(x),t)$ 的物质微元 $P$，该物质微元处的场随着时间的演化。二者相差一项需要使用和速度场有关的项。

## 质量守恒方程

假设系统的密度场为 $rho(vb(x), t)$，$rho$ 与 $vb(u)$ 组成质量通量密度，那么质量守恒意味着  
$$
pdv(rho, t) + div (rho vb(u)) = 0
$$
考虑物质微分算符，得到
$$
dv(rho,t,d:upright(D)) + rho div vb(u) = 0
$$
对于不可压缩流体，密度是一个常数 $rho = rho_0$，质量守恒方程如下，这要求速度场是无散的。
$$
div vb(u) = 0
$$
但是不可压缩流体的条件过强的，如果希望得到无散的速度场，其实只需要 $dv(rho,t, d:upright(D), s:slash)$ 即可。

## 流函数

由于不可压缩流体的速度场是无散的，存在一个矢量场 $vb(A)$ 满足：
$$
vb(u) = curl vb(A)
$$
对于二维流体，$vb(A)$ 的定义存在特别的含义。

考虑流体在 $(x,y)$ 平面上流动，则 $vb(u)$ 和 $vb(A)$ 可以写为
$$
vb(u) = (u_1, u_2, 0), vb(A) = (0, 0, Psi) quad arrow quad u_1 = pdv(Psi,y), u_2 = -pdv(Psi,x)
$$
考虑 $Psi$ 的梯度有：
$$
grad Psi = (pdv(Psi, x), pdv(Psi, y), 0) quad arrow.double quad vb(u) dprod grad Psi = 0
$$
这说明 $vb(u)$ 与 $Psi$ 的等值线垂直，也就是说 $Psi$ 的等值线即是流线。 

