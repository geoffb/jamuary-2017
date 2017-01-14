const math = require("math");

var exports = module.exports = function () {
  this.x = 0;
  this.y = 0;
  this.direction = 0;
};

let proto = exports.prototype;

proto.rotate = function (angle) {
  this.direction = (this.direction + angle + math.TAU) % math.TAU;
};
