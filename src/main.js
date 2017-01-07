var surface = document.createElement("canvas");
surface.width = 800;
surface.height = 600;
document.body.appendChild(surface);
var context = surface.getContext("2d");

var Node = require("scene/Node");
var Text = require("scene/Text");
var Sprite = require("scene/Sprite");
var atlas = require("scene/atlas");

var atlasData = require("./atlas.js");

atlas.load("images/atlas.png", atlasData);

var box = new Node();
box.x = 10;
box.y = 10;
box.resize(100, 100);
box.color = "cyan";
box.scaleY = 2;
box.rotation = Math.PI / 4;

var title = new Text("foo", 50);
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

var render = function () {
  context.fillStyle = "cornflowerblue";
  context.fillRect(0, 0, surface.width, surface.height);

  box.render(context);
  title.render(context);
  foo.render(context);

  requestAnimationFrame(render);
};

render();
