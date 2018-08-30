var gitRunner = require('./util/gitRunner');

var Show = require('./model/show');
var Info = require('./model/info');

function GitInfoPlugin (options = {}) {
    this.options = Object.assign({
        hotKey: 'ctrl+shift+13',
        hotKeyDelimiter: '+',
        info: 'detail',
        show: Show.console,
        command: ''
    }, options);

    this.options.show = [Show.file, Show.console, Show.both].indexOf(this.options.show) > -1
        ? this.options.show : Show.console;

    this.gitCommand = this.options.command.trim().length > 0 ? this.options.command : Info[this.options.info];
}

GitInfoPlugin.prototype.apply = function (compiler) {
    compiler.hooks.compilation.tap('compilation', (compilation) => {
        gitRunner.run(compilation, this.gitCommand, this.options);
    });

    // compiler.hooks.compilation.tap('emit', (compilation, callback) => {

    // });
};

module.exports = GitInfoPlugin;
