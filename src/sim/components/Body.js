"use strict";

const Vector2 = require("math/Vector2");

let Body = module.exports = function (data) {
  this.velocity = new Vector2();
  this.fragile = data.fragile !== void 0 ? data.fragile : false;
};

Body.prototype.update = function (dt) {
  this.entity.level.moveEntity(this.entity, this.velocity.x * dt, this.velocity.y * dt);
};

Body.prototype.collideMap = function () {
  if (this.fragile) {
    this.entity.removeFromLevel();
  }
};

Body.prototype.applyImpulse = function (x, y) {
  this.velocity.x += x;
  this.velocity.y += y;
};
