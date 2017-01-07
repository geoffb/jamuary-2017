var surface = document.createElement("canvas");
surface.width = 800;
surface.height = 600;
document.body.appendChild(surface);
var context = surface.getContext("2d");

var Node = require("scene/Node");
var Text = require("scene/Text");

var box = new Node();
box.x = 10;
box.y = 10;
box.resize(100, 100);
box.color = "cyan";
// box.scaleX = 2;
// box.scaleY = 2;
// box.rotation = Math.PI / 4;

var title = new Text("foo", 50);
title.x = 100;
title.y = 100;
title.color = "#00FF00";
title.scaleX = 2;
title.rotation = Math.PI / 4;

var render = function () {
  context.fillStyle = "cornflowerblue";
  context.fillRect(0, 0, surface.width, surface.height);

  box.render(context);
  title.render(context);

  requestAnimationFrame(render);
};

render();
