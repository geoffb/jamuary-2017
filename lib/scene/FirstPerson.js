"use strict";

const object = require("util/object");
const Vector2 = require("math/Vector2");
const Node = require("./Node");
const assets = require("./assets");

const CAMERA_PLANE_LENGTH = 0.66;
const TEXTURE_SIZE = 32 * 4;

var exports = module.exports = function () {
  Node.call(this);

  this.level = null;
  this.textureKey = null;

  this._zbuffer = null;

  this.camera = {
    position: new Vector2(0, 0),
    direction: new Vector2(1, 0),
    plane: new Vector2(0, CAMERA_PLANE_LENGTH)
  };
};

let proto = object.extend(exports, Node);

proto.setCamera = function (posX, posY, dirX, dirY) {
  let cam = this.camera;
  cam.position.set(posX, posY);
  cam.direction.set(dirX, dirY);
  // plane is perpendicular to direction
  cam.plane.set(-dirY, dirX).scale(CAMERA_PLANE_LENGTH);
};

proto._render = function (context) {
  if (!this.level) { return; }
  let data = this.level.getLevelData();

  // Draw ceiling
  context.fillStyle = data.ceilColor;
  context.fillRect(0, 0, this.width, this.height / 2);

  // Draw floor
  context.fillStyle = data.floorColor;
  context.fillRect(0, this.height / 2, this.width, this.height);

  if (!this.level || !this.textureKey) { return; }

  var cam = this.camera;
  var texture = assets.getTexture(this.textureKey);
  var map = this.level.map;

  this._zbuffer = new Array(this.width);

  var x, camX, rayPosX, rayPosY, rayDirX, rayDirY, mapX, mapY,
    sideDistX, sideDistY, perpWallDist, deltaDistX, deltaDistY,
    stepX, stepY, hit, side, lineHeight, drawStart, drawEnd, tile,
    wallX, texX;

  for (x = 0; x < this.width; ++x) {
    camX = 2 * x / this.width - 1; // x coordinate in camera space

    rayPosX = cam.position.x;
    rayPosY = cam.position.y;

    rayDirX = cam.direction.x + cam.plane.x * camX;
    rayDirY = cam.direction.y + cam.plane.y * camX;

    // Which map square are we in?
    mapX = Math.floor(rayPosX);
    mapY = Math.floor(rayPosY);

    sideDistX = 0;
    sideDistY = 0;
    perpWallDist = 0;

    deltaDistX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX * rayDirX));
    deltaDistY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY * rayDirY));

    stepX = 0;
    stepY = 0;
    hit = 0;
    side = 0;

    // calculate step and sideDist
    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (rayPosX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1.0 - rayPosX) * deltaDistX;
    }
    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (rayPosY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1.0 - rayPosY) * deltaDistY;
    }

    // perform DDA
    while (hit === 0) {

      // jump to next map square
      if (sideDistX < sideDistY) {
        sideDistX = sideDistX + deltaDistX;
        mapX = mapX + stepX;
        side = 0;
      } else {
        sideDistY = sideDistY + deltaDistY;
        mapY = mapY + stepY;
        side = 1;
      }

      tile = map.get(mapX, mapY);
      if (tile > 0 || tile === -1) { hit = 1; }
    }

    // Calculate distance projected on camera direction (oblique distance will give fisheye effect!)
    if (side === 0) {
      perpWallDist = (mapX - rayPosX + (1 - stepX) / 2) / rayDirX;
    } else {
      perpWallDist = (mapY - rayPosY + (1 - stepY) / 2) / rayDirY;
    }

    lineHeight = this .height / perpWallDist;

    drawStart = -lineHeight / 2 + this.height / 2;
    drawEnd = lineHeight / 2 + this.height / 2;

    if (side === 0) {
      wallX = rayPosY + perpWallDist * rayDirY;
    } else {
      wallX = rayPosX + perpWallDist * rayDirX;
    }
    wallX -= Math.floor(wallX);

    if (tile > 0) {

      //x coordinate on the texture
      texX = Math.floor(wallX * TEXTURE_SIZE);
      // flip texture x coordinate
      if (
        (side === 0 && rayDirX < 0) ||
        (side === 1 && rayDirY > 0)
      ) {
        texX = TEXTURE_SIZE - texX - 1;
      }

      // offset texture coordinate within texture
      texX += (tile - 1) * TEXTURE_SIZE;

      context.drawImage(texture.image, texX, 0, 1, TEXTURE_SIZE, x, drawStart, 1, drawEnd - drawStart);

      // Shading
      if (side === 1) {
        context.fillStyle = "#000000";
        context.globalAlpha = 0.25;
        context.fillRect(x, drawStart, 1, drawEnd - drawStart);
        context.globalAlpha = 1;
      }
    }

    this._zbuffer[x] = perpWallDist;

    // FLOOR RENDERING
    // Commented out because it's SLOOOOOOOOOOOOOW

    //x, y position of the floor texel at the bottom of the wall
    // var floorXWall, floorYWall;
    //
    // // 4 different wall directions possible
    // if (side === 0 && rayDirX > 0) {
    //   floorXWall = mapX;
    //   floorYWall = mapY + wallX;
    // } else if (side === 0 && rayDirX < 0) {
    //   floorXWall = mapX + 1.0;
    //   floorYWall = mapY + wallX;
    // } else if (side === 1 && rayDirY > 0) {
    //   floorXWall = mapX + wallX;
    //   floorYWall = mapY;
    // } else {
    //   floorXWall = mapX + wallX;
    //   floorYWall = mapY + 1.0;
    // }
    //
    // var distWall = perpWallDist, distPlayer = 0, currentDist;
    //
    // if (drawEnd < 0) drawEnd = this.height; //becomes < 0 when the integer overflows
    //
    // //draw the floor from drawEnd to the bottom of the screen
    // for (var y = drawEnd + 1; y < this.height; y++) {
    //   currentDist = this.height / (2.0 * y - this.height);
    //   var weight = (currentDist - distPlayer) / (distWall - distPlayer);
    //   var currentFloorX = weight * floorXWall + (1.0 - weight) * cam.position.x;
    //   var currentFloorY = weight * floorYWall + (1.0 - weight) * cam.position.y;
    //
    //   var floorTexX, floorTexY;
    //   floorTexX = Math.floor(currentFloorX * TEXTURE_SIZE) % TEXTURE_SIZE;
    //   floorTexY = Math.floor(currentFloorY * TEXTURE_SIZE) % TEXTURE_SIZE;
    //
    //   // floor
    //   context.drawImage(texture.image, floorTexX, TEXTURE_SIZE + floorTexY, 1, 1, x, y, 1, 1);
    //
    //   // //floor
    //   // buffer[y][x] = (texture[3][texWidth * floorTexY + floorTexX] >> 1) & 8355711;
    //   // //ceiling (symmetrical!)
    //   // buffer[h - y][x] = texture[6][texWidth * floorTexY + floorTexX];
    // }
  }

  this._drawEntities(context);
};

