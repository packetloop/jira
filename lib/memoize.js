'use strict';

var os = require('os');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var _ = require('lodash');

var db = path.join(os.tmpdir(), 'jira.json');
var cache = fs.existsSync(db) ? require(db) : {};


function persist() {
  return fs.writeFileSync(db, JSON.stringify(cache), 'UTF-8');
}


function hash() {
  var hasher = crypto.createHash('sha1');
  hasher.update(JSON.stringify(arguments));
  return hasher.digest('hex');
}

function memoize(func) {

  var args = _.rest(arguments);
  var key = hash(func.toString(), args);
  if (!cache[key]) {
    cache[key] = func.apply(null, args);
    persist();
  }

  return cache[key];
}

memoize.clear = function () {
  cache = {};
  return persist();
};

memoize.size = function () {
  return fs.statSync(db).size;
};

memoize.path = function () {
  return db;
};

module.exports = memoize;
