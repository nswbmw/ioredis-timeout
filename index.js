'use strict';

var commands = require('ioredis-commands');

function timeout(redis, ms) {
  Object.keys(commands).forEach(function (command) {
    var originCommand = redis[command];
    redis[command] = function () {
      var args = [].slice.call(arguments);
      return Promise.race([
        promiseDelay(ms, command, args),
        originCommand.apply(redis, args)
      ]);
    };
  });

  return redis;
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

module.exports = timeout;
