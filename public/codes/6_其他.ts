//订阅发布
class EventBus {
  taskStack: Record<string, Array<Function>>;
  constructor() {
    this.taskStack = {};
  }
  emit(taskName: string, payload: Array<any>) {
    let context = this;
    if (taskName in this.taskStack) {
      this.taskStack[taskName].forEach((v) => {
        v.apply(context, payload);
      });
    }
  }
  on(taskName: string, cb: Function) {
    if (!(taskName in this.taskStack)) {
      this.taskStack[taskName] = [];
    }
    this.taskStack[taskName].push(cb);
  }
  off(taskName: string, cb: Function) {
    if (taskName in this.taskStack) {
      this.taskStack[taskName] = this.taskStack[taskName].filter((v) => {
        return v !== cb;
      });
    }
  }
}

//setTimeout->setInterval
let timeIntervals = {};
function interval(fn, time) {
  let key = Symbol();
  var execute = function (fn, time) {
    timeIntervals[key] = setTimeout(function () {
      fn();
      execute(fn, time);
    }, time);
  };
  execute(fn, time);
  return key;
}
function clearMyInterval(key) {
  if (key in timeIntervals) {
    clearTimeout(timeIntervals[key]);
    delete timeIntervals[key];
  }
}

//compose
function compose(...funcs: Array<Function>) {
  if (funcs.length === 0) return;
  else if (funcs.length === 1) return funcs[0];
  else {
    return funcs.reduce((pre, cur) => {
      return (...args) => {
        return pre(cur(...args));
      };
    });
  }
}

//柯里化函数
function curry(fn) {
  let argArr: Array<any> = [];
  return function temp(...args) {
    if (args.length) {
      argArr.push(...args);
      return temp;
    } else {
      return fn(...argArr);
    }
  };
}
function add(...args) {
  return args.reduce((a, b) => a + b, 0);
}

//URL 解析query
function fromURLToQuery(urlStr: string) {
  let strToParse = urlStr.slice(urlStr.indexOf("?") + 1);
  let ret = {};
  strToParse.split("&").forEach((v) => {
    let key: string, value: string | boolean;
    [key, value] = v.split("=");
    if (!value) value = true;
    if (key in ret) {
      if (Array.isArray(ret[key])) {
        ret[key] = [...ret[key], value];
      } else {
        ret[key] = [ret[key], value];
      }
    } else {
      ret[key] = value;
    }
  });
  return ret;
}
//正则表达式形态
function getURLParams(url) {
  var ret = {};
  var regex = /[?&]+([^=&]+)(?:=([^&]+))?/g;
  var match;
  while ((match = regex.exec(url)) !== null) {
    var key = match[1];
    var value: string | boolean = match[2];
    if (!value || !match[2]) value = true;
    if (key in ret) {
      if (Array.isArray(ret[key])) {
        ret[key] = [...ret[key], value];
      } else {
        ret[key] = [ret[key], value];
      }
    } else {
      ret[key] = value;
    }
  }
  return ret;
}

//时间格式化
function getTimeFromStr(str: string = "yyyy-mm-dd", date: Date = new Date()) {
  let ret: string = str;
  ret = ret.replace(/yyyy/, `${date.getFullYear()}`);
  ret = ret.replace(/dd/, `${date.getDate()}`);
  ret = ret.replace(/mm/, `${date.getMonth() + 1}`);
  return ret;
}

//洗牌
function shuffle(arr: number[]) {
  for (let i = arr.length - 1; i >= 1; i--) {
    let r = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[r]] = [arr[r], arr[i]];
  }
}
