"use strict";

let object = require("util/object");
let math = require("math");
let Node = require("./Node");
let Sprite = require("./Sprite");
let assets = require("./assets");

var exports = module.exports = function () {
  Node.call(this);
  this.map = null;
  this.textureKey = null;
};

let proto = object.extend(exports, Node);

proto._render = function (context) {
  if (!this.map || !this.textureKey) { return; }

  let map = this.map;
  let cw = map.cellWidth;
  let ch = map.cellHeight;

  let info = assets.getTextureRegion(this.textureKey);
  let textureTileWidth = Math.floor(info.width / cw);

  for (let y = 0; y < map.height; ++y) {
    for (let x = 0; x < map.width; ++x) {
      let tile = map.get(x, y);
      let tileX = math.indexToX(tile, textureTileWidth);
      let tileY = math.indexToY(tile, textureTileWidth);
      context.drawImage(
        info.texture.image,
        tileX * cw, tileY * ch, cw, ch,
        x * cw, y * ch, cw, ch);
    }
  }

};
