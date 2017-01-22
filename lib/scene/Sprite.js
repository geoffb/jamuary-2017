"use strict";

const object = require("util/object");
const Node = require("./Node");
const assets = require("./assets");

let Sprite = module.exports = function (atlasKey) {
  Node.call(this);

  this.atlasKey = atlasKey || null;
};

object.extend(Sprite, Node);

Sprite.prototype._render = function (context) {
  exports.draw(context, this.atlasKey, 0, 0, this.width, this.height);
};

Object.defineProperty(Sprite.prototype, "atlasKey", {
  get: function () {
    return this._atlasKey;
  },
  set: function (key) {
    if (this._atlasKey === key) { return; }
    this._atlasKey = key;
    let meta = assets.getTextureRegion(key);
    this.resize(meta.width, meta.height);
  }
});

// Static
Sprite.draw = function (context, atlasKey, x, y, width, height) {
  let meta = assets.getTextureRegion(atlasKey);
  context.drawImage(
    meta.texture.image,
    meta.x, meta.y, meta.width, meta.height,
    x, y, width, height);
};
