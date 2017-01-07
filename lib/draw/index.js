exports.createSurface = function (width, height) {
  var surface = document.createElement("canvas");
  surface.width = width;
  surface.height = height;
  return surface;
};
