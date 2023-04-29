---
title: 不开启系统代理也可以让Telegram连接代理
date: 2022-11-23 12:03:41
tags: 教程
---
# 前言
使用Telegram时需要开启系统代理才可以连接到网络，这里有一个小方法可以让Telegram在代理软件关闭系统代理的情况下连接代理网络（该方法仅适用于Telegram Desktop）

## 步骤
打开Telegram，点击左上角三条横杠样式图标→设置→高级→连接类型→使用自定义代理→添加代理
选择SOCKS5,代理地址服务器填写127.0.0.1，端口填写代理端口，比如Clash for Windows默认端口为7890
![](https://pic.imgdb.cn/item/637d9fe216f2c2beb1a0f10c.jpg)
![](https://pic.imgdb.cn/item/637d9fe216f2c2beb1a0f109.jpg)
至此，如果你的Telegram成功连接此SOCKS5代理，那么关闭系统代理Telegram仍然可以连接到代理，需要注意的是不可关闭代理软件
![](https://pic.imgdb.cn/item/637da09616f2c2beb1a1a297.png)