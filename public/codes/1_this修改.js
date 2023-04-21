function myCall(target, fn, ...args) {
  if (typeof fn !== "function") {
    throw new Error('Not a Function')
  }
  target = target || globalThis;
  let fnSymbol = Symbol('fn')
  target[fnSymbol] = fn;
  try {
    let ret = target[fnSymbol](...args);
    return ret;
  } catch (e) {
    throw e;
  } finally {
    delete target[fnSymbol];
  }
}

function myApply(target, fn, args) {
  if (typeof fn !== "function") {
    throw new Error('Not a Function')
  }
  if (!Array.isArray(args)) {
    throw new Error('args should be an array')
  }
  target = target || globalThis;
  let fnSymbol = Symbol('fn')
  target[fnSymbol] = fn;
  try {
    let ret = target[fnSymbol](...args);
    return ret;
  } catch (e) {
    throw e;
  } finally {
    delete target[fnSymbol];
  }
}

function myBind(target, fn) {
  target = target || globalThis;
  if (typeof fn !== "function") {
    throw new Error('Not a Function')
  } else {
    return function (...args) {
      return fn.apply(target, args)
    }
  }
}