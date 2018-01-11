'use strict';

var commands = require('ioredis-commands');

function timeoutAll(redis, ms) {
  if (!ms) {
    return redis;
  }
  Object.keys(commands).forEach(function (command) {
    timeout(command, ms, redis);
  });

  return redis;
}

function timeout(command, ms, redis) {
  var originCommand = redis['_' + command] || redis[command];
  if (!ms || (typeof originCommand !== 'function')) {
    return originCommand;
  }

  if (['multi', 'pipeline'].indexOf(command) !== -1) {
    console.warn('ioredis-timeout not support .pipeline or .multi')
    return originCommand;
  }
  redis['_' + command] = originCommand.bind(redis);
  redis[command] = function () {
    var args = [].slice.call(arguments);
    return Promise.race([
      promiseDelay(ms, command, args),
      originCommand.apply(redis, args)
    ]);
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
