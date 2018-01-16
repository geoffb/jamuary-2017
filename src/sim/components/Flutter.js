"use strict";

let Flutter = function (data) {
  this.speed = 0.001;
};

module.exports = Flutter;

Flutter.prototype.add = function () {
  let transform = this.entity.getComponent("transform");
  let r = Math.random() * (Math.PI * 2);
  transform.direction.setAngle(r);
};

Flutter.prototype.update = function (dt) {
  let transform = this.entity.getComponent("transform");
  let distance = this.speed * dt;
  this.entity.level.moveEntity(this.entity,
    transform.direction.x * distance,
    transform.direction.y * distance);
};

Flutter.prototype.collideMap = function (collideX, collideY) {
  let transform = this.entity.getComponent("transform");
  if (collideX) {
    transform.direction.x *= -1;
  }
  if (collideY) {
    transform.direction.y *= -1;
  }
};
