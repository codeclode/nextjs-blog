---
title: "nodejs事件"
date: "2023-01-17"
---

# Node里的进程和线程

### 进程

- 通过child_process创建子进程

- **exec** - child_process.exec(command[, options], callback)使用子进程执行命令，缓存子进程的输出，并将子进程的输出以回调函数参数的形式返回。

- ```javascript
  const fs = require('fs');
  const child_process = require('child_process');
  
  for(var i=0; i<3; i++)  { 
      var workerprocess=child_process.exec('node support.js '+i,  function  (error,  stdout,  stderr)
  	if  (error){
  		console.log(error.stack);  
  		console.log('error  code:  '+error.code);
          console.log('signal  received:  '+error.signal);
      }
  	console.log('stdout:  '  +  stdout);  
      console.log('stderr:'  stderr);  
  });  
  workerprocess.on('exit',  (code)=>console.log('子进程已退出，退出码  '+code);
  ```

- **spawn** - child_process.spawn(command\[, args][, options]) 使用指定的命令行参数创建新进程。 返回流 (stdout & stderr)，在进程返回大量数据时使用。进程一旦开始执行时 spawn() 就开始接收响应。 

- **fork** spawn()的特殊形式，用于在子进程中运行的模块，如 fork('./son.js') 相当于 spawn('node', ['./son.js']) 。与spawn方法不同的是，fork会在父进程与子进程之间，建立一个通信管道，用于进程之间的通信。

### 多线程

Node 10.5.0 的发布，给出了一个实验性质的模块 worker_threads 给 Node 提供真正的多线程能力

worker_thread 模块中有 4 个对象和 2 个类 

- isMainThread: 是否是主线程
- MessagePort: 用于线程之间的通信，继承自 EventEmitter。
- MessageChannel: 用于创建异步、双向通信的通道实例。
- threadId: 线程 ID。
- Worker: 用于在主线程中创建子线程。第一个参数为 filename，表示子线程执行的入口。
- parentPort: 在 worker 线程里是表示父进程的 MessagePort 类型的对象，在主线程里为 null
- workerData: 用于在主进程中向子进程传递数据（data 副本）

```javascript
const assert = require('assert');
const {
  Worker,
  MessageChannel,
  MessagePort,
  isMainThread,
  parentPort
} = require('worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

# EventLoop

### EventEmitter

 events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。 

- 方法
  - addListener(event,listener) 为指定事件添加一个监听器到监听器数组的尾部
  - on(event,listener)为指定事件注册监听器，接收event字符串和cb，这俩方法应该一样
  - once，只能执行一次的on
  - removeListener(event,listener)
  - removeAllListeners(event)
  - setMaxListeners(n)
  - listeners(event)返回事件对应的监听器数组
  - emit(event,...args)，按参数序执行监听器，没有这个监听器就返回false

```javascript
const { EventEmitter } = require('events');

let myEmitter = new EventEmitter();

let listener1 = function () {
  console.log(111);
}
let listener2 = function () {
  console.log(222);
}

