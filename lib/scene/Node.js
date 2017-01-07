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
  // Save context state so we can restore after transforming
  context.save();

  var rotated = this.rotation !== 0;
  var scaled = this.scaleX !== 1 || this.scaleY !== 1;

  if (rotated || scaled) {
    var hw = this.width / 2;
    var hh = this.height / 2;

    // Translate to node center for rotation and/or scale
    context.translate(this.x + hw, this.y + hh);

    // Rotate
    if (rotated) {
      context.rotate(this.rotation);
    }

    // Scale
    if (scaled) {
      context.scale(this.scaleX, this.scaleY);
    }

    // Translate back to upper left for drawing
    context.translate(-hw, -hh);
  } else {
    context.translate(this.x, this.y);
  }

  // Draw solid color if specified
  if (this.color) {
    context.fillStyle = this.color;
    context.fillRect(0, 0, this.width, this.height);
  }

  // Custom subclass rendering
  this._render(context);

  // TODO: Render children

  // Restore previous transforms, etc
  context.restore();
};

// Custom rendering; override in subclass
proto._render = function () {};
