"use strict";

const object = require("util/object");
const math = require("math");
const Node = require("scene/Node");

const CELL_SIZE = 12;
const MAP_WIDTH = 11;
const MAP_HEIGHT = 9;

const WALL_COLOR = "#000000";
const FLOOR_COLOR = "#FFFFFF";

var exports = module.exports = function () {
  Node.call(this);

  this.resize(MAP_WIDTH * CELL_SIZE, MAP_HEIGHT * CELL_SIZE);

  this.level = null;
};

let proto = object.extend(exports, Node);

proto._render = function (ctx) {

  ctx.beginPath();
  ctx.rect(0, 0, this.width, this.height);
  ctx.clip();

  let player = this.level.player;

  let ox = player.position.x - MAP_WIDTH / 2;
  let oy = player.position.y - MAP_HEIGHT / 2;

  let tx = Math.floor(ox);
  let ty = Math.floor(oy);

  let nx = tx - ox;
  let ny = ty - oy;

  for (let y = ty; y <= ty + MAP_HEIGHT; ++y) {
    for (let x = tx; x <= tx + MAP_WIDTH; ++x) {
      let tile = this.level.map.get(x, y);
      ctx.fillStyle = tile === 0 ? FLOOR_COLOR : WALL_COLOR;
      ctx.fillRect(Math.round((x - tx + nx) * CELL_SIZE), Math.round((y - ty + ny) * CELL_SIZE), CELL_SIZE, CELL_SIZE);
    }
  }

  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc((player.position.x - ox) * CELL_SIZE, (player.position.y - oy) * CELL_SIZE, player.radius * CELL_SIZE, 0, math.TAU);
  ctx.fill();

};
