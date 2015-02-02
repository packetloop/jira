var querystring = require('querystring');


function url(path, params) {
  if (!process.env.GITLAB_URL) {
    throw new Error('GITLAB_URL env required');
  }
  return [process.env.GITLAB_URL.replace(/\/$/, ''), '/api/v3', path]
    .concat(params ? ['?', querystring.stringify(params)] : []).join('');
}

exports.curl = function(method, path, params) {
  if (!process.env.GITLAB_TOKEN) {
    throw new Error('GITLAB_TOKEN env required');
  }
  var command = ['curl --silent',
    ' -H "PRIVATE-TOKEN: ', process.env.GITLAB_TOKEN, '"',
    ' -X ', method.toUpperCase(),
    method.toUpperCase() !== 'GET' ? ' --data "' + querystring.stringify(params) + '"' : '',
    ' "', method.toUpperCase() !== 'GET' ? url(path) : url(path, params), '"'
  ].join('');
  return command;
};

exports.url = url;
