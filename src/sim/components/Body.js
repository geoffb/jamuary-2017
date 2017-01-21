"use strict";

const Vector2 = require("math/Vector2");

let Body = module.exports = function () {
  this.velocity = new Vector2();
};

Body.prototype.update = function (dt) {
  let transform = this.entity.getComponent("transform");
  transform.moveBy(this.velocity.x * dt, this.velocity.y * dt);
};

Body.prototype.applyImpulse = function (x, y) {
  this.velocity.x += x;
  this.velocity.y += y;
};
