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

proto.raycast = function(x, y, angle, range) {
  var self = this;
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);
  var noWall = { length2: Infinity };
  return ray({ x: x, y: y, height: 0, distance: 0 });
  function ray(origin) {
    var stepX = step(sin, cos, origin.x, origin.y);
    var stepY = step(cos, sin, origin.y, origin.x, true);
    var nextStep = stepX.length2 < stepY.length2
      ? inspect(stepX, 1, 0, origin.distance, stepX.y)
      : inspect(stepY, 0, 1, origin.distance, stepY.x);
    if (nextStep.distance > range) return [origin];
    return [origin].concat(ray(nextStep));
  }
  function step(rise, run, x, y, inverted) {
    if (run === 0) return noWall;
    var dx = run > 0 ? Math.floor(x + 1) - x : Math.ceil(x - 1) - x;
    var dy = dx * (rise / run);
    return {
      x: inverted ? y + dy : x + dx,
      y: inverted ? x + dx : y + dy,
      length2: dx * dx + dy * dy
    };
  }
  function inspect(step, shiftX, shiftY, distance, offset) {
    var dx = cos < 0 ? shiftX : 0;
    var dy = sin < 0 ? shiftY : 0;
    step.height = self.get(Math.floor(step.x - dx), Math.floor(step.y - dy));
    step.distance = distance + Math.sqrt(step.length2);
    if (shiftX) step.shading = cos < 0 ? 2 : 0;
    else step.shading = sin < 0 ? 2 : 1;
    step.offset = offset - Math.floor(offset);
    return step;
  }
};
