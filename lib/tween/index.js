"use strict";

const math = require("math");

// Active tween queue
let tweens = [];

// Tween some properties of an object to specified values
exports.to = function (target, props, duration) {
  tweens.push({
    target,
    from: null,
    to: props,
    duration: duration,
    elapsed: 0
  });
};

// Update active tweens
exports.update = function (dt) {
  for (let i = tweens.length - 1; i >= 0; --i) {
    let tween = tweens[i];

    // Default from properties to current target values
    if (tween.from === null) {
      tween.from = {};
      for (let key in tween.to) {
        tween.from[key] = tween.target[key];
      }
    }

    tween.elapsed += dt;

    // Calculate time normal
    let t = math.clamp(tween.elapsed / tween.duration, 0, 1);

    // Update target properties
    for (let key in tween.to) {
      tween.target[key] = math.lerp(tween.from[key], tween.to[key], t);
    }

    // Remove tween, if complete
    if (t === 1) {
      tweens.splice(i, 1);
    }
  }
};
