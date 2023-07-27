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
  enum Status {
    PENDING,
    FUFILLED,
    REJECTED,
  }
  class MyPromise {
    state: Status;
    value: any;
    error: any;
    onFulfilledCallbacks: Function[];
    onRejectedCallbacks: Function[];
    constructor(executor) {
      this.state = Status.PENDING;
      this.value = undefined;
      this.error = undefined;
      this.onFulfilledCallbacks = [];
      this.onRejectedCallbacks = [];

      const resolve = (value) => {
        if (this.state === Status.PENDING) {
          this.state = Status.FUFILLED;
          this.value = value;
          this.onFulfilledCallbacks.forEach((callback) => callback(this.value));
        }
      };

      const reject = (error) => {
        if (this.state === Status.PENDING) {
          this.state = Status.REJECTED;
          this.error = error;
          this.onRejectedCallbacks.forEach((callback) => callback(this.error));
        }
      };

      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }

    then(onFulfilled, onRejected) {
      onFulfilled =
        typeof onFulfilled === "function" ? onFulfilled : (value) => value;
      onRejected =
        typeof onRejected === "function"
          ? onRejected
          : (error) => {
              throw error;
            };

      return new MyPromise((resolve, reject) => {
        const handleFulfilled = () => {
          setTimeout(() => {
            try {
              const result = onFulfilled(this.value);
              if (result instanceof MyPromise) {
                result.then(resolve, reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
            }
          });
        };

        const handleRejected = () => {
          setTimeout(() => {
            try {
              const result = onRejected(this.error);
              if (result instanceof MyPromise) {
                result.then(resolve, reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
            }
          });
        };

        if (this.state === Status.FUFILLED) {
          handleFulfilled();
        } else if (this.state === Status.REJECTED) {
          handleRejected();
        } else if (this.state === Status.PENDING) {
          this.onFulfilledCallbacks.push(handleFulfilled);
          this.onRejectedCallbacks.push(handleRejected);
        }
      });
    }

    catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  }
}
