"use strict";

exports.createSurface = function (width, height) {
  let surface = document.createElement("canvas");
  surface.width = width;
  surface.height = height;
  return surface;
};
