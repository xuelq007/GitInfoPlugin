var exec = require('child_process').exec;

var COMMIT_ID = 'git rev-parse HEAD';
var CURRENT_BRANCH = 'git symbolic-ref --short -q HEAD';
var COMMIT_DETAIL = 'git log --pretty=format:"%h - %an, %ar : %s"  -1';

var InfoMap = {
    branch: CURRENT_BRANCH,
    id: COMMIT_ID,
    detail: COMMIT_DETAIL
};

var Show = {
    file: 'file',
    console: 'console',
    both: 'both'
};

function GitInfoPlugin (options = {}) {
    this.options = Object.assign({
        hotKey: 'ctrl+shift+13',
        hotKeyDelimiter: '+',
        info: 'detail',
        show: Show.console,
        command: ''
    }, options);

    this.gitCommand = this.options.command.trim().length > 0 ? this.options.command : InfoMap[this.options.info];
}

GitInfoPlugin.prototype.apply = function (compiler) {
    compiler.hooks.compilation.tap('compilation', (compilation) => {
        var commitOutput = '';
        var hotKeyInfo = this.compileHotKey(this.options);
        var self = this;
        compilation.hooks.optimizeTree.tapAsync('optimize-tree', (chunks, modules, callback) => {
            self.runGitCommand(self.gitCommand, (err, res) => {
                if (err) { return callback(err); }
                commitOutput = res;

                // export git info to file
                if (self.options.show === Show.file || self.options.show === Show.both) {
                    compilation.assets['gitInfo.md'] = {
                        source() {
                            return commitOutput;
                        },
                        size() {
                            return commitOutput.length;
                        }
                    };
                }

                callback();
            });
        });

        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
            if (self.options.show === Show.console || self.options.show === Show.both) {
                htmlPluginData.html = htmlPluginData.html + ` <script>
                    document.onkeydown = (e) => {
                      e = e || window.event;
                      var keyCode = e.keyCode || e.which;
                      var data = \`${commitOutput}\`;
                      if (e.shiftKey === ${hotKeyInfo.isShift}
                          && e.ctrlKey === ${hotKeyInfo.isCtrl}
                          && e.altKey === ${hotKeyInfo.isAlt}
                          && keyCode == ${hotKeyInfo.keyCode}) {

                          console.log(data);
                      }
                    }
                </script>`;
            }
            callback && callback(null, htmlPluginData);
        });
    });

    // compiler.hooks.compilation.tap('emit', (compilation, callback) => {
    //    debugger;
    // });
};

GitInfoPlugin.prototype.runGitCommand = (command, callback) => {
    callback && exec(command, function (err, stdout) {
        if (err) { return callback(err); }
        callback(null, stdout.replace(/[\s\r\n]+$/, ''));
    });
};

GitInfoPlugin.prototype.compileHotKey = (options) => {
    var hotKey = options.hotKey;
    var hotKeyDelimiter = options.hotKeyDelimiter;
    var hotKeyArr = hotKey.split(hotKeyDelimiter).map(item => {
        return item.toLowerCase();
    });

    var isCtrl = false;
    var isShift = false;
    var isAlt = false;

    var ctrlIndex = hotKeyArr.indexOf('ctrl');
    if (ctrlIndex > -1) {
        isCtrl = true;
        hotKeyArr.splice(ctrlIndex, 1);
    }

    var shiftIndex = hotKeyArr.indexOf('shift');
    if (shiftIndex > -1) {
        isShift = true;
        hotKeyArr.splice(shiftIndex, 1);
    }

    var altIndex = hotKeyArr.indexOf('alt');
    if (altIndex > -1) {
        isAlt = true;
        hotKeyArr.splice(altIndex, 1);
    }

    var keyCode = hotKeyArr.length === 1 ? hotKeyArr[0] : '';
    return {
        isCtrl : isCtrl,
        isShift: isShift,
        isAlt: isAlt,
        keyCode: keyCode
    };
};

module.exports = GitInfoPlugin;