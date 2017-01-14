var exports = module.exports = function (x, y) {
  this.set(x || 0, y || 0);
};

var proto = exports.prototype;

proto.set = function (x, y) {
  this.x = x;
  this.y = y;
};
