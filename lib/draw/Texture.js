"use strict";

var exports = module.exports = function () {
  this.width = 0;
  this.height = 0;

  let image = this.image = new Image();
  image.onload = this._onImageLoad.bind(this);
};

let proto = exports.prototype;

proto.load = function (url) {
  this.image.src = url;
};

proto._onImageLoad = function () {
  this.width = this.image.width;
  this.height = this.image.height;
};
