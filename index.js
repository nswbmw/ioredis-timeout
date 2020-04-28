'use strict';

var commands = require('ioredis-commands');
var asCallback = require('standard-as-callback').default;

function timeoutAll(redis, ms, suppressWarnings) {
  if (!ms) {
    return redis;
  }
  Object.keys(commands).forEach(function (command) {
    timeout(command, ms, redis, suppressWarnings);
  });

  return redis;
}

function timeout(command, ms, redis, suppressWarnings) {
  var originCommand = redis['_' + command] || redis[command];
  if (!ms || (typeof originCommand !== 'function')) {
    return originCommand;
  }

  if (['multi', 'pipeline'].indexOf(command) !== -1) {
    if (!suppressWarnings) {
      console.warn('ioredis-timeout not support .pipeline or .multi')
    }
    return originCommand;
  }
  redis['_' + command] = originCommand.bind(redis);
  redis[command] = function () {
    var args = [].slice.call(arguments);
    var cb = null;
    if (typeof args[args.length - 1] === 'function') {
      cb = args.pop();
    }

    const promise = Promise.race([
      promiseDelay(ms, command, args),
      originCommand.apply(redis, args)
    ]);

    if(typeof cb === 'function') return asCallback(promise, cb);
    return promise;
  };
  return redis[command];
}

function promiseDelay(ms, command, args) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      var error = new Error('Executed timeout ' + ms + ' ms');
      error.name = 'redis.' + command;
      error.args = args;
      reject(error);
    }, ms);
  });
}

module.exports = timeoutAll;
module.exports.timeout = timeout;
