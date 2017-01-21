"use strict";

let Shooter = module.exports = function (data) {
  this.type = data.type !== void 0 ? data.type : null;
  this.distance = data.distance !== void 0 ? data.distance : 0.5;
  this.impulse = data.impulse !== void 0 ? data.impulse : 1 / 150;
};

Shooter.prototype.shoot = function () {
  let shot = this.entity.level.createEntity(this.type);

  let transform = shot.getComponent("transform");
  transform.moveToEntity(this.entity);
  transform.moveBy(
    this.entity.transform.direction.x * this.distance,
    this.entity.transform.direction.y * this.distance);

  let body = shot.getComponent("body");
  body.applyImpulse(
    this.entity.transform.direction.x * this.impulse,
    this.entity.transform.direction.y * this.impulse);

  this.entity.level.addEntity(shot);
};
