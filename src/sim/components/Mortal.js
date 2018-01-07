"use strict";

const object = require("util/object");
const Emitter = require("util/Emitter");

let Mortal = module.exports = function (data) {
  Emitter.call(this);
  this.health = data.health !== void 0 ? data.health : 1;
};

object.extend(Mortal, Emitter);

Mortal.prototype.damage = function (damage) {
  let states = this.entity.getComponent("states");

  // Ignore damage if entity is immune
  if (states.has("immune")) { return; }

  // Reduce health
  this.health -= damage;

  // Grant a brief immunity
  states.add("immune", 400);

  this.emit("healthChange", this.health, -damage);

  // Check for death
  if (this.health <= 0) {
    this.entity.removeFromLevel();
  }
};
