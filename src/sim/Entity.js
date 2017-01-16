const PREFABS = require("./prefabs");
const COMPONENTS = require("./components");

let nextEntityId = 0;

let Entity = module.exports = function (type) {
  this.id = nextEntityId++;
  this.type = type;
  this._components = [];

  let componentData = PREFABS[type];
  for (let componentKey in componentData) {
    this.addComponent(componentKey, componentData[componentKey]);
  }
};

Entity.prototype.hasComponent = function (componentKey) {
  return this.hasOwnProperty(componentKey);
};

Entity.prototype.addComponent = function (componentKey, data) {
  if (!COMPONENTS[componentKey]) {
    throw new Error("Invalid component: " + componentKey);
  }
  let component = new COMPONENTS[componentKey](data);
  component.entity = this;
  this._components.push(component);
  this[componentKey] = component;
};

Entity.prototype.getComponent = function (componentKey) {
  if (this.hasComponent(componentKey)) {
    return this[componentKey];
  } else {
    throw new Error("Entity does not have component: " + componentKey);
  }
};

Entity.prototype.callComponents = function (signal) {
  let args = [];
  for (let i = 1, j = arguments.length; i < j; i++) {
    args.push(arguments[i]);
  }
  for (let i = 0, j = this._components.length; i < j; ++i) {
    let component = this._components[i];
    if (typeof component[signal] === "function") {
      component[signal].apply(component, args);
    }
  }
};
