const PARENT = -1;
const UPPER_LEFT = 0;
const UPPER_RIGHT = 1;
const LOWER_LEFT = 2;
const LOWER_RIGHT = 3;

let QuadTree = module.exports = function (x, y, width, height, depth, depthLimit, rectLimit) {
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 1;
  this.height = height || 1;
  this.depth = depth || 0;
  this.depthLimit = depthLimit || 2;
  this.rectLimit = rectLimit || 4;
  this.children = [];
  this.rectangles = [];
};

QuadTree.prototype.clear = function () {
  var children = this.children;
  for (var i = 0, j = children.length; i < j; ++i) {
    children[i].clear();
  }
  children.length = 0;
  this.rectangles.length = 0;
};

QuadTree.prototype.insert = function (rect) {
  var children = this.children;
  var rectangles = this.rectangles;

  if (children.length > 0) {
    var index = this._getInsertIndex(rect);
    if (index === PARENT) {
      rectangles.push(rect);
    } else {
      children[index].insert(rect);
    }
  } else {
    rectangles.push(rect);
    if (
      rectangles.length > this.rectLimit &&
      this.depth < this.depthLimit
    ) {
      this._divide();
    }
  }
};

QuadTree.prototype.retrieve = function (rect) {
  var found = this.rectangles.concat();

  if (this.children.length > 0) {
    var children = this._getChildren(rect);
    for (var i = 0, j = children.length; i < j; ++i) {
      var child = children[i];
      found = found.concat(child.retrieve(rect));
    }
  }

  return found;
};

QuadTree.prototype._divide = function () {
  var children = this.children;
  var rectangles = this.rectangles;

  // Size of children
  var width = Math.floor(this.width / 2);
  var height = Math.floor(this.height / 2);
  var depth = this.depth + 1;

  children.push(new QuadTree(this.x, this.y, width, height, depth, this.depthLimit, this.rectLimit));
  children.push(new QuadTree(this.x + width, this.y, width, height, depth, this.depthLimit, this.rectLimit));
  children.push(new QuadTree(this.x, this.y + height, width, height, depth, this.depthLimit, this.rectLimit));
  children.push(new QuadTree(this.x + width, this.y + height, width, height, depth, this.depthLimit, this.rectLimit));

  this.rectangles = [];
  for (var i = 0, j = rectangles.length; i < j; ++i) {
    this.insert(rectangles[i]);
  }
};

QuadTree.prototype._getInsertIndex = function (rect) {
  var x = Math.floor(this.x + this.width / 2);
  var y = Math.floor(this.y + this.height / 2);

  if (rect.x + rect.width < x) {
    // Left side
    if (rect.y + rect.height < y) {
      // Upper left
      return UPPER_LEFT;
    } else if (rect.y >= y) {
      // Lower left
      return LOWER_LEFT;
    } else {
      return PARENT;
    }
  } else if (rect.x >= x) {
    // Right side
    if (rect.y + rect.height < y) {
      // Upper right
      return UPPER_RIGHT;
    } else if (rect.y >= y) {
      // Lower right
      return LOWER_RIGHT;
    } else {
      return PARENT;
    }
  } else {
    return PARENT;
  }
};

QuadTree.prototype._getChildren = function (rect) {
  var children = this.children;
  var found = [];
  var x = Math.floor(this.x + this.width / 2);
  var y = Math.floor(this.y + this.height / 2);

  // Left
  if (rect.x < x) {
    if (rect.y < y) {
      found.push(children[UPPER_LEFT]);
    }
    if (rect.y + rect.height >= y) {
      found.push(children[LOWER_LEFT]);
    }
  }

  // Right
  if (rect.x + rect.width >= x) {
    if (rect.y < y) {
      found.push(children[UPPER_RIGHT]);
    }
    if (rect.y + rect.height >= y) {
      found.push(children[LOWER_RIGHT]);
    }
  }

  return found;
};
