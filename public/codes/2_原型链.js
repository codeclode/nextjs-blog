function myNew(fn, ...args) {
  if (typeof fn !== "function") {
    throw new Error("fn is not a function")
  } else {
    let ret = Object.create(fn.prototype);
    let result = fn.call(ret, ...args);
    if (result !== null && (result instanceof Object)) {
      return result;
    }
    return ret;
  }
}

function myInstance(left, right) {
  if (typeof left !== 'object' && typeof left !== 'function' || typeof right !== 'function') {
    throw new Error("fuck")
  } else {
    let nowPointer = Object.getPrototypeOf(left);
    while (nowPointer) {
      if (nowPointer === right.prototype) return true;
      nowPointer = Object.getPrototypeOf(nowPointer)
    }
    return false;
  }
}

function myCreate(prototype) {
  if (typeof prototype !== "object" || prototype === null) {
    throw new Error("not a object")
  }
  let Fn = function () { }
  Fn.prototype = prototype;
  return new Fn();
}

//寄生组合
function SuperType(name) {
  this.name = name
}
function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age;
}
function extend(subType, superType) {
  subType.prototype = Object.create(superType.prototype);
  subType.prototype.constructor = subType;
}