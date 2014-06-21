'use strict';

var chalk = require('chalk');

module.exports = function(knex, options) {
  var opts = options || {};

  if (opts.forceColor) {
    chalk.enabled = true;
  }

  return function(req, res, next) {

    // TODO: improve color support with levels for info/warn/error
    // TODO: add an option to only log if a certain number of queries occur per
    // request

    var queries = [];
    var watchQuery = function(data, query) {
      var start = process.hrtime();
      query.on('end', function() {
        var diff = process.hrtime(start);
        var ms = diff[0] * 1e3 + diff[1] * 1e-6;
        data.duration = ms.toFixed(3);
        queries.push(data);
      });
    };

    var logQuery = function() {
      res.removeListener('finish', logQuery);
      res.removeListener('close', logQuery);
      knex.client.removeListener('query', watchQuery);

      queries.forEach(function(data) {
        var color = chalk.gray;
        console.log('%s %s %s %s',
          chalk.gray('SQL'),
          color(data.sql),
          chalk.cyan('{' + data.bindings.join(', ') + '}'),
          chalk.magenta(data.duration + 'ms'));
      });
    };

    knex.client.on('query', watchQuery);
    res.on('finish', logQuery);
    res.on('close', logQuery);

    next();
  };
};
