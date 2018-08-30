var exec = require('child_process').exec;

var COMMIT_ID = 'git rev-parse HEAD';
var CURRENT_BRANCH = 'git symbolic-ref --short -q HEAD';
var COMMIT_DETAIL = 'git log --pretty=format:"%h - %an, %ar : %s"  -1';

var infoMap = {
    branch: CURRENT_BRANCH,
    id: COMMIT_ID,
    detail: COMMIT_DETAIL
};

function GitInfoPlugin (options = {}) {
    this.options = Object.assign({
        hotKey: 'ctrl+shift+13',
        hotKeyDelimiter: '+',
        info: 'detail',
        file: false
    }, options);

    this.gitCommand = infoMap[this.options.info];
}

GitInfoPlugin.prototype.apply = function (compiler) {
    compiler.hooks.compilation.tap('compilation', (compilation) => {
        var commitOutput = '';
        var hotKeyInfo = this.compileHotKey(this.options);
        compilation.hooks.optimizeTree.tapAsync('optimize-tree', (chunks, modules, callback) => {
            this.runGitCommand(this.gitCommand, (err, res) => {
                if (err) { return callback(err); }
                commitOutput = res;

                // export git info to file
                if (this.options.file) {
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
            htmlPluginData.html = htmlPluginData.html + ` <script>
                document.onkeydown = (e) => {
                  e = e || window.event;
                  var keyCode = e.keyCode || e.which;
                  var data = '${commitOutput}';
                  if (e.shiftKey === ${hotKeyInfo.isShift}
                      && e.ctrlKey === ${hotKeyInfo.isCtrl}
                      && e.altKey === ${hotKeyInfo.isAlt}
                      && keyCode == ${hotKeyInfo.keyCode}) {

                      console.log(data);
                  }
                }
            </script>`;
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