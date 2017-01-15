var Map = require("math/Map");
var collision = require("math/collision");
var Player = require("./Player");

var exports = module.exports = function () {
  this.player = new Player();
  this.map = new Map();
  this.entities = [];
};

var proto = exports.prototype;

proto.init = function () {
  this.map.resize(32, 12);
  this.map.cells = [
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 2, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  this.player.position.set(7.5, 5.5);
  this.player.direction.set(0, -1);

  this.entities.push(
    { x: 3.5, y: 3.5, t: 0 },
    { x: 4.5, y: 4.5, t: 0 },
    { x: 5.5, y: 5.5, t: 0 },
    { x: 3.5, y: 6.5, t: 0 },
    { x: 4.5, y: 7.5, t: 0 },
    { x: 16.5, y: 5.5, t: 1 },
    { x: 19.5, y: 3.5, t: 1 }
  );
};

proto._testCircleMapCollision = function (cx, cy, radius) {
  let ox = Math.floor(cx - radius);
  let oy = Math.floor(cy - radius);
  let tx = Math.ceil(cx + radius);
  let ty = Math.ceil(cy + radius);
  for (let y = oy; y <= ty; ++y) {
    for (let x = ox; x <= tx; ++x) {
      let tile = this.map.get(x, y);
      if (tile === 0) { continue; }
      if (collision.testCircleRect(cx, cy, radius, x, y, 1, 1)) {
        return true;
      }
    }
  }
  return false;
};

proto.moveEntity = function (entity, distance) {
  let dx = entity.direction.x * distance;
  let dy = entity.direction.y * distance;
  if (!this._testCircleMapCollision(entity.position.x + dx, entity.position.y, entity.radius)) {
    entity.position.x += dx;
  }
  if (!this._testCircleMapCollision(entity.position.x, entity.position.y + dy, entity.radius)) {
    entity.position.y += dy;
  }
};
