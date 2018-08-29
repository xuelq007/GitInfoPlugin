# GitInfoPlugin

[![Build Status](https://travis-ci.org/xuelq007/GitInfoPlugin.svg?branch=master)](https://travis-ci.org/xuelq007/GitInfoPlugin)
[![npm version](https://badge.fury.io/js/git-info-plugin.svg)](https://badge.fury.io/js/git-info-plugin)

一个非常简单的 [webpack4](https://webpack.js.org/) 插件，用于快速查看本地build的git信息，用于快速定位当前build是基于哪次提交。
## 使用

```bash
npm install --save-dev git-info-plugin
```

然后在webpack.config中按照如下配置：

```javascript
var GitInfoPlugin = require('git-info-plugin')

module.exports = {
  plugins: [
    new GitInfoPlugin()
  ]
}
```

构建完成后，打开网页，输入快捷键(默认ctrl + shift + Enter)，打开浏览器开发者工具，可以看到当前build的最新一次git commit id.

```
c698cec1c6c22641692c716535dfcb21492c41ed
```

branch

```
dev
```

detail

```
c698cec1 - xueliqiang, 2 days ago : 优化项目代码
```


## 配置

插件有默认配置，用户可不必自行填写。 默认配置如下：

```javascript
module.exports = {
  plugins: [
    new GitInfoPlugin({
        hotKey: 'ctrl+shift+65',
        hotKeyDelimiter: '+',
        info: 'detail'
    }
  ]
}
```

### `hotKeyDelimiter: '+'`

快捷键分隔符，默认为'+'，用户可自行设置为‘～’，‘¥’ 等等。



### `hotKey: 'ctrl+shift+13'`

通过设置`hotKey`用户可自定义快捷键以免与项目已有快捷键冲突。目前支持的快捷方式是Ctrl或Shift或Alt任意组合再加键盘的keyCode，
比如回车键(Enter)的keyCode是13.

需要注意的是`hotKey`中的分隔符应和hotKeyDelimiter中的配置保持一致。



### `info: 'id'`

通过`info`配置，用户可选择项目中展示的info信息。目前支持'id', 'branch'以及'detail'三种形式。



## 版本支持

该插件支持webpack4及以上
