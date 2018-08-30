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

`branch`

```
dev
```

`detail`

```
c698cec1 - lq007, 2 days ago : 优化项目代码
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
        info: 'detail',
        show: 'console',
        command: ''
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

Note: the delimiter in config `hotKey` should be consistent with that in config `hotKeyDelimiter`.


### `info: 'id' || 'branch' || 'detail'`

通过`info`配置，用户可选择项目中展示的info信息。目前支持`id`, `branch`以及`detail`三种形式。

Currently, it supports 3 types of info: `id`, `branch` and `detail`.


### `show: 'console' || 'file' || 'both'`

默认为`console`, 即git信息只有用快捷键通过开发者工具中的console显示。

`console` is default value. it means we could conly get git info from console through hotkey.

如果设置为`file`，git信息将会导出到文件gitInfo.md并且无法通过使用快捷键在console中显示。

`file` means git info will only show in exported file. 

如果设置为`both`，即`console`模式和`file`模式同时开启。

`both` means 'console' mode and 'file' mode are both available.


### `command: ''`

默认不赋值，仅仅使用插件提供的info option当中的选项。用户可以通过`command`配置自定义git command. 自定义后，`info`配置项将失效。

user could set custom git command through the option. Note that `info` options will be inactive if user set custom command.

例子(example) : { command: 'git status' }

**:warning:警告: 请不要使用操作性command，比如'pull','add','delete','revert','merge'等，否则编译过程将会抛错。**

**:warning:Warning: Please don't use operational git commands which may change current project like 'pull', 'add', 'delete', 'revert', 'merge' etc.. or webpack will throw compile error.**

## 版本支持 (Webpack version)

该插件支持webpack4及以上。

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

## 浏览器兼容性 (browser compatibility)

Chrome >= 45

FireFox >= 34

Safari >= 9

Edge

Not support IE <= 10

这是个方便开发人员的插件，所以并不需要兼容很多浏览器对吧？我觉得有chrome就足够了 :sunglasses:

It's just a plugin for developer, so we don't have to support old browsers, right ? actually Chrome is enough :yum:


## TODO

 1. 移除对HtmlWebpackPlugin的依赖（当前插件需要用到html-webpack-plugin的hook，将一段script插入到生成的template html当中，这样其实不太好）。

   remove dependent on HtmlWebpackPlugin (hook in HtmlWebpackPlugin  is needed in GitInfoPlugin).
