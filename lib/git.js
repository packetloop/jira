var sh = require('child_process').execSync;


exports.getRepo = function () {
  var result = sh('git remote -v | grep origin | grep push | awk \'{print $2}\'').toString('utf8');
  if (result.code !== 0) {
    throw new Error(result.trim());
  }
  return result.trim().replace(/\.git$/, '');
};


exports.branchExists = function (branch) {
  return sh(['git branch',
      ' |',
      ' grep ', '"', branch, '"'].join('')).code === 0;
};


exports.createBranch = function (branch) {
  var result = sh(['git branch ', branch].join(''));
  if (result.code !== 0) {
    throw new Error(result.trim());
  }
  return result.toString('utf8').trim();
};


exports.checkoutBranch = function (branch) {
  var result = sh(['git checkout ', branch].join(''));
  if (result.code !== 0) {
    throw new Error(result.trim());
  }
  return result.toString('utf8').trim();
};


exports.getCurrentBranch = function () {
  var result = sh('git branch | grep \'*\' | awk \'{print $2}\'');
  if (result.code !== 0) {
    throw new Error(result.trim());
  }
  return result.toString('utf8').trim();
};


exports.featureBranchName = function (feature) {
  return [
    'feature',
    feature.replace(/[^a-z_0-9]+/ig, '-').replace(/^[_\-]+|[_\-]+$/ig, '')
  ].join('/');
};
