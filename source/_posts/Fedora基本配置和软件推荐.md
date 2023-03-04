---
title: Fedora基本配置和软件推荐
date: 2022-12-31 14:07:28
tags: 记录
---
# 前言
Fedora安装完成后需要配置一些设置来符合使用习惯，本文为我所写，仅作参考
## 基本配置

### 一、为root用户设置密码
在安装完成后进入终端使用su进入管理员模式时，大概率会有以下报错：
``` bash
$ su
密码:
su: 鉴定故障
```
使用以下命令解决问题：
``` bash
$ su passwd root
xxx 的密码:
更改用户 root 的密码
新的密码:
重新输入新的密码:
```
注意，上面所写的密码均为在Fedora进行向导时自己所设置的密码
### 二、启用RPM Fusion软件源
在安装Fedora时会询问是否启用其他第三方软件源，但全套的 RPM Fusion 软件源并没有自动启用
``` bash
$ sudo yum install --nogpgcheck https://mirrors.tuna.tsinghua.edu.cn/rpmfusion/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.tuna.tsinghua.edu.cn/rpmfusion/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```
### 三、添加Flathub存储库
``` bash
$ flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```
### 四、切换阿里巴巴开源镜像站镜像
备份系统原镜像源文件
``` bash
$ su
$ mv /etc/yum.repos.d/fedora.repo /etc/yum.repos.d/fedora.repo.backup
$ mv /etc/yum.repos.d/fedora-updates.repo /etc/yum.repos.d/fedora-updates.repo.backup
```
下载阿里镜像源文件
``` bash
$ wget -O /etc/yum.repos.d/fedora.repo http://mirrors.aliyun.com/repo/fedora.repo
$ wget -O /etc/yum.repos.d/fedora-updates.repo http://mirrors.aliyun.com/repo/fedora-updates.repo
```
生成缓存
``` bash
$ sudo yum makecache
```
### 五、更新系统
``` bash
$ sudo dnf update
```

## 软件推荐
### 一、在Linux上运行.exe文件
Linux系统上的可用软件相对要比Windows要少很多，要运行.exe可执行文件，需要安装Wine和PlayOnLinux
``` bash
$ sudo dnf install wine
$ sudo dnf install playonlinux
```
### 二、更方便地管理.AppImage应用
当遇到一些软件没有.rpm安装包格式的时候，需要使用.AppImage格式运行，但是每次运行文件需要打开文件目录运行，非常不方便，使用AppImage Launcher来集成到应用程序启动器中
GitHub下载地址:https://github.com/TheAssassin/AppImageLauncher/releases/download/v2.2.0/appimagelauncher-2.2.0-travis995.0f91801.x86_64.rpm

## 系统美化
通过安装Gnome插件来使系统界面更加美观
界面毛玻璃样式:https://extensions.gnome.org/extension/3193/blur-my-shell/
使Dock栏更易用:https://extensions.gnome.org/extension/307/dash-to-dock/
饼状菜单:https://extensions.gnome.org/extension/3433/fly-pie/

## 其他
如果遇到权限不足，不妨试试在右上角切换用户，用户名填入root，密码填入你设置的密码，进入管理员模式，能解决大多数权限问题