proto._drawEntities = function (context) {
  var entities = this.level.entities;
  var len = entities.length;
  var order = new Array(len);
  var distance = new Array(len);

  var texture = assets.getTexture(this.textureKey);

  var cam = this.camera;
  let camX = cam.position.x;
  let camY = cam.position.y;

  for (let i = 0; i < len; ++i) {
    let entity = entities[i];
    order[i] = i;
    distance[i] = ((camX - entity.position.x) * (camX - entity.position.x) + (camY - entity.position.y) * (camY - entity.position.y));
  }

  order.sort(function (a, b) {
    return distance[b] - distance[a];
  });

  for (let i = 0; i < len; ++i) {
    var entityIndex = order[i];
    var entity = entities[entityIndex];
    if (entity.texture === -1) { continue; }

    var entityX = entity.position.x - camX;
    var entityY = entity.position.y - camY;

    //required for correct matrix multiplication
    var invDet = 1.0 / (cam.plane.x * cam.direction.y - cam.direction.x * cam.plane.y);

    var transformX = invDet * (cam.direction.y * entityX - cam.direction.x * entityY);
    var transformY = invDet * (-cam.plane.y * entityX + cam.plane.x * entityY); //this is actually the depth inside the screen, that what Z is in 3D

    var spriteX = Math.round((this.width / 2) * (1 + transformX / transformY));

    //calculate height of the sprite on screen
    var spriteHeight = Math.abs(Math.round(this.height / (transformY))); //using "transformY" instead of the real distance prevents fisheye
    //calculate lowest and highest pixel to fill in current stripe
    var  drawStartY = -spriteHeight / 2 + this.height / 2;
    var drawEndY = spriteHeight / 2 + this.height / 2;

    //calculate width of the sprite
    var spriteWidth = Math.abs(Math.round(this.height / (transformY)));
    var drawStartX = Math.round(-spriteWidth / 2 + spriteX);
    var drawEndX = Math.round(spriteWidth / 2 + spriteX);

    // loop through every vertical stripe of the sprite on screen
    for (let x = drawStartX; x < drawEndX; ++x) {
      if (transformY > 0 && x > 0 && x < this.width && transformY < this._zbuffer[x]) {
        var texX = Math.round((x - (-spriteWidth / 2 + spriteX)) * TEXTURE_SIZE / spriteWidth);
        texX += entity.texture * TEXTURE_SIZE;
        context.drawImage(texture.image,
          texX, TEXTURE_SIZE * 2, 1, TEXTURE_SIZE,
          x, ~~drawStartY, 1, ~~(drawEndY - drawStartY));
      }
    }
  }
};
