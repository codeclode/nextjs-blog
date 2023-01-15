---
title: "JS其他"
date: "2023-01-15"
---

# URL

```javascript
var url = new URL('https://developer.mozilla.org/en-US/docs/Web/API/URL/href?name=liaosong#Examples');
consoloe.log(url)
//hash: "#Examples?name=liaosong"
//host: "developer.mozilla.org"
//hostname: "developer.mozilla.org"
//href: "https://developer.mozilla.org/en-US/docs/Web/API/URL/href?name=liaosong#Examples"
//origin: "https://developer.mozilla.org"
//password: ""
//pathname: "/en-US/docs/Web/API/URL/href"
//port: ""
//protocol: "https:"
//search: "?name=liaosong"
//searchParams: URLSearchParams {}可以像set一样使用，但是可以排序以及append和delete等
//username: ""

url.searchParams.get('name')
//'liaosong'
url.toJSON()//等同于toString，返回href
```

# Web worker

### 普通worker

```javascript
//main.js
const worker = new Worker('./worker.js');
worker.postMessage({ type: 'start', payload: { count: 666 } }); // 发送信息给worker
worker.onmessage = function (messageEvent) {
	console.log(messageEvent)
    const { type, payload } = messageEvent.data;
}
worker.terminate();

//worker.js
self.onmessage = (messageEvent) => {//注意，worker本体接送消息使用self代表自己
  console.log(messageEvent);
  const { type, payload } = messageEvent.data;
  switch (type) {
    case 'start':
      // 通过一系列处理之后，把最终的结果发送给主线程
      const result = counter();
      this.postMessage(result);
      break;
  }
};

//收发双方使用poastmessage和onmessage通信
```

### SharedWorker，允许共享worker

```javascript
//mainjs
let worker = new SharedWorker('./sharedWorker.js');
likeBtn.addEventListener('click', function () {
	worker.port.postMessage({ type: 'increase', payload: { count: 666 } });
});
decreaseBtn.addEventListener('click', function () {
	worker.port.postMessage({ type: 'decrease', payload: { count: 666 } });
});//注意，所有的内容都在.port上进行

//worker.js
let val = 666;

self.onconnect = function (e) {
  const port = e.ports[0];
  console.log('shared-worker connect');

  port.postMessage(val);

  port.onmessage = (messageEvent) => {
    const { type, payload } = messageEvent.data;

    switch (type) {
      case 'increase':
        port.postMessage(++val);
        break;
      case 'decrease':
        port.postMessage(--val);
        break;
    }
  };
};
```

### ServerWorker

 ServiceWorker 一般作为 Web 应用程序、浏览器和网络之间的代理服务。他们旨在创建有效的离线体验，拦截网络请求，以及根据网络是否可用采取合适的行动，更新驻留在服务器上的资源。他们还将允许访问推送通知和后台同步 API。 

```javascript
if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker
          // .register('./serviceWorker.js', { scope: '/page/' })
          .register('./serviceWorker.js')
          .then(
            function (registration) {
              // console.log(
              //   'ServiceWorker registration successful with scope: ',
              //   registration.scope
              // );
              var serviceWorker;
              if (registration.installing) {
                serviceWorker = registration.installing;
                console.log('installing');
              } else if (registration.waiting) {
                serviceWorker = registration.waiting;
                console.log('waiting');
              } else if (registration.active) {
                serviceWorker = registration.active;
                console.log('active');
              }
              if (serviceWorker) {
                // logState(serviceWorker.state);
                serviceWorker.addEventListener('statechange', function (e) {
                  console.log('statechange', e.target.state);
                });
              }
            },
            function (err) {
              console.log('ServiceWorker registration failed: ', err);
            }
          );
      });
    }

//worker.js
//负责缓存...
```

# IndexedDB

- 一个比较大的localStorage
- 使用对象仓库存放键值对数据，主键是独一无二的，并且不能有重复。 
- 遵循同源策略。即可以访问相同域内存储的数据，但无法跨不同域访问数据。 
- 可以在Worker中使用

### 数据库连接

