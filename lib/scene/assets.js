"use strict";

let Texture = require("draw/Texture");

// Texture cache
const TEXTURE_CACHE = {};

// Cache of texture region coords
const META_CACHE = {};

exports.loadTexture = function (key, url) {
  let texture = TEXTURE_CACHE[key] = new Texture();
  texture.on("load", function (texture) {
    META_CACHE[key].width = texture.width;
    META_CACHE[key].height = texture.height;
  });
  META_CACHE[key] = { texture: texture, x: 0, y: 0, width: 0, height: 0 };
  texture.load(url);
  return texture;
};

exports.getTexture = function (key) {
  return TEXTURE_CACHE[key];
};

exports.loadTextureAtlas = function (key, url, meta) {
  let texture = exports.loadTexture(key, url);
  for (let subkey in meta) {
    META_CACHE[subkey] = meta[subkey];
    META_CACHE[subkey].texture = texture;
  }
};

exports.getTextureRegion = function (key) {
  let meta = META_CACHE[key];
  return meta;
};
