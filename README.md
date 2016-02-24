## ioredis-timeout

Add timeout to ioredis.

### Usage

```
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

// { [redis.set: Executed timeout 500 ms] name: 'redis.set', args: [ 'key', 'value' ] }
// { [redis.get: Executed timeout 5000 ms] name: 'redis.get', args: [ 'key' ] }
```

### Test

```
npm test
```

### License

MIT