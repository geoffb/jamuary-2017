"use strict";

let Vector2 = function (x, y) {
  this.set(x || 0, y || 0);
};

module.exports = Vector2;

Vector2.prototype.set = function (x, y) {
  this.x = x;
  this.y = y;
  return this;
};

Vector2.prototype.copy = function (v) {
  return this.set(v.x, v.y);
};

Vector2.prototype.rotate = function (angle) {
  let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
  let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
  return this.set(x, y);
};

Vector2.prototype.scale = function (scalar) {
  return this.set(
    this.x * scalar,
    this.y * scalar);
};

Object.defineProperty(Vector2.prototype, "magnitude", {
  get: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
});
