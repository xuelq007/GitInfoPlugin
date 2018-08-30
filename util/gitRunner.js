var exec = require('child_process').exec;
var hotKeyRunner = require('./hotKeyRunner');
var exportRunner = require('./exportRunner');

function GitRunner() {

}

GitRunner.prototype.run = function (compilation, command, options) {
    var self = this;
    var commandOutput = '';
    compilation.hooks.optimizeTree.tapAsync('optimize-tree', (chunks, modules, callback) => {
        // var isCommandDangerous = self.isCommandDangerous(command);
        var isCommandDangerous = false;

        if (!isCommandDangerous) {
            self.execCommand(command, (err, res) => {
                if (err) { return callback(err); }

                commandOutput = res;
                exportRunner.export(compilation, options, commandOutput);

                callback();
            });
        }
        // else {
        //     commandOutput = `Git Command ${command} is dangerous (We only support readonly command. operation command like 'pull','push','add','delete' etc.. are not supported)`;
        //     exportRunner.export(compilation, options, commandOutput);
        // }
    });

    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {

        var hotKeyInfo = hotKeyRunner.compileKeys(options);
        hotKeyRunner.setConsole(hotKeyInfo, options, htmlPluginData, commandOutput);

        callback && callback(null, htmlPluginData);
    });
};

GitRunner.prototype.execCommand = function (command, callback) {
    callback && exec(command, function (err, stdout) {
        if (err) { return callback(err); }
        callback(null, stdout.replace(/[\s\r\n]+$/, ''));
    });
};

GitRunner.prototype.isCommandDangerous = function (command) {
    return ['pull', 'push', 'merge', 'fetch', 'commit', 'add', 'revert', 'delete', 'reset'].some(keyword => {
        return command.indexOf(keyword) > -1;
    });
};

module.exports = new GitRunner();

