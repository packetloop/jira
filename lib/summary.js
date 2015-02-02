var sh = require('execSync');


var summary = function (key) {

  if (!key) {
    throw new Error('Issue key must be specified');
  }
  if (!process.env.JIRA_TOKEN) {
    throw new Error('JIRA_TOKEN env required');
  }
  if (!process.env.JIRA_URL) {
    throw new Error('JIRA_URL env required');
  }
  var command = ['curl --silent',
    ' -u ', process.env.JIRA_TOKEN,
    ' -H "Content-Type: application/json"',
    ' ', process.env.JIRA_URL.replace(/\/$/, ''), '/rest/api/2/issue/', key].join('');

  var issue;

  try {
    issue = JSON.parse(sh.exec(command).stdout);
  } catch (e) {
    throw new Error('Cannot retrieve JIRA issue');
  }
  if (issue.errorMessages && issue.errorMessages.length) {
    throw new Error(issue.errorMessages.shift());
  }

  return issue.fields.summary;
};

summary.help = [
  'jira summary <issue key>'
];

module.exports = summary;
