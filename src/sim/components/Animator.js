let Animator = module.exports = function (data) {
  this.frames = data.frames !== void 0 ? data.frames : null;
  this.duration = data.duration !== void 0 ? data.duration : 200;
  this._frameIndex = 0;
  this._elapsed = 0;
};

Animator.prototype.update = function (dt) {
  this._elapsed += dt;
  if (this._elapsed >= this.duration) {
    this._elapsed -= this.duration;
    this._frameIndex = (this._frameIndex + 1) % this.frames.length;
    let sprite = this.entity.getComponent("sprite");
    sprite.texture = this.frames[this._frameIndex];
  }
};
