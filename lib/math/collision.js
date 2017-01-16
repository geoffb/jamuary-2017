exports.testCircleRect = function (x1, y1, r1, x2, y2, w2, h2) {
  let hw = w2 / 2;
  let hh = h2 / 2;

  let distX = Math.abs(x1 - x2 - hw);
  let distY = Math.abs(y1 - y2 - hh);

  if (distX > (hw + r1) || distY > (hh + r1)) { return false; }

  if (distX <= hw || distY <= hh) { return true; }

  let dx = distX - hw;
  let dy = distY - hh;
  return dx * dx + dy * dy <= (r1 * r1);
};

exports.testCircleCircle = function (x1, y1, r1, x2, y2, r2) {
  let a = r1 + r2;
  let x = x1 - x2;
  let y = y1 - y2;
  return a > Math.sqrt(x * x + y * y);
};
