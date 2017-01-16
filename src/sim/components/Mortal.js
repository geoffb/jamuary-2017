let Mortal = module.exports = function (data) {
  this.health = data.health !== void 0 ? data.health : 1;
};

Mortal.prototype.damage = function (damage) {
  this.health -= damage;
  if (this.health <= 0) {
    // TODO: die!
  }
};
