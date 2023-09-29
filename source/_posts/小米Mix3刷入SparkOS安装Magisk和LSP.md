---
title: 小米Mix3刷入SparkOS安装Magisk和LSPosed
tags: 记录
categories: 实用
abbrlink: 58235
date: 2023-02-18 19:12:34
cover: https://pic.imgdb.cn/item/6415cbd3a682492fccffe83d.png
---
# 前言
过年前从海鲜市场上500块钱捡了一台8+128G规格的小米Mix 3，前后面板划痕几乎没有，并且只是后置摄像头玻璃碎了一点以及前置摄像头玻璃也碎了，但是不影响正常功能的使用，总的来说这台机器拿来刷各种类原生系统玩玩是非常不错的选择，除了手机确实是有亿点重，超过了200g，其他方面堪称完美，没有前置摄像头的屏幕简直怎么看怎么爽。

# 总结错误
1.要注意设备代号，比如小米Mix 3的设备代号为“perseus”，相同地，Z6 Pro设备代号为“zippo”，Mi Mix 2s设备代号为“polaris”，清楚了自己的设备代号之后Google一下关于可用于你的设备的刷机包，刷机包文件名称一般都会标上适用于此刷机包的设备，否则就会出现刷入失败或者卡logo进不去系统.当时我第一次接触刷机的时候也是才发现设备代号这个条件
2.需要注意刷机包是否需要依赖底包，底包就是这个手机原本的系统框架，还需要注意此刷机包依赖的底包的版本，以我的情况为例，SparkOS需要依赖的底包版本为MIUI 12.5.1.0，需要找到对应的底包版本先刷入底包再刷入目标刷机包。一个搜索底包的技巧是：手机型号+Firmware，即最基础的系统框架，推荐一个找小米底包的网站[XiaomiFirmwareUpdater](https://xiaomifirmwareupdater.com)，收录的机型比较全.底包的大小是比较小的，一般只有200M以下，仅包含系统框架，当然如果实在找不到底包刷入完全的系统的包也是可以的，只要版本正确即可.不刷入底包直接刷目标刷机包的话则会出现卡logo无法进入系统的情况。
3.这个是需要注意的地方，问题不算太严重，刷机包有gapps和vanilla两种，gapps代表其内置了GMS框架，vanilla则是不带GMS框架的版本，如果你对GMS框架有需求，可以下载gapps版本。gapps版本和vanilla版本的刷机包类型都会写在文件名上。

# 刷机过程
## 刷机前的准备
刷机前肯定是需要解锁bl的，在小米官方网站下载[小米解锁工具](https://www.miui.com/unlock/download.html)按照提示解锁即可。
解锁bl之后就是刷入第三方rec了，后续工作我更建议用[搞机助手](https://lsdy.top/gjzs)这款软件，省去了很多繁琐的步骤。安装好软件后如果手机在系统的话点击从系统模式进入到引导模式的选项，待手机进入到引导模式后，选择“引导模式”模块，点击“刷入第三方rec”，选择twrp的rec刷入，刷入后点自动重启到rec。
至此成功进入到twrp。
## 开始刷机
进入到twrp主界面，点击“清除”，选择要清除的分区，勾选Dalvik / ART Cache,Cache,System,Vendor,Data,Internal Storage(内置存储),在下面滑动滑块确认清除。之后返回到主页面，点击“安装”，再在搞机助手上点击恢复模式模块，使用MTP传输文件到手机，将要刷入的底包和目标刷机包传到手机，等待一会就会在列表中出现刷机包了。另外，像我一样使用OTG是一个很不错的选择，我没有Type-C口的U盘，但手边有一个Type-C的SD读卡器，将刷机包全部复制到SD卡里就能当作U盘使用。使用OTG刷机在存储位置中选择OTG即可。点击fw_perseus_miui_MIMIX3_V12.5.1.0.QEECNXM_b008b041ef_10.0.zip滑动滑块确认刷入直接刷入底包，刷入完成后直接返回，之后点击SparkOS-13.5-UNOFFICIAL-perseus-20230214-gapps.zip刷入目标刷机包，勾选“安装完成后重启”，等待刷入完成后则自动进入系统，可以拔掉OTG了。
至此，刷机包已经成功刷入到手机。

# 安装Magisk和LSPosed
在GitHub中下载[Magisk](https://github.com/topjohnwu/Magisk/releases)的apk安装包然后安装到手机，在电脑上打开目标刷机包的压缩包，然后将目标刷机包中的boot.img解压，在电脑上用MTP将boot.img传输到手机。打开Magisk点击上方安装，方式为“选择并修补一个文件”，选择boot.img后点开始，最后一行显示“Done”之后就会在Download目录生成一个名为“magisk_patched-25200_xxxxx.img”的文件，有OTG设备可以直接拷贝到外置存储器中，没有的话可以将此文件传输到电脑。将手机重启到恢复模式进入twrp，进入主页面后点击安装，下方选择“安装img”，此时将OTG连接手机，或者在电脑上用MTP将该文件传输到手机，点击文件选择“boot”刷入，刷入后自动重启到系统，打开Magisk上方显示“Ramdisk 是”即刷入成功。
在GitHub中下载[LSPosed](https://github.com/LSPosed/LSPosed/releases)，下载文件名带有zygisk的文件，在Magisk下方选择“模块”，点击上方“从本地安装”，在Download目录找到刚才下载的文件，点击即可安装，安装完成后返回到Magisk的主页面，点击右上角设置，打开Zygisk的开关，然后重启。重启后打开控制中心，如果出现“LSPosed 已加载”的通知表示LSPosed已经成功安装，点按通知打开LSPosed管理器，进入管理器后可将LSPosed的图标放置到桌面。进入到LSPosed点击左下角“仓库”来寻找各种强大的模块，模块安装完成后需要在下方选择“模块”来启用模块。
至此，Magisk和LSPosed已成功安装。