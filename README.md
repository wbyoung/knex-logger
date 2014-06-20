# knex-logger

[![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url] [![Code Climate][codeclimate-image]][codeclimate-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][david-image]][david-url] [![devDependencies][david-dev-image]][david-dev-url]

Express middleware for logging queries made by [Knex.js][knex].

## Install

``` bash
npm install knex-logger
avn setup
```

## Use

```javascript
var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);
var express = require('express');
var knexLogger = require('knex-logger');

var app = express();

app.use(knexLogger(knex));
```


## License

This project is distributed under the MIT license.


[travis-url]: http://travis-ci.org/wbyoung/knex-logger
[travis-image]: https://secure.travis-ci.org/wbyoung/knex-logger.png?branch=master
[npm-url]: https://npmjs.org/package/knex-logger
[npm-image]: https://badge.fury.io/js/knex-logger.png
[codeclimate-image]: https://codeclimate.com/github/wbyoung/knex-logger.png
[codeclimate-url]: https://codeclimate.com/github/wbyoung/knex-logger
[coverage-image]: https://coveralls.io/repos/wbyoung/knex-logger/badge.png
[coverage-url]: https://coveralls.io/r/wbyoung/knex-logger
[david-image]: https://david-dm.org/wbyoung/knex-logger.png?theme=shields.io
[david-url]: https://david-dm.org/wbyoung/knex-logger
[david-dev-image]: https://david-dm.org/wbyoung/knex-logger/dev-status.png?theme=shields.io
[david-dev-url]: https://david-dm.org/wbyoung/knex-logger#info=devDependencies

[knex]: http://knexjs.org
