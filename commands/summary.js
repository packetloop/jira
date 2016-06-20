var sh = require('child_process').execSync;
var memo = require('../lib/memoize');
var jira = require('../lib/jira');

function getIssue(key) {
  var cmd = jira.curl(jira.url('/issue/' + key));
  return sh(cmd).toString('utf8');
}

var summary = function (rawKey) {

  if (!rawKey) {
    throw new Error('Issue key must be specified');
  }

  var key;

  if (String(parseInt(rawKey, 10)) === rawKey) {
    key = [process.env.JIRA_PREFIX, rawKey].join('-').toUpperCase()
  } else {
    key = rawKey.toUpperCase();
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

  return [[key, issue.fields.summary.trim()].join(' ')];
};

summary.help = [
  'jira summary <issue key>'
];

module.exports = summary;
