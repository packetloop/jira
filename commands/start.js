var summary = require('./summary');
var git = require('../lib/git');

var start = function (key) {
  var name = summary(key).shift();
  var result = [];
  var branch = [
    'feature',
    [key, name].join(' ').replace(/[^a-z_0-9]+/ig, '-')
  ].join('/');


  // create branch if does not exist
  if (!git.branchExists(branch)) {
    git.createBranch(branch);
    result.push('Branch `' + branch + '` created');
  }
  git.checkoutBranch(branch);
  result.push('Checked out branch `' + branch + '`');

  return result;
};

start.help = [
  'jira start <issue key>'
];

module.exports = start;



