const collision = require("math/collision");

let Collider = module.exports = function (data) {
  this.radius = data.radius === void 0 ? 0.35 : data.radius;
  this.trigger = data.trigger === void 0 ? false : data.trigger;
};

Collider.prototype.getBoundingBox = function () {
  let pos = this.entity.getComponent("transform").position;
  let r = this.radius;
  return {
    x: pos.x - r,
    y: pos.y - r,
    width: pos.x + r,
    height: pos.y + r
  };
};

Collider.prototype.collidesWithEntity = function (entity) {
  let transform = this.entity.getComponent("transform");
  let bTransform = entity.getComponent("transform");
  let bCollider = entity.getComponent("collider");
  return collision.testCircleCircle(
    transform.position.x, transform.position.y, this.radius,
    bTransform.position.x, bTransform.position.y, bCollider.radius);
};

Collider.prototype.collide = function (entity) {
  // separete
};
