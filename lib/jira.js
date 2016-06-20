var querystring = require('querystring');


exports.curl = function(url) {
  if (!process.env.JIRA_TOKEN) {
    throw new Error('JIRA_TOKEN env required');
  }

  var cmd = ['curl --silent',
    ' -u ', process.env.JIRA_TOKEN,
    ' -H "Content-Type: application/json"',
    ' "', url, '"'
  ].join('');

//   console.log('Executing: \n', cmd);
  return cmd;
};

exports.url = function(path, params) {
  params = params || {};

  if (!process.env.JIRA_URL) {
    throw new Error('JIRA_URL env required');
  }

  return [process.env.JIRA_URL.replace(/\/$/, ''), '/rest/api/2', path,
    '?', querystring.stringify(params)].join('');
};
