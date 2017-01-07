var surface = document.createElement("canvas");
surface.width = 800;
surface.height = 600;
document.body.appendChild(surface);
var context = surface.getContext("2d");

var Node = require("scene/Node");

var box = new Node();
box.x = 10;
box.y = 10;
box.resize(100, 100);
box.color = "cyan";
box.scaleX = 2;
box.scaleY = 2;
box.rotation = Math.PI / 4;

context.fillStyle = "cornflowerblue";
context.fillRect(0, 0, surface.width, surface.height);

box.render(context);
