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
    var captureQueries = function(builder) {
      var startTime = process.hrtime();
      var group = []; // captured for this builder

      builder.on('query', function(query) {
        group.push(query);
        queries.push(query);
      });
      builder.on('end', function() {
        // all queries are completed at this point.
        // in the future, it'd be good to separate out each individual query,
        // but for now, this isn't something that knex supports. see the
        // discussion here for details:
        // https://github.com/tgriesser/knex/pull/335#issuecomment-46787879
        var diff = process.hrtime(startTime);
        var ms = diff[0] * 1e3 + diff[1] * 1e-6;
        group.forEach(function(query) {
          query.duration = ms.toFixed(3);
        });
      });
    };

    var logQueries = colored(function() {
      res.removeListener('finish', logQueries);
      res.removeListener('close', logQueries);
      knex.client.removeListener('start', captureQueries);

      queries.forEach(function(query) {
        var color = chalk.cyan;
        console.log('%s %s %s %s',
          chalk.gray('SQL'),
          color(query.sql),
          chalk.gray('{' + query.bindings.join(', ') + '}'),
          chalk.magenta(query.duration + 'ms'));
      });
    });

    knex.client.on('start', captureQueries);
    res.on('finish', logQueries);
    res.on('close', logQueries);

    next();
  };
};
