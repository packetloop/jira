var sh = require('execSync');
var summary = require('./summary');


function branchExists(branch) {
  return sh.exec(['git branch',
      ' |',
      ' grep ', '"', branch, '"'].join('')).code === 0;
}


function createBranch(branch) {
  var result = sh.exec(['git branch ', branch].join(''));
  if (result.code !== 0) {
    throw new Error(result.stdout);
  }
}


function checkoutBranch(branch) {
  var result = sh.exec(['git checkout ', branch].join(''));
  if (result.code !== 0) {
    throw new Error(result.stdout);
  }
}


var start = function (key) {
  var name = summary(key);
  var result = [];
  var branch = [
    'feature',
    [key, name].join(' ').replace(/[^a-z_0-9]+/ig, '-')
  ].join('/');


  // create branch if does not exist
  if (!branchExists(branch)) {
    createBranch(branch);
    result.push('Branch `' + branch + '` created');
  }
  checkoutBranch(branch);
  result.push('Checked out branch `' + branch + '`');

  return result;
};

start.help = [
  'jira start <issue key>'
];

module.exports = start;



