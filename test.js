'use strict';

var Redis = require('ioredis');
var redis = new Redis();
var timeout = require('./');

timeout(redis, 1000);

redis
  .get('key')
  .then(console.log)
  .catch(console.error);