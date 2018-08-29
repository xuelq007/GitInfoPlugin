# GitInfoPlugin

[![Build Status](https://travis-ci.org/xuelq007/GitInfoPlugin.svg?branch=master)](https://travis-ci.org/xuelq007/GitInfoPlugin)
[![npm version](https://badge.fury.io/js/git-info-plugin.svg)](https://badge.fury.io/js/git-info-plugin)

一个非常简单的 [webpack4](https://webpack.js.org/) 插件，用于快速查看本地build的git信息，用于快速定位当前build是基于哪次提交。

A very simple webpack4 plugin which is used to check git info of local build. it helps developers know current build is based on which commition.

## 使用(Usage)

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

open webpage and input default shortcut (ctrl + shift + enter), then open develper tools (chrome, firefox etc..). you could see newest commition id in console: 

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


## 配置 (Config)

插件有默认配置，用户可不必自行填写。 默认配置如下：

Default config is below:

```javascript
module.exports = {
  plugins: [
    new GitInfoPlugin({
        hotKey: 'ctrl+shift+13',
        hotKeyDelimiter: '+',
        info: 'detail'
    }
  ]
}
```

### `hotKeyDelimiter: '+'`

快捷键分隔符，默认为'+'，用户可自行设置为‘～’，‘¥’ 等等。

user could add custom hotkey delimiter like '#','%' etc..


### `hotKey: 'ctrl+shift+13'`

通过设置`hotKey`用户可自定义快捷键以免与项目已有快捷键冲突。目前支持的快捷方式是Ctrl或Shift或Alt任意组合再加键盘的keyCode，
比如回车键(Enter)的keyCode是13.

Currently, legal hot keys are 'Ctrl' or 'Shift' or 'Alt' associated with keyCode. for example: ctrl+shift+13 (13 is Enter keyCode).


需要注意的是`hotKey`中的分隔符应和hotKeyDelimiter中的配置保持一致。

Note: the delimiter in config `hotKey` should be consistent with that in config `hotKeyDelimiter`



### `info: 'id'`

通过`info`配置，用户可选择项目中展示的info信息。目前支持'id', 'branch'以及'detail'三种形式。

Currently, it supports 3 types of info: 'id', 'branch' and 'detail'


## 版本支持 (Webpack version)

该插件支持webpack4及以上.

it supports webpack4 or above.

## 依赖 (Dependency)

在成功运行GitInfoPlugin之前，在webpack.config中需要有关于HtmlWebpackPlugin配置。

The plugin runs based on webpack HtmlWebpackPlugin.

```javascript
const GitInfoPlugin = require('git-info-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
            template: './src/index.html'
    }),
    new GitInfoPlugin()
  ]
}
```

## TODO

1. 插件容错：如果用户输入了错误的配置，需要停止编译并提示失败
   catch compile error and provide error info

2. 可以支持展示更多的git info
   support more git info

3. 支持将用户想要的git info导出到一个文件
   ability to export git info to a file

4. 移除对HtmlWebpackPlugin的依赖（当前插件需要用到html-webpack-plugin的hook，将一段script插入到生成的template html当中，这样其实不太好）
   remove dependent on HtmlWebpackPlugin (hook in HtmlWebpackPlugin  is needed in GitInfoPlugin)
