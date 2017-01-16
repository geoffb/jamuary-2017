"use strict";

let Hazard = module.exports = function (data) {
  this.damage = data.damage !== void 0 ? data.damage : 1;
};

Hazard.prototype.collide = function (entity) {
  if (!entity.hasComponent("mortal")) { return; }
  let mortal = entity.getComponent("mortal");
  mortal.damage(this.damage);
};
