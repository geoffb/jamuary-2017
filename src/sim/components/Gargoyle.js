"use strict";

let Gargoyle = function (data) {
	this.interval = data.interval !== void 0 ? data.interval : 1000;
};

module.exports = Gargoyle;

Gargoyle.prototype.add = function () {
	let map = this.entity.level.map;
  let transform = this.entity.getComponent("transform");
	let x = Math.floor(transform.position.x);
  let y = Math.floor(transform.position.y);
  map.set(x, y, 3);

	console.log(x, y, map.get(x, y));
	console.log(x + 1, y, map.get(x + 1, y));

	// Set facing
	if (map.get(x - 1, y) === 0) {
		transform.direction.set(-1, 0);
	} else if (map.get(x, y - 1) === 0) {
		transform.direction.set(0, -1);
	} else if (map.get(x + 1, y) === 0) {
		transform.direction.set(1, 0);
	} else {
		transform.direction.set(0, 1);
	}
	console.log(transform.direction);
};

Gargoyle.prototype.update = function () {
	let states = this.entity.getComponent("states");
	if (!states.has("cooldown")) {
		let shooter = this.entity.getComponent("shooter");
		shooter.shoot();
		states.add("cooldown", this.interval);
	}
};
