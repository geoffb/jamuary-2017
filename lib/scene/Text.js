"use strict";

const object = require("util/object");
const draw = require("draw");
const Node = require("./Node");

let Text = module.exports = function (text, size, color, family) {
  Node.call(this);

  this._buffer = draw.createSurface(0, 0);
  this._bufferDirty = true;

  this.fontSize = size || 20;
  this.fontColor = color || "black";
  this.fontFamily = family || "sans-serif";
  this.text = text;
};

object.extend(Text, Node);

Text.prototype._render = function (context) {
  if (this._bufferDirty) {
    this._renderBuffer();
  }
  let buf = this._buffer;
  context.drawImage(buf, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
};

Text.prototype._getFont = function () {
  return this.fontSize + "px " + this.fontFamily;
};

Text.prototype._renderBuffer = function () {
  this._buffer.width = this.width;
  this._buffer.height = this.height;
  let bctx = this._buffer.getContext("2d");
  bctx.font = this._getFont();
  bctx.textBaseline = "middle";
  bctx.fillStyle = this.fontColor;
  bctx.fillText(this.text, 0, this.height / 2);
  this._bufferDirty = false;
};

Object.defineProperty(Text.prototype, "text", {
  get: function () {
    return this._text;
  },
  set: function (text) {
    if (this._text === text) { return; }
    this._text = text;
    let bctx = this._buffer.getContext("2d");
    bctx.font = this._getFont();
    let size = bctx.measureText(this._text);
    this.resize(size.width, this.fontSize);
    this._bufferDirty = true;
  }
});

Object.defineProperty(Text.prototype, "fontSize", {
  get: function () {
    return this._fontSize;
  },
  set: function (size) {
    if (this._fontSize === size) { return; }
    this._fontSize = size;
    this._bufferDirty = true;
  }
});

Object.defineProperty(Text.prototype, "fontColor", {
  get: function () {
    return this._fontColor;
  },
  set: function (color) {
    if (this._fontColor === color) { return; }
    this._fontColor = color;
    this._bufferDirty = true;
  }
});

Object.defineProperty(Text.prototype, "fontFamily", {
  get: function () {
    return this._fontFamily;
  },
  set: function (family) {
    if (this._fontFamily === family) { return; }
    this._fontFamily = family;
    this._bufferDirty = true;
  }
});
