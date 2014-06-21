'use strict';

var chalk = require('chalk');

var colored = function(fn) {
  return function() {
    var enabled = chalk.enabled;
    chalk.enabled = true;
    fn.apply(this, arguments);
    chalk.enabled = enabled;
  }
};

module.exports = function(knex, options) {
  var opts = options || {};

  return function(req, res, next) {

    // TODO: improve color support with levels for info/warn/error
    // TODO: add an option to only log if a certain number of queries occur per
    // request

    var queries = [];
    var watchQuery = function(query) {
      var start = process.hrtime();
      query.on('end', function() {
        var diff = process.hrtime(start);
        var ms = diff[0] * 1e3 + diff[1] * 1e-6;
        query.duration = ms.toFixed(3);
        queries.push(query);
      });
    };

    var logQuery = colored(function() {
      res.removeListener('finish', logQuery);
      res.removeListener('close', logQuery);
      knex.client.removeListener('query', watchQuery);

      queries.forEach(function(query) {
        var color = chalk.gray;
        console.log('%s %s %s %s',
          chalk.gray('SQL'),
          color(query.sql),
          chalk.cyan('{' + query.bindings.join(', ') + '}'),
          chalk.magenta(query.duration + 'ms'));
      });
    });

    knex.client.on('query', watchQuery);
    res.on('finish', logQuery);
    res.on('close', logQuery);

    next();
  };
};
