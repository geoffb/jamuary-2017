"use strict";

let object = require("util/object");
let Emitter = require("util/Emitter");

var exports = module.exports = function () {
  Emitter.call(this);

  this.width = 0;
  this.height = 0;

  let image = this.image = new Image();
  image.onload = this._onImageLoad.bind(this);
};

let proto = object.extend(exports, Emitter);

proto.load = function (url) {
  this.image.src = url;
};

proto._onImageLoad = function () {
  this.width = this.image.width;
  this.height = this.image.height;
  this.emit("load", this);
};
