'use strict';

var Redis = require('ioredis');
var redis = new Redis();
var RedisTimeout = require('./');

RedisTimeout(redis, 5000);
RedisTimeout.timeout('set', 1000, redis);
RedisTimeout.timeout('set', 500, redis);

redis
  .set('key', 'value')
  .then(console.log)
  .catch(console.error);

redis
  .get('key')
  .then(console.log)
  .catch(console.error);

redis
  .get('key', function(err, result) {
    if(err) {
      console.error(err);
    }
    if(result) {
      console.log(result);
    }
  });