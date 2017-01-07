"use strict";

let Texture = require("draw/Texture");

const TEXTURE_CACHE = {};
const META_CACHE = {};

exports.load = function (url, meta) {
  let texture = TEXTURE_CACHE[url] = new Texture();
  texture.load(url);
  for (let key in meta) {
    META_CACHE[key] = meta[key];
    META_CACHE[key].texture = texture;
  }
};

exports.get = function (key) {
  let meta = META_CACHE[key];
  return meta;
};
