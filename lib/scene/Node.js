"use strict";

var exports = module.exports = function () {
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;

  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;

  this.color = null;
};

var proto = exports.prototype;

proto.resize = function (width, height) {
  this.width = width;
  this.height = height;
};

proto.render = function (context) {
  context.save();

  // Transform
  context.translate(this.x + this.width / 2, this.y + this.height / 2);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);

  context.translate(-this.width / 2, -this.height / 2);

  if (this.color) {
    context.fillStyle = this.color;
    context.fillRect(0, 0, this.width, this.height);
  }

  context.restore();
};
