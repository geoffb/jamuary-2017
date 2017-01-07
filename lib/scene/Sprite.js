"use strict";

let object = require("util/object");
let Node = require("./Node");
let atlas = require("./atlas");

var exports = module.exports = function (atlasKey) {
  Node.call(this);

  this.atlasKey = atlasKey || null;
};

let proto = object.extend(exports, Node);

proto._render = function (context) {
  let meta = atlas.get(this.atlasKey);
  context.drawImage(
    meta.texture.image,
    meta.x, meta.y, meta.width, meta.height,
    0, 0, this.width, this.height);
};

Object.defineProperty(proto, "atlasKey", {
  get: function () {
    return this._atlasKey;
  },
  set: function (key) {
    if (this._atlasKey === key) { return; }
    this._atlasKey = key;
    let meta = atlas.get(key);
    this.resize(meta.width, meta.height);
  }
});
