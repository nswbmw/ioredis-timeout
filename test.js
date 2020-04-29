const Redis = require('ioredis')
const redis = new Redis()
const RedisTimeout = require('./')

RedisTimeout(redis, 5000)
RedisTimeout.timeout('set', 500, redis)

;(async function () {
  await redis.set('key', 'value')
  console.log(await redis.get('key'))

  redis.get('key', function (err, result) {
    console.log(arguments)
  })
})().catch(console.error)
