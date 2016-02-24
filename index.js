'use strict';

var commands = require('ioredis-commands');

function timeoutAll(redis, ms) {
  Object.keys(commands).forEach(function (command) {
    timeout(command, ms, redis);
  });

  return redis;
}

function timeout(command, ms, redis) {
  var originCommand = redis['_' + command] || redis[command];
  redis['_' + command] = originCommand;
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
