var exports = module.exports = function (x, y) {
  this.set(x || 0, y || 0);
};

var proto = exports.prototype;

proto.set = function (x, y) {
  this.x = x;
  this.y = y;
  return this;
};

proto.copy = function (v) {
  return this.set(v.x, v.y);
};

proto.rotate = function (angle) {
  let x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
  let y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
  return this.set(x, y);
};

proto.scale = function (scalar) {
  return this.set(
    this.x * scalar,
    this.y * scalar);
};
