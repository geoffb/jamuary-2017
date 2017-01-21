"use strict";

let Pickup = module.exports = function (data) {
  this.type = data.type !== void 0 ? data.type : null;
};

Pickup.prototype.trigger = function (entity) {
  if (entity.hasComponent("inventory")) {
    let inventory = entity.getComponent("inventory");
    inventory.add(this.type);
    this.entity.removeFromLevel();
  }
};
