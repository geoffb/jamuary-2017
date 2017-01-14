let KEY_STATE = {};

let onKeyDown = function (e) {
  KEY_STATE[e.keyCode] = true;
};

let onKeyUp = function (e) {
  KEY_STATE[e.keyCode] = false;
};

exports.init = function () {
  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);
};

exports.getKeyState = function (keyCode) {
  return KEY_STATE[keyCode] === true;
};
