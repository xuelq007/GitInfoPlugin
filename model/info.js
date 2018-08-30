// 'info' options in plugin config

var COMMIT_ID = 'git rev-parse HEAD';
var CURRENT_BRANCH = 'git symbolic-ref --short -q HEAD';
var COMMIT_DETAIL = 'git log --pretty=format:"%h - %an, %ar : %s"  -1';

module.exports = {
    branch: CURRENT_BRANCH,
    id: COMMIT_ID,
    detail: COMMIT_DETAIL
};