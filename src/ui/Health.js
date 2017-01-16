"use strict";

const object = require("util/object");
const Node = require("scene/Node");
const assets = require("scene/assets");

const WIDTH = 16;
const HEIGHT = 16;
const SPACING = 2;

let Health = module.exports = function () {
  Node.call(this);
  this.amount = 1;
};

object.extend(Health, Node);

Health.prototype._render = function (ctx) {
  let info = assets.getTextureRegion("heart");
  for (let i = 0; i < this.amount; ++i) {
    ctx.drawImage(
      info.texture.image,
      info.x, info.y, info.width, info.height,
      i * (WIDTH + SPACING), 0, WIDTH, HEIGHT);
  }
};
