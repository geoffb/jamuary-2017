const Vector2 = require("math/Vector2");
const ENTITY_TYPES = require("./entityTypes");

let nextEntityId = 0;

var exports = module.exports = function (type) {
  let data = ENTITY_TYPES[type];
  this.id = nextEntityId++;
  this.type = type;
  this.position = new Vector2(0, 0);
  this.direction = new Vector2(1, 0);
  this.radius = 0.35;
  this.trigger = data.trigger || false;
  this.texture = isNaN(data.texture) ? -1 : data.texture;
  this.frames = data.frames || null;
  this.frameIndex = 0;
  this.frameDuration = data.frameDuration;
  this._frameElapsed = 0;
};

let proto = exports.prototype;

proto.rotate = function (angle) {
  this.direction.rotate(angle);
};

proto.update = function (dt) {
  if (this.frames) {
    this._frameElapsed += dt;
    if (this._frameElapsed >= this.frameDuration) {
      this._frameElapsed -= this.frameDuration;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      this.texture = this.frames[this.frameIndex];
    }
  }
};

proto.getBoundingBox = function () {
  let x = this.position.x;
  let y = this.position.y;
  let r = this.radius;
  return {
    x: x - r,
    y: y - r,
    width: x + r,
    height: y + r
  };
};
