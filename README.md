# vitis-server

node 的版本是 14.17.0

## 前置准备

### 安装 MongoDB

启动项目前在本地主机安装 MongoDB，同时让 MongoDB 实例运行在 27017 端口。

### 环境变量配置文件

在项目更目录创建 env.config.json，文件内容如下：

```json
{
    // 你的 gitlab PRIVATE-TOKEN
    "GITLAB_TOKEN": "xxxx",
    "GITLAB_URL": "https://gitlab.com",
    "MONGODB_URL": "mongodb://localhost:27017/vitis",
}
```

## 启动

```dotnetcli
npm i
npm run server
```

## 兼容性

1. bcrypt: 如果在安装依赖的时候有 node-pre-gyp 相关的错误，请在 https://github.com/kelektiv/node.bcrypt.js 找解决办法。
