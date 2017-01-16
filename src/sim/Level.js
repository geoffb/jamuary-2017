const Map = require("math/Map");
const QuadTree = require("math/QuadTree");
const collision = require("math/collision");
const Random = require("math/Random");
const Entity = require("./Entity");
const MAPS = require("./maps");

const random = new Random();

const ROOM_WIDTH = 15;
const ROOM_HEIGHT = 11;

const TILE_SYMBOLS = {
  ".": 0,
  "#": 1
};

const ENTITY_SYMBOLS = {
  "@": "playerStart",
  "b": "bat"
};

var exports = module.exports = function () {
  this.levelKey = null;
  this.player = new Entity("player");
  this.map = new Map();
  this.quadTree = new QuadTree();
  this.entities = [];
};

var proto = exports.prototype;

proto._buildRoom = function (roomX, roomY, data) {
  let map = this.map;
  let entities = this.entities;

  let ox = roomX * ROOM_WIDTH;
  let oy = roomY * ROOM_HEIGHT;

  for (let y = 0; y < ROOM_HEIGHT; ++y) {
    for (let x = 0; x < ROOM_WIDTH; ++x) {
      let symbol = data[y][x];
      if (TILE_SYMBOLS.hasOwnProperty(symbol)) {
        map.set(ox + x, oy + y, TILE_SYMBOLS[symbol]);
      } else if (ENTITY_SYMBOLS[symbol]) {
        map.set(ox + x, oy + y, 0);
        let entity = new Entity(ENTITY_SYMBOLS[symbol]);
        entity.position.set(ox + x + 0.5, oy + y + 0.5);
        entities.push(entity);
      }
    }
  }
};

proto.load = function (key) {
  this.levelKey = key;

  let level = this.getLevelData();
  let layout = level.layout;

  // Reset entities
  let entities = this.entities;
  entities.length = 0;

  // Initialize map
  let map = this.map;
  map.resize(
    layout[0].length * ROOM_WIDTH,
    layout.length * ROOM_HEIGHT);
  map.fill(-1);

  // Iterate over layout and plug in rooms
  for (let y = 0; y < layout.length; ++y) {
    let row = layout[y];
    for (let x = 0; x < row.length; ++x) {
      let roomKey = row[x];
      if (roomKey === ".") { continue; }
      this._buildRoom(x, y, level.rooms[roomKey]);
    }
  }

  for (let i = 0; i < entities.length; ++i) {
    let entity = entities[i];
    if (entity.type !== "playerStart") { continue; }
    this.player.position.copy(entity.position);
    break;
  }

  this.player.direction.set(0, -1);
  this.entities.push(this.player);
};

proto.getLevelData = function () {
  return MAPS[this.levelKey];
};

proto.update = function (dt) {
  this.quadTree.clear();

  for (let i = 0; i < this.entities.length; ++i) {
    let entity = this.entities[i];
    entity.update(dt);
    let bounds = entity.getBoundingBox();
    bounds.entity = entity;
    this.quadTree.insert(bounds);
  }

  // Entity/entity collision
  for (let i = 0; i < this.entities.length; ++i) {
    let entity = this.entities[i];
    let bounds = entity.getBoundingBox();
    let nearby = this.quadTree.retrieve(bounds);
    for (let i = 0; i < nearby.length; ++i) {
      let otherBounds = nearby[i];
      let other = otherBounds.entity;
      if (entity.id === other.id) {
        continue;
      }
      if (collision.testCircleCircle(
        entity.position.x, entity.position.y, entity.radius,
        other.position.x, other.position.y, other.radius
      )) {
        console.info("COLLIDE: %s with %s", entity.type, other.type);
      }
    }
  }


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
