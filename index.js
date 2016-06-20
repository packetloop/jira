#! /usr/bin/env node

var path = require('path');
var glob = require('glob');
var _ = require('lodash');

var args = process.argv.slice(2);
var command = args.shift();

// Pre-fill all commands to populate help
var commands = {};
glob.sync(path.join(__dirname, 'commands', '*.js')).forEach(function (filename) {
  commands[path.basename(filename, '.js')] = require(path.resolve(filename));
});


function usage() {
  console.log(['Usage:'].concat(_.map(commands, function(handler, name) {
    return [name + ':'].concat(handler.help).join('\n    ')
  })).join('\n  '));
}

if (!command || command === 'help') {
  usage();
  process.exit(0);
}

if (!commands[command]) {
  console.error('Command `' + command + '` not implemented');
  usage();
  process.exit(1);
}

try {
  console.log([].concat(commands[command].apply(null, args)).join('\n  '));
} catch (e) {
  console.error(e);
  console.log(['Usage'].concat(commands[command].help).join('\n  '));
  process.exit(1);
}

process.exit(0);
