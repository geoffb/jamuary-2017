"use strict";

var exports = module.exports = function () {
  this._observers = {};
};

var proto = exports.prototype;

proto.on = function (signal, callback, context, once) {
  let obvs = this._observers;
  if (!Array.isArray(obvs[signal])) {
    obvs[signal] = [];
  }
  obvs[signal].push({
    callback: callback,
    context: context,
    once: Boolean(once)
  });
};

proto.emit = function (signal) {
  let obvs = this._observers[signal];
  if (!obvs) { return; }
  let args = Array.prototype.slice.call(arguments, 1);
  for (let i = obvs.length - 1; i >= 0; --i) {
    let obv = obvs[i];
    obv.callback.apply(obv.context, args);
    if (obv.once) {
      obvs.splice(i, 1);
    }
  }
};
