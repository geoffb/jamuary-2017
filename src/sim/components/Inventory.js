"use strict";

let Inventory = module.exports = function () {
  this.items = {};
};

Inventory.prototype.has = function (type) {
  return this.items[type] > 0;
};

Inventory.prototype.add = function (type) {
  if (this.items[type] === void 0) {
    this.items[type] = 0;
  }
  this.items[type] += 1;
};

Inventory.prototype.remove = function (type) {
  if (this.has(type)) {
    this.items[type] -= 1;
  }
};
