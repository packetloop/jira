var sh = require('execSync');
var _ = require('lodash');

var git = require('../lib/git');
var gitlab = require('../lib/gitlab');
var memo = require('../lib/memoize');
var summary = require('./summary');


function searchProjects(namespace) {
  return sh.exec(gitlab.curl('GET', '/projects', {
    search: namespace, page: 1, per_page: 100
  })).stdout;
}

function fetchUser() {
  return sh.exec(gitlab.curl('GET', '/user', {})).stdout;
}


function getUserID() {

  var user;
  try {
    user = JSON.parse(memo(fetchUser));
  } catch (e) {
    throw new Error('Cannot retrieve GITLAB user');
  }
  return user.id;
}


function getProjectID(namespace) {

  var projects;
  try {
    projects = JSON.parse(memo(searchProjects, namespace));
  } catch (e) {
    throw new Error('Cannot retrieve GITLAB projects');
  }
  var project = _.find(projects, {path_with_namespace: namespace});
  if (!project) {
    throw new Error('Cannot find project ' + namespace);
  }
  return project.id;
}


var review = function (key, group) {
  var results = [];

  if (!key) {
    throw new Error('Issue key must be specified');
  }
  var namespace = git.getRepo().split(':').pop();
  results.push('Project namespace is ' + namespace);

  var userId = getUserID();
  results.push('User id resolved to ' + userId);

  var id = getProjectID(namespace);
  results.push('Project id resolved to ' + id);

  var name = summary(key).shift();

  var branch = git.getCurrentBranch();
  var autoName = git.featureBranchName([key, name].join(' '));
  if (branch !== autoName) {
    throw new Error('Wrong branch. Expected ' + autoName + ' actual ' + branch);
  }

  var description;
  if (group) {
    description = process.env['GITLAB_PING_' + group.toUpperCase()];
  }
  if (!description) {
    description = process.env['GITLAB_PING_DEFAULT'];
  }

  var mr;
  try {
    mr = sh.exec(gitlab.curl('POST', '/projects/' + id + '/merge_requests', {
      id: id,
      assignee_id: userId,
      source_branch: branch,
      target_branch: 'develop',
      title: [key, name].join(' - '),
      description: description
    }));
    console.log("mr", mr);
    mr = JSON.parse(mr.stdout);
  } catch (e) {
    console.log("e", e);
    throw new Error('Cannot create GITLAB merge request');
  }
  if (!mr.iid) {
    throw new Error('Cannot create GITLAB merge request, it may exist already');
  }

  results.push([
    process.env.GITLAB_URL.replace(/\/$/, ''), namespace, 'merge_requests', mr.iid
  ].join('/'));
  return results;
};

review.help = [
  'jira review <issue key>'
].join('\n');

module.exports = review;
