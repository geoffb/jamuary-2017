"use strict";

let object = require("util/object");
let Node = require("./Node");
let assets = require("./assets");
var Camera = require("./util/Camera");

var exports = module.exports = function () {
  Node.call(this);
  this.map = null;
  this.textureKey = null;

  this.camera = new Camera();
  this.lightRange = 5;
};

let proto = object.extend(exports, Node);

proto.setCamera = function (x, y, direction) {
  this.camera.x = x;
  this.camera.y = y;
  this.camera.direction = direction;
};

proto._render = function (context) {
  context.fillStyle = "#04445C";
  context.fillRect(0, 0, this.width, this.height / 2);

  context.fillStyle = "#008080";
  context.fillRect(0, this.height / 2, this.width, this.height);


  if (!this.map || !this.textureKey) { return; }

  let map = this.map;
  let cam = this.camera;

  for (let column = 0; column < cam.resolution; column++) {
    let x = column / cam.resolution - 0.5;
    let angle = Math.atan2(x, cam.focalLength);
    var ray = map.raycast(cam.x, cam.y, cam.direction + angle, cam.range);
    this._drawColumn(context, column, ray, angle);
  }
};

proto._project = function (height, angle, distance) {
  var z = distance * Math.cos(angle);
  var wallHeight = this.height * height / z;
  var bottom = this.height / 2 * (1 + 1 / z);
  return {
    top: bottom - wallHeight,
    height: wallHeight
  };
};

proto._drawColumn = function (context, column, ray, angle) {
  var cam = this.camera;
  var spacing = this.width / cam.resolution;

  var texture = assets.getTexture(this.textureKey);
  var texCellSize = 128;

  var left = Math.floor(column * spacing);
  var width = Math.ceil(spacing);
  var hit = -1;
  while (++hit < ray.length && ray[hit].height <= 0);
  for (var s = ray.length - 1; s >= 0; s--) {
    var step = ray[s];
    if (s === hit) {
      var textureX = Math.floor(texCellSize * step.offset);
      var wall = this._project(step.height, angle, step.distance);
      context.globalAlpha = 1;
      context.drawImage(texture.image, textureX, 0, 1, texCellSize, left, wall.top, width, wall.height);
      // Wall shading
      context.fillStyle = "#000000";
      context.globalAlpha = Math.max((step.distance + step.shading) / this.lightRange - 2, 0);
      context.fillRect(left, wall.top, width, wall.height);
    }
  }
};
