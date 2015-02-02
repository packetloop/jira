
var review = function(key) {
  return [key];
};

review.help = [
  'jira review <issue key>'
].join('\n');

module.exports = review;