```javascript
const DBOpenRequest = window.indexedDB.open('project', 2);
//使用对应版本查询或者创建数据库，如果已有数据库版本高于给定的 version，中止操作并返回类型为 VersionError 的 DOMError。
//如果已有数据库版本低于给定的 version，触发一个 versionchange 操作。
//如果数据库不存在，创建指定名称的数据库，将版本号设置为给定版本，如果未给定版本号，则设置为 1。
let db;
  db = request.result;
  console.log('数据库打开成功');
};
request.onupgradeneeded = function (event) {
  db = event.target.result;
};//到这里获取了数据库
```

### 数据库模式操作

```javascript
const objectStore = db.createObjectStore('project', { keyPath: 'id' });
//新建表（或者说对象仓库），第二个值为options，包括主键的属性和其是否自增整数
db.createIndex(indexName, keyPath, objectParameters)
//indexName创建的索引名称，可以使用空名称作为索引。keyPath索引使用的键属性，可以使用空创建索引, 也可以传递数组。objectParameters可选参数。常用参数之一是unique，表示该字段值是否唯一，不能重复。
```

### 事务

对于数据仓库的所有操作都是在事务中进行的

```javascript
const transaction = db.transaction('project', "readwrite");
const objectStore = transaction.objectStore('project');
const objectStoreRequest = objectStore.add(newItem);
//db.transaction('project',"readwrite").objectStore('project').add(newItem);
const objectStoreRequest = db.transaction('project',"readwrite").objectStore('project') .delete(id);

//查
const store = db.transaction([dbName], 'readwrite').objectStore(dbName);
const request = store.index(name).getAll(value);
// 返回对象存储中与指定参数匹配的所有对象，如果没有给出参数，则返回存储中的所有对象。
//get(key)通过主键查询
request.onsuccess = function(event){
    consoloe.log(event.result)
}

const objectStore = db.transaction(dbName).objectStore(dbName);
const keyRangeValue = IDBKeyRange.bound(4, 10,true,false);//(4,10]
//bound()、only()、lowerBound()、upperBound()
objectStore.openCursor(keyRangeValue).onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
        cursor.continue();
    } else {
        // 完成遍历
    }
}

//修改数据
const transaction = db.transaction('project', "readwrite");
const objectStore = transaction.objectStore(project);
// 获取存储的对应键的存储对象
const objectStoreRequest = objectStore.get(id);
// 获取成功后替换当前数据
objectStoreRequest.onsuccess = function(event) {
  // 当前数据
  const myRecord = objectStoreRequest.result;
  // 遍历替换
  for (const key in updateData) {
    if (typeof myRecord[key] != 'undefined') {
      myRecord[key] = data[key];
    }
  }
  // 更新数据库存储数据             
  objectStore.put(myRecord);
};
```

# 设计模式

### 单例

- 基于对象数据类型，把描述当前事务的属性和方法统一放在一起分组管理，能够减少全局变量污染，这种设计模式就是“单例设计模式”

- var obj = {xxx:XXX}，obj看作命名空间，把描述当前事务的属性和方法，放到空间中进行分组管理 

- 单例设计模式也是最基础的模块化思想 

- ```javascript
  var utils=(function(){
      function func1(){}
      function func2(){}
      return {
          func1:func1,
          func2:func2
      };
  })();
  
  var searchModule=(function(){
      function queryData(){}
      function bindHTML(){
          //=>需要调取utils模块（命名空间中的方法）
          utils.func1();
      }
      return {
          init:function(){
          }
      };
  })();
  ```

### 工厂

- 工厂设计模式，是在需要创建很多“相似实例”的情境下，让我们告别手动创建，而实现工业化批量生产

- 其实就是类似构造函数和类的东西

- ```javascript
  function createPerson(name,parent){
  	var person={};
  	person.name=name;
  	if(typeof parent!=="undefined"){
  		person.parent=parent;
  	}
  	return person;
  }
  var person1=createPerson('小白');
  var person2=createPerson('小绿');
  var person3=createPerson('小红',person1);
  ```

# 再看等号问题

### 表格，1true，0false

