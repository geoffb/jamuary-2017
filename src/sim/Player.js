const Vector2 = require("math/Vector2");

var exports = module.exports = function () {
  this.position = new Vector2(0, 0);
  this.direction = new Vector2(1, 0);
  this.radius = 0.5;
};

let proto = exports.prototype;

proto.rotate = function (angle) {
  this.direction.rotate(angle);
};
