"use strict";

var exports = module.exports = function (width, height) {
  this.cells = [];
  this.resize(width || 0, height || 0);
};

var proto = exports.prototype;

proto.resize = function (width, height) {
  this.width = width;
  this.height = height;

  this.cells.length = 0;
  for (let y = 0; y < height; ++y) {
    let row = [];
    for (let x = 0; x < width; ++x) {
      row.push(0);
    }
    this.cells.push(row);
  }
};

proto.get = function (x, y) {
  let cx = Math.floor(x);
  let cy = Math.floor(y);
  if (cx < 0 || cy < 0 || cx >= this.width || cy >= this.height) {
    return -1;
  } else {
    return this.cells[cy][cx];
  }
};

proto.set = function (x, y, value) {
  this.cells[y][x] = value;
};

proto.fill = function (value) {
  for (let y = 0; y < this.height; ++y) {
    for (let x = 0; x < this.width; ++x) {
      this.set(x, y, value);
    }
  }
};
