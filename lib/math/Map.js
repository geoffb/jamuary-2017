"use strict";

var exports = module.exports = function (width, height, cellWidth, cellHeight) {
  this.cells = [];
  this.resize(width || 0, height || 0);
  this.resizeCells(cellWidth || 0, cellHeight || 0);
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

proto.resizeCells = function (cellWidth, cellHeight) {
  this.cellWidth = cellWidth;
  this.cellHeight = cellHeight;
};

proto.get = function (x, y) {
  return this.cells[y][x];
};

proto.set = function (x, y, value) {
  this.cells[y][x] = value;
};
