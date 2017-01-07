exports.extend = function (subclass, superclass)  {
  subclass.prototype = new superclass();
  subclass.prototype.constructor = subclass;
  subclass.superclass = superclass.prototype;
  return subclass.prototype;
};
