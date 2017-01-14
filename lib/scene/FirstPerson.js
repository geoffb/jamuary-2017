"use strict";

const object = require("util/object");
const Vector2 = require("math/Vector2");
const Node = require("./Node");
const assets = require("./assets");

const CAMERA_PLANE_LENGTH = 0.66;

var exports = module.exports = function () {
  Node.call(this);

  this.map = null;
  this.textureKey = null;

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
  // Draw ceiling
  context.fillStyle = "#04445C";
  context.fillRect(0, 0, this.width, this.height / 2);

  // Draw floor
  context.fillStyle = "#008080";
  context.fillRect(0, this.height / 2, this.width, this.height);

  if (!this.map || !this.textureKey) { return; }

  var cam = this.camera;
  var texture = assets.getTexture(this.textureKey);
  var map = this.map;

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

    if (tile === 1) {
      if (side === 0) {
        wallX = rayPosY + perpWallDist * rayDirY;
      } else {
        wallX = rayPosX + perpWallDist * rayDirX;
      }
      wallX -= Math.floor(wallX);

      //x coordinate on the texture
      texX = Math.floor(wallX * texture.width);
      if (
        (side === 0 && rayDirX > 0) ||
        (side === 1 && rayDirY < 0)
      ) {
        texX = texture.width - texX - 1;
      }

      context.drawImage(texture.image, texX, 0, 1, texture.height, x, drawStart, 1, drawEnd - drawStart);

      // Shading
      if (side === 1) {
        context.fillStyle = "#000000";
        context.globalAlpha = 0.25;
        context.fillRect(x, drawStart, 1, drawEnd - drawStart);
        context.globalAlpha = 1;
      }
    }
  }
};
