"use strict";

const input = require("input");
const draw = require("draw");
const assets = require("scene/assets");
const FirstPerson = require("scene/FirstPerson");
const Level = require("./sim/Level");
const Health = require("./ui/Health");
const atlasData = require("./atlas");

const WIDTH = 640;
const HEIGHT = 360;

const MAX_DT = 100;

const SPEED_FORWARD = 1 / 250;
const SPEED_BACKWARD = 1 / 500;
const SPEED_ROTATE = Math.PI / 2000;

let surface = draw.createSurface(WIDTH, HEIGHT);
surface.className = "stage pixelated";
document.body.appendChild(surface);
let context = surface.getContext("2d");

let resize = function () {
  let scale = Math.min(window.innerWidth / surface.width, window.innerHeight / surface.height);
  surface.style.transform = "scale(" + scale + ", " + scale + ")";
  surface.style.left = (window.innerWidth / 2 - (surface.width * scale) / 2) + "px";
  surface.style.top = (window.innerHeight / 2 - (surface.height * scale) / 2) + "px";
};

resize();
window.addEventListener("resize", resize, false);

let level = new Level();
level.load("level1");

input.init();
input.suppressKeys(32, 37, 38, 39, 40)

assets.loadTextureAtlas("atlas", "images/atlas.png", atlasData);
assets.loadTexture("sprites", "images/sprites.png");

let fp = new FirstPerson();
fp.resize(surface.width, surface.height);
fp.textureKey = "sprites";
fp.level = level;

let health = new Health();
health.x = 4;
health.y = 4;

let mortal = level.player.getComponent("mortal");
health.amount = mortal.health;
mortal.on("healthChange", function (hp) {
  health.amount = hp;
});

let last = 0;
var render = function (time) {
  let dt = Math.min(time - last, MAX_DT);
  last = time;

  let transform = level.player.getComponent("transform");
  if (input.getKeyState(38)) {
    level.moveEntityByDirection(level.player, SPEED_FORWARD * dt);
  }
  if (input.getKeyState(40)) {
    level.moveEntityByDirection(level.player, -SPEED_BACKWARD * dt);
  }
  if (input.getKeyState(37)) {
    let angle = -SPEED_ROTATE * dt;
    transform.rotate(angle);
  }
  if (input.getKeyState(39)) {
    let angle = SPEED_ROTATE * dt;
    transform.rotate(angle);
  }
  if (input.getKeyState(32)) {
    if (!level.player.states.has("shootCooldown")) {
      let shooter = level.player.getComponent("shooter");
      shooter.shoot();
      level.player.states.add("shootCooldown", 300);
    }
  }

  level.update(dt);

  fp.setCamera(
    transform.position.x, transform.position.y,
    transform.direction.x, transform.direction.y);

  fp.render(context);
  health.render(context);

  requestAnimationFrame(render);
};

render(0);
