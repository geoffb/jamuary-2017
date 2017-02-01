let KEY_STATE = {};

let suppressedKeys = [];

let suppressKey = function (e) {
  if (suppressedKeys.indexOf(e.keyCode) !== -1) {
    e.preventDefault();
    e.stopPropagation();
  }
};

let onKeyDown = function (e) {
  KEY_STATE[e.keyCode] = true;
  suppressKey(e);
};

let onKeyUp = function (e) {
  KEY_STATE[e.keyCode] = false;
  suppressKey(e);
};

exports.init = function () {
  window.addEventListener("keydown", onKeyDown, false);
  window.addEventListener("keyup", onKeyUp, false);
};

exports.getKeyState = function (keyCode) {
  return KEY_STATE[keyCode] === true;
};

exports.suppressKeys = function () {
  for (let i = 0; i < arguments.length; ++i) {
    suppressedKeys.push(arguments[i]);
  }
};
