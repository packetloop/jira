var sh = require('execSync');
var memo = require('../lib/memoize');
var jira = require('../lib/jira');

function getIssue(key) {
  return sh.exec(jira.curl(jira.url('/issue/' + key))).stdout;
}

var summary = function (key) {

  if (!key) {
    throw new Error('Issue key must be specified');
  }

  var issue;

  try {
    issue = JSON.parse(memo(getIssue, key));
  } catch (e) {
    throw new Error('Cannot retrieve JIRA issue ' + key);
  }
  if (issue.errorMessages && issue.errorMessages.length) {
    throw new Error(issue.errorMessages.shift());
  }

  return [issue.fields.summary];
};

summary.help = [
  'jira summary <issue key>'
];

module.exports = summary;
