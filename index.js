/**
 * @module: ln-aspect
 * @author: wanglingdao <wanglingdao00@gmail.com> - 2015-05-01 23:01:56
 *
 * Aspect
 * ---------------------
 * fork from:
 *  - https://github.com/aralejs/base/blob/master/src/aspect.js
 * Thanks to:
 *  - http://yuilibrary.com/yui/docs/api/classes/Do.html
 *  - http://code.google.com/p/jquery-aop/
 *  - http://lazutkin.com/blog/2008/may/18/aop-aspect-javascript-dojo/
 */

'use strict';

// Helpers
// -------

var eventSplitter = /\s+/;


function getMethod(host, methodName) {
  var method = host[methodName];
  if (!method) {
    throw new Error('Invalid method name: ' + methodName);
  }
  return method;
}

function wrap(methodName) {
  /*jshint validthis:true */
  var old = this[methodName];

  this[methodName] = function() {
    var args = Array.prototype.slice.call(arguments);
    var beforeArgs = ['before:' + methodName].concat(args);

    // prevent if trigger return false
    if (this.trigger.apply(this, beforeArgs) === false) {
      return;
    }

    var ret = old.apply(this, arguments);
    var afterArgs = ['after:' + methodName, ret].concat(args);
    this.trigger.apply(this, afterArgs);

    return ret;
  };

  this[methodName].__isAspected = true;
}

/*jshint maxparams:4 */
function weave(when, methodName, callback, context) {
  var names = methodName.split(eventSplitter);
  var name, method;

  /*jshint validthis:true */
  while ((name = names.shift())) {
    method = getMethod(this, name);
    if (!method.__isAspected) {
      wrap.call(this, name);
    }
    this.on(when + ':' + name, callback, context);
  }

  return this;
}

// 在指定方法执行前，先执行 callback
exports.before = function(methodName, callback, context) {
  return weave.call(this, 'before', methodName, callback, context);
};

// 在指定方法执行后，再执行 callback
exports.after = function(methodName, callback, context) {
  return weave.call(this, 'after', methodName, callback, context);
};
