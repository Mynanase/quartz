---
title: Tycho 安装 DYNAMITE
filename: 
tags:
  - galaxy
  - linux
categories: 
status:
  - todo
share: true
image: 
description: 
created: 2025-03-24T17:31:34+08:00
updated: 2025-03-24T20:14:18+08:00
---

## 安装 gcc
下载源码并解压
```sh
wget https://ftp.gnu.org/gnu/gcc/gcc-13.2.0/gcc-13.2.0.tar.xz
tar -xf gcc-13.2.0.tar.xz
cd gcc-13.2.0
```
安装依赖库
```sh
./contrib/download_prerequisites
```
配置编译路径为 `~/app`，并开启多线程编译
```sh
mkdir build && cd build
../configure --prefix=$HOME/app/gcc-13.2.0 --enable-languages=c,c++,fortran --disable-multilib
make -j$(nproc)
make install
```
用 `gfortran --version` 检查 `gfortran` 版本。之后
## 安装 galahad
首先 clone DYNAMITE 仓库到服务器：
```sh
git clone https://github.com/dynamics-of-stellar-systems/dynamite.git
cd dynamite
```
进入目录 `legacy_fortran/galahad-2.3/`
```sh
cd legacy_fortran/galahad-2.3/
./galahad-2.3
```
然后依据系统依次选择（我的系统 linux_x86_64，使用 gfortran 编译器）：
```md
Select platform
- PC
Select operating system
- linux 
Select compiler
- GNU gfortran under linux (pc version)
Select subset of GALAHAD packages to be installed (the chosen subset will optionally be installed below)
- The QP packages and their interfaces to CUTEr
By default, the CUTEr you wish to use is installed in … Is this OK?
- n(o)
Enter alternative directory for CUTEr
- /home/.../dynamite/legacy_fortran/cuter
Do you now wish to compile the package subset you selected earlier?
- y(es)
The package subset may be installed in either single or double precision. Which precision do you require for the installed subset?
- D for double precision
Do you also wish to install the single precision version?**
- n(o)
```
更详细的操作说明以及其他操作系统安装方法参考 [DYNAMITE 文档](https://dynamics.univie.ac.at/dynamite_docs/getting_started/installation.html#installation-of-galahad)
最后添加路径和环境变量：
- Bash
```sh
export GALAHAD="/home/.../legacy_fortran/galahad-2.3"
export MANPATH="$MANPATH:/home/.../legacy_fortran/galahad-2.3/man"
export PATH="$PATH:/home/.../legacy_fortran/galahad-2.3/bin"
```
- fish 
```sh
fish_add_path "/home/.../legacy_fortran/galahad-2.3/bin"
set -x GALAHAD "/home/.../legacy_fortran/galahad-2.3"

if not set -q MANPATH
	set -x MANPATH ""
end
set -x MANPATH $MANPATH "/home/.../legacy_fortran/galahad-2.3/man"
```

## Compiling the Fortran programs
回到 `legacy_fortran`，简要修改 `./Makefile`，确保：
- 设置了正确的 `GALAHADTYPE`，分别对应于 gfortran in mac，ifrot for linux 和 gfortran in linux。
```toml
# MAC, gfortran
# GALAHADTYPE= mac.osx.gfo/double/

# linux, ifort
# GALAHADTYPE= pc.lnx.ifc/double
GALAHADTYPE= pc.lnx.gfo/double
```
- 确保 `all:` 之后没有 `triaxgasnnls`
- 使用 `make all` 开始编译

## 安装 DYNAMITE
我是用 uv 创建一个虚拟环境，然后在虚拟环境中安装 DYNAMITE。启用虚拟环境之后，进入 `dynamite` 目录，执行下方命令安装 `DYNAMITE`。
```sh
uv pip install .
uv pip install .[cvxopt]
```

## 测试
```sh
cd dev_tests/
uv run test_orbit_losvds.py
```
