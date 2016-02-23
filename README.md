## ioredis-timeout

Add timeout to ioredis.

### Usage

```
'use strict';

var Redis = require('ioredis');
var redis = new Redis();
var timeout = require('./');

timeout(redis, 1000);

redis
  .get('key')
  .then(console.log)
  .catch(console.error);

// { [redis.get: Executed timeout 1000 ms] name: 'redis.get', args: [ 'key' ] }
```

### Test

```
npm test
```

### License

MIT