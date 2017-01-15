const Random = module.exports = function () {};

Random.prototype._next = function () {
  return Math.random();
};

Random.prototype.integer = function (max) {
  return Math.round(this._next() * max);
};

Random.prototype.choice = function (items) {
  let index = this.integer(items.length - 1);
  return items[index];
};
