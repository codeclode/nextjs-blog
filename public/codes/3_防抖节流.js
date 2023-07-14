function debounce(fn, delay = 500) {
  let fnKey;
  return function (...args) {
    let context = this;
    clearTimeout(fnKey);
    fnKey = setTimeout(function () {
      fn.call(context, ...args);
    }, delay);
  };
}

function throttle(fn, delay) {
  let curTime = Date.now();
  return function (...args) {
    nowTime = Date.now();
    // 如果两次时间间隔超过了指定时间，则执行函数。
    if (nowTime - curTime >= delay) {
      curTime = Date.now();
      return fn(...args);
    }
  };
}
