#! /usr/bin/env node

var path = require('path');
var glob = require('glob');

var args = process.argv.slice(2);
var command = args.shift();

var commands = {};
glob.sync(path.join('lib', '*.js')).forEach(function (filename) {
  commands[path.basename(filename, '.js')] = require(path.resolve(filename));
});


if (!commands[command]) {
  return console.error('Command `' + command + '` not implemented');
}

try {
  console.log('OK' +
    [''].concat(commands[command].apply(null, args)).join('\n    ')
  );
} catch (e) {
  console.error(e);
  console.log('Usage:' +
    [''].concat(commands[command].help).join('\n    ')
  );
  process.exit(1);
}

process.exit(0);
