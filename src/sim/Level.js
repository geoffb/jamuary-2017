const Map = require("math/Map");
const QuadTree = require("math/QuadTree");
const collision = require("math/collision");
const Entity = require("./Entity");
const LEVELS = require("./levels");

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

let Level = module.exports = function () {
  this.levelKey = null;
  this.player = new Entity("player");
  this.map = new Map();
  this.quadTree = new QuadTree();
  this.entities = [];
};

Level.prototype._buildRoom = function (roomX, roomY, data) {
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
        let transform = entity.getComponent("transform");
        transform.moveTo(ox + x + 0.5, oy + y + 0.5);
        entities.push(entity);
      }
    }
  }
};

Level.prototype.load = function (key) {
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

  let playerTransform = this.player.getComponent("transform");
  for (let i = 0; i < entities.length; ++i) {
    let entity = entities[i];
    if (entity.type !== "playerStart") { continue; }
    playerTransform.moveToEntity(entity);
    break;
  }
  playerTransform.direction.set(0, -1);

  this.entities.push(this.player);
};

Level.prototype.getLevelData = function () {
  return LEVELS[this.levelKey];
};

Level.prototype.update = function (dt) {
  let entities = this.entities;
  let quadTree = this.quadTree;
  let colliders = [];

  quadTree.clear();

  for (let i = 0; i < entities.length; ++i) {
    let entity = entities[i];
    entity.callComponents("update", dt);
    if (entity.hasComponent("collider")) {
      let collider = entity.getComponent("collider");
      let bounds = collider.getBoundingBox();
      bounds.entity = entity;
      quadTree.insert(bounds);
      colliders.push(entity);
    }
  }

  // Entity/entity collision
  for (let i = 0; i < colliders.length; ++i) {
    let entity = colliders[i];
    let collider = entity.getComponent("collider");
    let bounds = collider.getBoundingBox();
    let nearby = quadTree.retrieve(bounds);
    for (let i = 0; i < nearby.length; ++i) {
      let otherBounds = nearby[i];
      let other = otherBounds.entity;
      if (entity.id === other.id) {
        continue;
      }
      if (collider.collidesWithEntity(other)) {
        if (collider.trigger) {
          entity.callComponents("trigger", other);
        } else {
          entity.callComponents("collide", other);
        }
      }
    }
  }
};

Level.prototype._testCircleMapCollision = function (cx, cy, radius) {
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

Level.prototype.moveEntity = function (entity, distance) {
  let transform = entity.getComponent("transform");
  let collider = entity.getComponent("collider");
  let dx = transform.direction.x * distance;
  let dy = transform.direction.y * distance;
  if (!this._testCircleMapCollision(transform.position.x + dx, transform.position.y, collider.radius)) {
    transform.position.x += dx;
  }
  if (!this._testCircleMapCollision(transform.position.x, transform.position.y + dy, collider.radius)) {
    transform.position.y += dy;
  }
};
