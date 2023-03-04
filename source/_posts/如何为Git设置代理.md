---
title: 如何为Git设置代理
date: 2022-08-12 20:21:10
tags: 记录
---
Git需要设置代理才能快速地从GitHub上获取文件，同时减少下载的文件缺失和不完整的情况

## 设置代理
设置全局代理
``` bash
$ git config --global https.proxy http://127.0.0.1:7890
$ git config --global https.proxy https://127.0.0.1:7890
```

## 取消代理
取消全局代理
``` bash
$ git config --global --unset http.proxy
$ git config --global --unset https.proxy
```