|         x         |      y      |  ==  | ===  |  is  |
| :---------------: | :---------: | :--: | :--: | :--: |
|        +0         |     -0      |  1   |  1   |  0   |
|         0         |    false    |  1   |  1   |  0   |
|        ""         |    false    |  1   |  0   |  0   |
|        ""         |      0      |  1   |  0   |  0   |
|        '0'        |      0      |  1   |  0   |  0   |
|       '17'        |     17      |  1   |  0   |  0   |
|       [1,2]       |    '1,2'    |  1   |  0   |  0   |
| new String('foo') |    'foo'    |  1   |  0   |  0   |
|       null        |  undefined  |  1   |  0   |  0   |
|       null        |    false    |  0   |  0   |  0   |
|     undefined     |    false    |  0   |  0   |  0   |
|    {foo:"bar"}    | {foo:"bar"} |  0   |  0   |  0   |
|         0         |    null     |  0   |  0   |  0   |
|         0         |     NaN     |  0   |  0   |  0   |
|       'foo'       |     NaN     |  0   |  0   |  0   |
|        NaN        |     NaN     |  0   |  0   |  1   |

### 对于==和类型转换

- null和undefined
  - null == undefined 为true
  - 他们不等于任何东西
- NaN不等于任何值，甚至他自己
- 除了字符串和对象转字符串，只要数据类型不同就都转为数字
- 数组：Number(\[\])->0,Number([0])->0,Number([2])->2,Number([1,2])->NaN
- 字符串：''->0,"1"->0,'1a'->NaN
- Number(undefined)->NaN,Number(null)->0
- Boolean([])->true,Boolean(null|undefined)->false

# 数据类型检测的方法

### typeof 

- 只能返回基本的类型，面向对象的继承没发辨别，都返回object
-  NaN / Infinity都是数字类型的，检测结果都是“number”; 
-  typeof null 的结果“object”; 

### instance of

- 定义某个实例是否属于这个类
- 根据原型链判断
- 返回true和false
- 要求检测的实例必须是对象数据类型的 
- 所有对象都是 Object 的实例，检测结果都是 TRUE ，所以无法基于这个结果判断是否为普通对象 

### constructor

- arr.construcuor===Array
- 实例.constructor 一般都等于 类.prototype.constructor也就是当前类本身（前提是你的 constructor 并没有被破坏）
- 能检测基本数据类型
- 不给当前类的原型进行重定向，会造成检测的结果不准确
- 非常容易被修改 

### Object.prototype.toString.call()

- 专门用来检测数据类型的方法，基本上不存在局限性的数据类型检测方式

- 基于他可以有效的检测任何数据类型的值

- ```javascript
  let class2type = {};
  let toString = class2type.toString; //=>Object.prototype.toString
  
  console.log(toString.call(10)); //=>"[object Number]"
  console.log(toString.call(NaN)); //=>"[object Number]"
  console.log(toString.call("xxx")); //=>"[object String]"
  console.log(toString.call(true)); //=>"[object Boolean]"
  console.log(toString.call(null)); //=>"[object Null]"
  console.log(toString.call(undefined)); //=>"[object Undefined]"
  console.log(toString.call(Symbol())); //=>"[object Symbol]"
  console.log(toString.call(BigInt(10))); //=>"[object BigInt]"
  console.log(toString.call({xxx:'xxx'})); //=>"[object Object]"
  console.log(toString.call([10,20])); //=>"[object Array]"
  console.log(toString.call(/^\d+$/)); //=>"[object RegExp]"
  console.log(toString.call(function(){})); //=>"[object Function]" 
  ```

- 只能检测内置类，不能检测自定义类

- 只要是自定义类返回的都是‘[Object Object]’

# 正则表达式

### 数量

- \* 0,1,n
- \+ 1,n
- ? 0,1
- {n} n
- {n,} n+i
- {n,m} n~m

### 字符

- \[ABC\]匹配中括号中的任意字符
- \[^ABC\]除了中括号内字符的字符
- \[A-Z0-9\]
- \.匹配除了换行之外的任意单个
- \[\s\]匹配一切
- \w匹配字母数字下划线

### 定位

- ^ 开始
- $ 结束
- \b 单词边界

### 括号

- exp1(?=exp2)：exp2前的exp1
-  (?<=exp2)exp1：查找 exp2 后面的 exp1 
- exp1(?!exp2)：查找后面不是 exp2 的 exp1 
-  (?<!exp2)exp1：查找前面不是 exp2 的 exp1 

### 反向捕获

- \1 代表前面括号中捕获到的对象再一次出现

### 修饰符

- i不区分大小写
- g全局匹配
- m 多行匹配 ，使边界字符 ^ 和 $ 匹配每一行的开头和结尾。
- s .可以匹配算上换行符的一切

