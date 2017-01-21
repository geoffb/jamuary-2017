"use strict";

let Hazard = module.exports = function (data) {
  this.damage = data.damage !== void 0 ? data.damage : 1;
  this.removeOnCollide = data.removeOnCollide !== void 0 ? data.removeOnCollide : false;
};

Hazard.prototype.collide = function (entity) {
  if (!entity.hasComponent("mortal")) { return; }
  let mortal = entity.getComponent("mortal");
  mortal.damage(this.damage);
  if (this.removeOnCollide) {
    this.entity.removeFromLevel();
  }
};
