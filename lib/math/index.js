"use strict";

exports.TAU = Math.PI * 2;

exports.xyToIndex = function (x, y, width) {
  return y * width + x;
};

exports.indexToX = function (index, width) {
  return index % width;
};

exports.indexToY = function (index, width) {
  return Math.floor(index / width);
};
