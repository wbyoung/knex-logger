'use strict';

module.exports = function(knex, options) {
  return function(req, res, next) {

    // TODO: figure out the duration of each query
    // TODO: add an option to only log if a certain number of queries occur per
    // request
    // TODO: add color support

    var queries = [];
    var recordQuery = function(data) {
      queries.push(data);
    };

    var logQuery = function() {
      res.removeListener('finish', logQuery);
      res.removeListener('close', logQuery);
      knex.client.removeListener('query', recordQuery);

      queries.forEach(function(data) {
        console.log('[sql]: %s {%s}', data.sql, data.bindings.join(', '));
      });
    };


    knex.client.on('query', recordQuery);
    res.on('finish', logQuery);
    res.on('close', logQuery);

    next();
  };
};