myEmitter.addListener('listener1', listener1)
myEmitter.on('listener2', listener1)
myEmitter.on('listener2', listener2)
myEmitter.emit('listener1', 1, 2, 3)//111
myEmitter.removeListener('listener2', () => {
  console.log(123);
})//啥都没有，因为这个回调不是他的事件
myEmitter.emit('listener2', 1, 2, 3)//111 222
myEmitter.removeListener('listener2', listener2)
myEmitter.emit('listener2', 1, 2, 3)//111
console.log(myEmitter.listeners());//[]
```

### 事件循环流程

**idle观察者>>io观察者>check观察者**  setTimeout采用的是类似IO观察者，setImmediate采用的是check观察者，而process.nextTick()采用的是idle观察者。

- 初始化
  - 执行输入的同步代码
  - process.nextTick
  - 微任务
  
- 进入事件环
  - timers阶段
    - 检查timer队列是否有到期的 timer 回调，如果有，将到期的 timer 回调按照 timerId 升序执行。
    - 注意，timer队列的东西每次只能执行一个 
    - 所有process.nextTick
    - 所有微任务
  - IO 回调阶段
    - 执行IO回调
    - 所有process.nextTick
    - 所有微任务
  - idle、prepare阶段
  - poll阶段（有未完成回调且可用）
    - 执行所有可用回调
    - 所有process.nextTick回调
    - 所有微任务
  - poll（有未完成回调但不可用）
    - 检查是否有 immediate 回调，如果有，**退出 poll 阶段**。如果没有，阻塞在此阶段，等待新的事件通知。
  - poll（无未完成回调）
    - 直接退出
  - check
    - 如果有immediate回调，则执行**所有**immediate回调。
    - 所有process.nextTick回调
    - 所有微任务
  - closeing
    - 与check一致
  - 最后检查是否有活跃的事件处理器（定时器，IO以及其他事件句柄）
    - 有则进入下一轮loop
    - 没有则结束程序
  
- 目前在Node的环境下，当前也就只有promise为微任务，Object.observe属于谨慎使用级别

- 执行一个宏就会做所有微

- 值得注意的是，定时器有两个执行时机，一个为timer阶段，另一个则是poll阶段，其实他们都会把所有可用的timer调完，而且掉完每一个以后都会执行所有nextTick和微任务

- 请注意，这里说的执行完所有，是指已经放在执行队列里的，而不是还在预备队列的

  ```javascript
  setTimeout(() => {
    console.log("t1");//timer
  }, 0);
  setImmediate(() => {
    console.log("i0");//check
    new Promise((resolve, reject) => {
      console.log("p1")//check
      resolve()
    }).then(() => {
      console.log("p2");
      setTimeout(() => {
        console.log("t2");
      }, 0);
      setImmediate(() => {
        console.log("i1");
      })
    })
  })
  setImmediate(() => {
    console.log("t3");//check
  })
  setImmediate(() => {
    console.log("t4");//check
  })
  //t1,i0,p1,p2,t3,t4,i1,t2
  ```


### 一个逆天案例

```javascript
const process = require('process');
setImmediate(() => {
  console.log("这是立即执行");
  setTimeout(() => {
    console.log("这是立即执行里的定时器");
  }, 0);
})
setTimeout(() => {
  console.log("这是定时器");
  process.nextTick(() => {
    console.log("这是定时器里的下一轮执行函数");
    setImmediate(() => {
      console.log("这是定时器里的下一轮执行函数里的立即执行函数");
    })
    setTimeout(() => {
      console.log("这是定时器里的下一轮执行函数的定时器");
      process.nextTick(() => {
        console.log("这是定时器里的下一轮执行函数的定时器里的下一轮函数");
      })
    }, 0);
  })
}, 0);
setTimeout(() => {
  console.log("这是定时器2");
}, 0);
console.log("这是同步代码");
process.nextTick(() => {
  process.nextTick(() => {
    console.log("这是同步代码里的下一轮执行函数的下一轮执行函数");
    process.nextTick(() => {
      console.log("这是同步代码里的下一轮执行函数的下一轮执行函数的下一轮函数");
    })
    setTimeout(() => {
      console.log("这是同步代码里的下一轮执行函数的下一轮执行函数的定时器1");
    }, 0);
    setTimeout(() => {
      console.log("这是同步代码里的下一轮执行函数的下一轮执行函数的定时器2");
      process.nextTick(() => {
        console.log("这是同步代码里的下一轮执行函数的下一轮执行函数的定时器2里的下一轮函数");
      })
    }, 0);
    setTimeout(() => {
      console.log("这是同步代码里的下一轮执行函数的下一轮执行函数的定时器3");
    }, 0);
    setTimeout(() => {
      console.log("这是同步代码里的下一轮执行函数的下一轮执行函数的定时器4");
    }, 0);
  })
  console.log("这是同步代码里的下一轮执行函数");
})
/*这是同步代码
这是同步代码里的下一轮执行函数
这是同步代码里的下一轮执行函数的下一轮执行函数
这是同步代码里的下一轮执行函数的下一轮执行函数的下一轮函数
这是定时器
这是定时器里的下一轮执行函数
这是定时器2
这是立即执行
这是定时器里的下一轮执行函数里的立即执行函数
这是同步代码里的下一轮执行函数的下一轮执行函数的定时器1
这是同步代码里的下一轮执行函数的下一轮执行函数的定时器2
这是同步代码里的下一轮执行函数的下一轮执行函数的定时器2里的下一轮函数
这是同步代码里的下一轮执行函数的下一轮执行函数的定时器3
这是同步代码里的下一轮执行函数的下一轮执行函数的定时器4
这是定时器里的下一轮执行函数的定时器
这是定时器里的下一轮执行函数的定时器里的下一轮函数
这是立即执行里的定时器*/
```

