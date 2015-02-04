var memoize = require('../lib/memoize');

var cache = function (action) {
  if (!action) {
    throw new Error('Action is required');
  }

  if (action === 'clear') {
    memoize.clear();
    return [
      'Cache cleared'
    ];
  }

  if (action === 'size') {
    return [
      'Cache size: ' + memoize.size()
    ];
  }

  if (action === 'path') {
    return [
      'Path: ' + memoize.path()
    ];
  }

  throw new Error('Action ' + action + ' is not implemented');
};

cache.help = [
  'jira cache <action>',
  'Available actions:',
  '    clear',
  '    size',
  '    path'
];

module.exports = cache;



