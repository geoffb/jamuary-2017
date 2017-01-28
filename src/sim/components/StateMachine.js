"use strict";

const STATES = require("../states");

let StateMachine = module.exports = function (data) {
  this._states = [];
  this._data = [];

  if (data.state) {
    this.push(data.state, data.data);
  }
};

StateMachine.prototype.update = function (dt) {
  if (this._states.length < 1) { return; }
  var state = this._states[this._states.length - 1];
  state.update.call(this, dt);
};

StateMachine.prototype.push = function (key, data) {
  var state = new STATES[key](data);
  this._states.push(state);
  this._data.push(data);
  state.enter.call(this);
};

StateMachine.prototype.pop = function () {
  var state = this._states.pop();
  this._data.pop();
  state.exit.call(this);
};
