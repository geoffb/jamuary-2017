"use strict";

let States = module.exports = function () {
  this._states = [];
  this._durations = {};
};

States.prototype.add = function (key, duration) {
  this._states.push(key);
  this._durations[key] = duration;
};

States.prototype.has = function (key) {
  return this._states.indexOf(key) !== -1;
};

States.prototype.update = function (dt) {
  for (let i = this._states.length - 1; i >=0; --i) {
    let key = this._states[i];
    this._durations[key] -= dt;
    if (this._durations[key] <= 0) {
      this._states.splice(i, 1);
      this._durations[key] = -1;
    }
  }
};
