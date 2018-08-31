var Show = require('../model/show');

function ExportRunner() {

}

ExportRunner.prototype.export = function (compilation, options, content) {
    // export git info to file
    if ([Show.file, Show.both].indexOf(options.show) > -1) {

        var fileName = options.filename.trim().length > 0 ? options.filename.trim() + '.md' : 'gitInfo.md';
        compilation.assets[fileName] = {
            source() {
                return content;
            },
            size() {
                return content.length;
            }
        };
    }
};

module.exports = new ExportRunner();