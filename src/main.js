var surface = document.createElement("canvas");
surface.width = 640;
surface.height = 360;
document.body.appendChild(surface);
var context = surface.getContext("2d");

var input = require("input");
var assets = require("scene/assets");
var FirstPerson = require("scene/FirstPerson");

const Level = require("./sim/Level");

let level = new Level();
level.init();

input.init();

assets.loadTexture("wall", "images/wall.png");

var fp = new FirstPerson();
fp.resize(surface.width, surface.height);
fp.textureKey = "wall";
fp.map = level.map;

let last = 0;

const SPEED_FORWARD = 1 / 250;
const SPEED_BACKWARD = 1 / 500;
const SPEED_ROTATE = Math.PI / 2000;

var render = function (time) {
  let dt = time - last;
  last = time;

  if (input.getKeyState(38)) {
    level.moveEntity(level.player, SPEED_FORWARD * dt);
  }
  if (input.getKeyState(40)) {
    level.moveEntity(level.player, -SPEED_BACKWARD * dt);
  }
  if (input.getKeyState(37)) {
    let angle = -SPEED_ROTATE * dt;
    level.player.rotate(angle);
  }
  if (input.getKeyState(39)) {
    let angle = SPEED_ROTATE * dt;
    level.player.rotate(angle);
  }

  fp.setCamera(
    level.player.position.x, level.player.position.y,
    level.player.direction.x, level.player.direction.y);

  fp.render(context);

  requestAnimationFrame(render);
};

render();
