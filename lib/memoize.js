var os = require('os');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var _ = require('lodash');

var db = path.join(os.tmpdir(), 'jira.json');
var cache = fs.existsSync(db) ? require(db) : {};

function hash() {
  var hasher = crypto.createHash('sha1');
  hasher.update(JSON.stringify(arguments));
  return hasher.digest('hex');
}

module.exports = function(func) {

  var args = _.rest(arguments);
  var key = hash(func.toString(), args);
  if (!cache[key]) {
    cache[key] = func.apply(null, args);
    fs.writeFileSync(db, JSON.stringify(cache), 'UTF-8');
  }

  return cache[key];
};
