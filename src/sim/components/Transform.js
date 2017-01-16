const Vector2 = require("math/Vector2");

let Transform = module.exports = function () {
  this.position = new Vector2(0, 0);
  this.direction = new Vector2(1, 0);
};

Transform.prototype.moveTo = function (x, y) {
  this.position.set(x, y);
};

Transform.prototype.moveToEntity = function (entity) {
  let transform = entity.getComponent("transform");
  this.moveTo(transform.position.x, transform.position.y);
};

Transform.prototype.rotate = function (angle) {
  this.direction.rotate(angle);
};
