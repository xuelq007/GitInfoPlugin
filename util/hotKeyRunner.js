var Show = require('../model/show');

function HotKeyRunner() {

}


HotKeyRunner.prototype.compileKeys = (options) => {
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

HotKeyRunner.prototype.setConsole = function(hotKeyInfo, options, htmlPluginData, commandOutput) {
    if ([Show.console, Show.both].indexOf(options.show) > -1) {
        htmlPluginData.html = htmlPluginData.html + ` <script>
            document.onkeydown = (e) => {
              e = e || window.event;
              var keyCode = e.keyCode || e.which;
              var data = \`${commandOutput}\`;
              if (e.shiftKey === ${hotKeyInfo.isShift}
                  && e.ctrlKey === ${hotKeyInfo.isCtrl}
                  && e.altKey === ${hotKeyInfo.isAlt}
                  && keyCode == ${hotKeyInfo.keyCode}) {

                  console.log(data);
              }
            }
        </script>`;
    }
};

module.exports = new HotKeyRunner();

