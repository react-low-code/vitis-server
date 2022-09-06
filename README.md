# vitis-server

vitis 低代码系统的服务端，用到的数据库是 MongoDB，启动项目前在本地主机安装 MongoDB，同时让 MongoDB 实例运行在 27017 端口。

## 启动

```dotnetcli
npm i
npm run server
```

## 兼容性

1. bcrypt: 如果在安装依赖的时候有 node-pre-gyp 相关的错误，请在 https://github.com/kelektiv/node.bcrypt.js 找解决办法。
