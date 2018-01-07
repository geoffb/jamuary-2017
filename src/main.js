"use strict";

const input = require("input");
const draw = require("draw");
const assets = require("scene/assets");
const Node = require("scene/Node");
const FirstPerson = require("scene/FirstPerson");
const tween = require("tween");
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
input.suppressKeys(32, 37, 38, 39, 40);

assets.loadTextureAtlas("atlas", "images/atlas.png", atlasData);
assets.loadTexture("sprites", "images/sprites.png");

let fp = new FirstPerson();
fp.resize(surface.width, surface.height);
fp.textureKey = "sprites";
fp.level = level;

let pain = new Node();
pain.color = "#D04648";
pain.alpha = 0.9;
pain.visible = false;
pain.resize(surface.width, surface.height);

let health = new Health();
health.x = 4;
health.y = 4;

let mortal = level.player.getComponent("mortal");
health.amount = mortal.health;
mortal.on("healthChange", function (hp, delta) {
  // Update health UI
  health.amount = hp;

  // Show pain overlay
  if (delta < 0) {
    pain.visible = true;
    pain.alpha = 0.85;
    tween.to(pain, {
      alpha: 0
    }, 200);
  }
});

let last = 0;
var render = function (time) {
  let dt = Math.min(time - last, MAX_DT);
  last = time;

  // Update tweens
  tween.update(dt);

  // Handle input
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

  // Update simulation
  level.update(dt);

  // Camera follows the player
  fp.setCamera(
    transform.position.x, transform.position.y,
    transform.direction.x, transform.direction.y);

  // Render
  fp.render(context);
  pain.render(context);
  health.render(context);

  requestAnimationFrame(render);
};

render(0);
