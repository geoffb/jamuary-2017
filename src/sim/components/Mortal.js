"use strict";

const object = require("util/object");
const Emitter = require("util/Emitter");

let Mortal = module.exports = function (data) {
  this.health = data.health !== void 0 ? data.health : 1;
};

object.extend(Mortal, Emitter);

Mortal.prototype.damage = function (damage) {
  this.health -= damage;
  this.emit("healthChange", this.health);
};
