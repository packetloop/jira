var sh = require('execSync');


exports.getRepo = function () {
  var result = sh.exec('git remote -v | grep origin | grep push | awk \'{print $2}\'');
  if (result.code !== 0) {
    throw new Error(result.stdout.trim());
  }
  return result.stdout.trim();
};


exports.branchExists = function (branch) {
  return sh.exec(['git branch',
      ' |',
      ' grep ', '"', branch, '"'].join('')).code === 0;
};


exports.createBranch = function (branch) {
  var result = sh.exec(['git branch ', branch].join(''));
  if (result.code !== 0) {
    throw new Error(result.stdout.trim());
  }
  return result.stdout.trim();
};


exports.checkoutBranch = function (branch) {
  var result = sh.exec(['git checkout ', branch].join(''));
  if (result.code !== 0) {
    throw new Error(result.stdout.trim());
  }
  return result.stdout.trim();
};
