//红绿灯
{
  let iterator = light();
  iterator.next();
  function log(color) {
    setTimeout(() => {
      console.log(color);
      let ret = iterator.next();
      if (ret.done) {
        iterator = light();
        iterator.next();
      }
    }, 1500);
  }
  function* light() {
    yield log("red");
    yield log("green");
    yield log("yellow");
  }
}

//Promise静态方法们
{
  //all
  function all(promises: Array<Promise<any>>) {
    return new Promise((resolve, reject) => {
      let rets: Array<any> = [];
      let count = 0;
      promises.forEach((v, i) => {
        v.then((res) => {
          rets[i] = res;
          count++;
          if (count === promises.length) {
            resolve(rets);
          }
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }
  //race
  function race(promises: Array<Promise<any>>) {
    return new Promise((resolve, reject) => {
      promises.forEach((v) => {
        v.then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }
  //any
  function any(promises: Array<Promise<any>>) {
    return new Promise((resolve, reject) => {
      let errCount = 0;
      promises.forEach((v) => {
        v.then((res) => {
          resolve(res);
        }).catch(() => {
          errCount++;
          if (errCount === promises.length) {
            resolve("all error");
          }
        });
      });
    });
  }
  //allSettled
  function allSettled(promises: Array<Promise<any>>) {
    return new Promise((resolve, reject) => {
      let rets: Array<any> = [];
      let count = 0;
      promises.forEach((v, i) => {
        v.then((res) => {
          rets[i] = res;
        })
          .catch((err) => {
            rets[i] = err;
          })
          .finally(() => {
            count++;
            if (count === promises.length) {
              resolve(rets);
            }
          });
      });
    });
  }
}
//封装ajax为promise
function httpRequest(url, data, method = "get") {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      else {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.response);
        }
      }
    };
    xhr.onerror = (err) => {
      reject(new Error(this.statusText));
    };
    xhr.send(data);
  });
}
//调度器
class Scheduler {
  tasks: (() => Promise<any>)[];
  limit: number;
  running: number;
  constructor(limit = 3) {
    this.limit = limit;
    this.running = 0;
    this.tasks = [];
  }
  start() {
    if (this.running < this.limit && this.tasks.length) {
      this.tasks.shift()!().finally(() => {
        this.running--;
        this.start();
      });
    }
  }
  add(delay: number, content: string) {
    this.tasks.push(() => {
      return new Promise((resolve, reject) => {
        this.running++;
        setTimeout(() => {
          console.log(content);
          resolve(null);
        }, delay);
      });
    });
    this.start();
  }
}
//手写promise
{
  enum Status {
    PENDING,
    FUFILLED,
    REJECTED,
  }
  class MyPromise {
    self = this;

    state: Status;

    value: any;

    resolvedCallbacks: Array<Function> = [];

    rejectedCallbacks: Array<Function> = [];

    then(resolve, reject) {
      if (typeof resolve === "function") {
        if ((this.state = Status.FUFILLED)) {
          resolve(this.value);
        } else if ((this.state = Status.PENDING)) {
          this.resolvedCallbacks.push(resolve);
        }
      }
      if (typeof reject === "function") {
        if ((this.state = Status.REJECTED)) {
          reject(this.value);
        } else if ((this.state = Status.PENDING)) {
          this.rejectedCallbacks.push(reject);
        }
      }
    }

    constructor(fn: Function) {
      function resolve(value) {
        if (value instanceof MyPromise) {
          return value.then(this.resolve, this.reject);
        }
        setTimeout(() => {
          if (this.state === Status.PENDING) {
            this.state = Status.FUFILLED;
            this.value = value;
            this.resolvedCallbacks.forEach((v) => {
              v(value);
            });
          }
        }, 0);
      }
      function reject(err) {
        setTimeout(() => {
          if (this.state === Status.PENDING) {
            this.state = Status.REJECTED;
            this.value = err;
            this.rejectedCallbacks.forEach((v) => {
              v(err);
            });
          }
        }, 0);
      }
      try {
        fn(resolve, reject);
      } catch (e) {
        reject(e);
      }
    }
  }
}
