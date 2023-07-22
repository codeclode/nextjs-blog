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
            reject("all error");
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
        //return new Promise((resolve,reject)=>{
        //  this.running++;
        //  axios.get(url).finally(resolve)
        //})
      });
    });
    this.start();
  }
}
//手写promise
{
  function resolvePromise(promise2, x, resolve, reject) {
    //x是调用then两函数之一以后得到的结果,resolve\reject对应promise2创建时的俩回调
    // 循环引用报错
    if (x === promise2) {
      // reject报错
      return reject(new TypeError("Chaining cycle detected for promise"));
    }
    // 防止多次调用
    let called;
    // x不是null 且x是对象或者函数
    if (x instanceof MyPromise) {
      try {
        x.then(
          (y) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // resolve的结果依旧是promise 那就继续解析
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err); // 失败了就失败了
          }
        );
      } catch (e) {
        // 也属于失败
        if (called) return;
        called = true;
        // 取then出错了那就不要在继续执行了
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

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

    then(onFulfilled, onRejected) {
      // 声明返回的promise2
      let promise2 = new MyPromise((resolve, reject) => {
        if (this.state === Status.FUFILLED) {
          let x = onFulfilled(this.value);
          // resolvePromise函数，处理自己return的promise和默认的promise2的关系
          resolvePromise(promise2, x, resolve, reject);
        }
        if (this.state === Status.REJECTED) {
          let x = onRejected(this.value);
          resolvePromise(promise2, x, resolve, reject);
        }
        if (this.state === Status.PENDING) {
          this.resolvedCallbacks.push(() => {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          });
          this.rejectedCallbacks.push(() => {
            let x = onRejected(this.value);
            resolvePromise(promise2, x, resolve, reject);
          });
        }
      });
      // 返回promise，完成链式
      return promise2;
    }

    constructor(fn: Function) {
      function resolve(value) {
        if (value instanceof MyPromise) {
          return value.then(resolve, reject);
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
