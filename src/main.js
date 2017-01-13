var surface = document.createElement("canvas");
surface.width = 800;
surface.height = 600;
document.body.appendChild(surface);
var context = surface.getContext("2d");

var Node = require("scene/Node");
var Text = require("scene/Text");
var Sprite = require("scene/Sprite");
var assets = require("scene/assets");
var TileMap = require("scene/TileMap");
var Map = require("math/Map");

var atlas = require("./atlas.js");

assets.loadTextureAtlas("atlas", "images/atlas.png", atlas);

var map = new Map(5, 5, 32, 32);

for (let i = 0; i < map.width; ++i) {
  map.set(i, i, 1);
}

var box = new Node();
box.x = 10;
box.y = 10;
box.resize(100, 100);
box.color = "cyan";
box.scaleY = 2;
box.rotation = Math.PI / 4;

var title = new Text("foobarbaz", 50);
title.x = 100;
title.y = 100;
title.color = "#00FF00";
title.scaleX = 2;
title.rotation = Math.PI / 4;

var foo = new Sprite("sprite1");
foo.x = 400;
foo.y = 100;
foo.rotation = Math.PI / 4;
foo.scale = 2;

var tileMap = new TileMap();
tileMap.map = map;
tileMap.textureKey = "atlas";

var render = function () {
  context.fillStyle = "cornflowerblue";
  context.fillRect(0, 0, surface.width, surface.height);

  box.render(context);
  title.render(context);
  foo.render(context);
  tileMap.render(context);

  requestAnimationFrame(render);
};

render();
