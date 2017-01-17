let Door = module.exports = function (data) {
  this.locked = data.locked !== void 0 ? data.locked : false;
};

Door.prototype.open = function () {
  let map = this.entity.level.map;
  let transform = this.entity.getComponent("transform");
  let x = Math.floor(transform.position.x);
  let y = Math.floor(transform.position.y);
  map.set(x, y, 0);
};

Door.prototype.close = function () {
  let map = this.entity.level.map;
  let transform = this.entity.getComponent("transform");
  let x = Math.floor(transform.position.x);
  let y = Math.floor(transform.position.y);
  map.set(x, y, 2);
};

Door.prototype.add = function () {
  this.close();
};

Door.prototype.trigger = function (entity) {
  if (this.locked) {
    if (entity.hasComponent("inventory")) {
      let inventory = entity.getComponent("inventory");
      if (inventory.has("key")) {
        inventory.remove("key");
        this.open();
      }
    }
  } else {
    this.open();
  }
};
