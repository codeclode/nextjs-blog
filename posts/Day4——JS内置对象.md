---
title: "JS内置对象"
date: "2023-01-12"
---

# 数据容器

### Map

- 属性

  - Map[Symbol.species]返回Map的原始构造函数，继承Map的类通过重写此属性来修改构造函数。。。
  - map.size：当前成员数量

- 方法

  - map\[Symbol.iterator\]()返回map实例的迭代器
  - clear、delete(key)清除元素
  - has(key)检查存在性
  - set、get
  - forEach((v,k,map))类似Array的forEach
  - entries()->\[key,value\]、keys()、values()，注意返回迭代器

- 注意

  - m\[key\]=value可以使用，但键值对没有存储到数据结构中，因此不能使用map方法进行操作

  - 构造函数中可以加入可迭代对象，比如

    ```javascript
    const myMap = new Map([
      [1, 'one'],
      [2, 'two'],
      [3, 'three'],
    ]);
    ```
  
- 和Object的区别

  - `Map` 对象继承自 `Obeject` 对象,可以通过原型继承去调用 `Object` 身上的原型方法
  - Map只能new，Object可以直接大括号或者Object.create
  - Map实现了迭代器，可以for-of，且按插入顺序返回
  - 在 `Map` 对象中,该对象的 `key` 可以是任何类型的值,而在普通对象中的 `key` 只能是 `string` 类型(`number`类型会自动转变成 `string` 类型)和 `Symbol` 类型,如果传进来的是复杂类型会自动报错。

### Set

- Set和Map的实例属性一样
- 对于实例方法，Set没有get和set，只有add
- Set的keys()、values()是一个东西，entries()返回则是\[value,value\]，同样他们返回的也是迭代器
- 其他方法和map一样

### WeakMap

- weakMap的键只能是object，这样可以及时回收
- 键不会被引用记录（值依然会被记录）
- WeakMap不可迭代
- WeakMap没有map的属性，只有delete、get、set、has方法

### WeakSet

- 同样的，集合中的值只能是对象
- 不会被引用计数记录
- 也是不能迭代的
- 只有add、delete、has方法

### Array

- 构造函数

  - new Array()
  - new Array(element1,element2...)
  - new Array(length)

- 注意事项

  - 关于下标， 可以用引号包裹数组下标，但是不能加东西，比如years['2'] !== years['02']并不一样，years['2']是一个 实际的数组索引， `years['02']` 是一个在数组迭代中不会被访问的任意字符串属性。 
  - 手动增加length，会加入空槽位empty，减少则会截断多余的。

- 属性

  - length
  - 和map一样的\[Symbol.species\](静态)

- 静态方法

  - from(arrayLike,mapFn,thisArg)从一个可迭代或者类数组对象创造新的数组,mapFn如果被指定则为新数组都执行一次，thisArg则指定mapFn的this对象
  - isArray()查询是否是Array
  - of(e1,e2,e3...) Array.of(1)->[1] Array.of(1, 2, 3)-> [1, 2, 3] Array.of(undefined)-> [undefined]

- 实例方法

  - \[Symbol.iterator\]()、values() 返回一个迭代器，生成数组中值。 entries()->[index,value]迭代器，keys()->index

  - 变异方法

    - copyWithin(target,start=0,end=arr.length)把[start,end)的元素复制到target位置

    - ```javascript
      [1, 2, 3, 4, 5].copyWithin(-2)
      // [1, 2, 3, 1, 2]
      
      [1, 2, 3, 4, 5].copyWithin(0, 3)
      // [4, 5, 3, 4, 5]
      
      [1, 2, 3, 4, 5].copyWithin(0, 3, 4)
      // [4, 2, 3, 4, 5]
      
      [1, 2, 3, 4, 5].copyWithin(-2, -3, -1)
      // [1, 2, 3, 3, 4]
      ```

    - fill(value,start=0,end=arr.length)

    - pop、push、shift、unshift、splice(start,deleteCount?,insertE1,insertE2,insertE3...)

    - sort、reverse

  - 返回新数组的方法

    - concat(e1,e2...)

    - filter、map

    - splice()返回被删除的元素数组、slice(start=0,end=length)子集

    - flat(depth=1)展平数组，flatMap=map+flat(depth只能为1)

    - ```javascript
      let arr1 = ["it's Sunny in", "", "California"];
      
      arr1.map(x => x.split(" "));
      // [["it's","Sunny","in"],[""],["California"]]
      
      arr1.flatMap(x => x.split(" "));
      // ["it's","Sunny","in", "", "California"]
      ```

  - 其他方法

    - at(index)，返回array[index]，如果是负数就从右往左数
    - every(cb),some(cb)判断用的
    - find()、findIndex()、findLast()、findLastIndex()
    - forEach()
    - includes(searchElement,fromIndex=0)查询是否存在某元素、indexOf(searchElement,fromIndex=0)查询第一个是searchElement的元素的索引 lastIndexOf倒着找
    - join(separator='')将所有元素以separator链接为字符串
    - reduce、reduceRight

- 数组与其他类型转换 

```javascript
![]
false
![1,2,3]//永远是真( o｀ω′)ノ
false
Number([])
0
Number([1])
1
Number([1,2])
NaN
Number(['d'])
NaN
Number(['1'])
1
String([1,2,3])
'1,2,3'
Boolean([false])
true
```

# BigInt

- bigint可以和number比较，但是不能计算，Math的方法也不能使用
- BigInt(value:number|string)
- bigint表示出的数字后边会根一个n
- 静态方法
  - asIntN(width, bigint) 将 BigInt 值转换为一个 -2^(width-1) 与 2^(width-1) - 1 之间的有符号整数。 
  - asUintN(width, bigint) 将一个 BigInt 值转换为 0 与 2^(width) - 1 之间的无符号整数。 
- 实例方法
  - toString
  - valueOf

# JSON

- parse
- stringify

# WeakRef(保留意见)

 允许保留对另一个对象的弱引用，而不会阻止被弱引用对象被 GC 回收 

```javascript
let x =new WeakRef(targetObject)//构造器
x.deref()//返回当前实例的 WeakRef 对象所绑定的 target 对象，如果该 target 对象已被 GC 回收则返回undefined
```

# RegExp

### 构造函数

```javascript
/ab+c/i
new RegExp(/ab+c/, 'i') // 字面量
new RegExp('ab+c', 'i') // 构造函数
//这三种方式等价
///pattern/flags
//new RegExp(pattern[, flags])
//RegExp(pattern[, flags])
```

### 属性lastIndex

```javascript
lastIndex = regExpObj.lastIndex;//用来指定下一次匹配的起始索引，只有正则表达式使用了表示全局检索的 "g" 或者粘性检索的 "y" 标志时，该属性才会起作用。此时应用下面的规则：
/*如果 lastIndex 大于字符串的长度，则 regexp.test 和 regexp.exec 将会匹配失败，然后 lastIndex 被设置为 0。
如果 lastIndex 等于或小于字符串的长度，则该正则表达式匹配从 lastIndex 位置开始的字符串。
如果 regexp.test 和 regexp.exec 匹配成功，lastIndex 会被设置为紧随最近一次成功匹配的下一个位置。
如果 regexp.test 和 regexp.exec 匹配失败，lastIndex 会被设置为 0*/
```

### 实例属性

- flags，就是正则规则flags字符串
- dotAll，是否匹配新行
- global，是否全局匹配
- ignoreCase，是否忽略大小写
- multiline是否多行匹配
- source，正则表达式本体字符串
- sticky，是否粘性匹配
- unicode， Unicode 功能是否开启。 

### 实例方法

- exec(str) 在一个指定字符串中执行一个搜索匹配。返回一个结果数组或 `null`。  如果匹配成功，`exec()` 方法返回一个数组，并更新正则表达式对象的 `lastIndex`属性。完全匹配成功的文本将作为返回数组的第一项，从第二项起，后续每项都对应一个匹配的捕获组。其实就是原始文本是arr[0],arr[1]及之后都是被匹配到的东西。如果匹配不到，归零lastIndex

- test(str) 返回str从lastIndex开始是否有对应匹配

- 下面是几个使用Symbol调用的方法

- ```javascript
  var re = /[0-9]+/g;
  var str = '2016-01-02';
  var result = re[Symbol.match](str);
  console.log(result);  // ["2016", "01", "02"]
  
  var re = /[0-9]+/g;
  var str = '2016-01-02';
  var result = re[Symbol.matchAll](str);
  console.log(Array.from(result, x => x[0]));
  // ["2016", "01", "02"]
  
  var re = /-/g;
  var str = '2016-01-01';
  var newstr = re[Symbol.replace](str, '.');
  console.log(newstr);  // 2016.01.01
  
  var re = /-/g;
  var str = '2016-01-02';
  var result = re[Symbol.search](str);
  console.log(result);  // 4
  
  var re = /-/g;
  var str = '2016-01-02';
  var result = re[Symbol.split](str);
  console.log(result);  // ["2016", "01", "02"]
  ```

# Date

### 构造函数

```javascript
new Date();
new Date(value);//数字时间戳
new Date(dateString);
new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);
```

### 静态方法

- Date.now()返回当前时间戳
- Date.parse(str)根据传入字符串解析成时间戳，有一些兼容问题。
- UTC()，可以看作Date的另一个构造函数， 接受的参数同 `Date` 构造函数接受最多参数时一样，但该前者会视它们为 UTC 时间，其返回从 1970 年 1 月 1 日 00:00:00 UTC 到指定时间的毫秒数。 

### 实例方法

- getDate()返回日
- getDay()返回星期几
- getFullYear()年份
- getHours、getMilliseconds、getMinutes、getMonth、getSeconds
- getTime()返回 从 1970 年 1 月 1 日 0 时 0 分 0 秒（UTC，即协调世界时）距离该日期对象所代表时间的毫秒数。 
- 其他set、get以及toJSON、toString方法直接阅读API

# Symbol

### Symbol没有构造函数

- 不支持new Symbol
- 你只能Symbol(\[描述内容\])来获取一个新的symbol

### Symbol应用

- symbol作为对象的键，只能obj\[symbol\]获取

- ```javascript
  const name = Symbol('name');
  const obj = {
      [name]: 'ClickPaas',
  }
  ```

- 消除硬编码

- ```javascript
  const tabTypes = {
      basic: Symbol(),
      super: Symbol(),
  }
  
  if (type === tabTypes.basic) {
      return <div>basic tab</div>
  }
  
  if (type === tabTypes.super) {
      return <div>super tab</div>
  }
  ```

- Symbol.for 可共享，在创建的时候会检查全局是否寻在这个key的symbol.如果存在就直接返回这个symbol,如果不存在就会创建，并且在全局注册。 

- ```javascript
  let uid = Symbol.for("uid");
  let object = {
      [uid]: "12345"
  };
  
  console.log(object[uid]);       // "12345"
  console.log(uid);               // "Symbol(uid)"
  
  let uid2 = Symbol.for("uid");
  
  console.log(uid === uid2);      // true
  console.log(object[uid2]);      // "12345"
  console.log(uid2);              // "Symbol(uid)"
  Symbol.keyFor(uid)				// "uid"
```
  
- 为复杂对象添加属性且不会覆盖已有属性

- ```javascript
  let obj = {[Symbol('name')]:1}
  obj[Symbol('name')]=2
  obj//{Symbol(name): 1, Symbol(name): 2}
  Object.getOwnPropertySymbols(obj)//[Symbol('name'),Symbol('name')]
  ```

# Promise介绍

### 构造函数

- new Promise((resolution,reject)),resolution就是.then(()=>{})方法，reject就是.catch(()=>{})方法，当然如果.then里面就俩函数，那么第二个函数就是reject

-  `.then` 或者 `.catch` 都会返回一个新的 promise，如果返回值不是promise会包装成promise，返回的值不能是 promise 本身

- .finally最终返回的默认会是一个上一次的Promise对象值，不过如果抛出的是一个异常则返回异常的Promise对象。

- then方法接受的参数是函数，而如果传递的并非是一个函数，它实际上会将其解释为then(null)，这就会导致前一个Promise的结果会传递下面。 

  ```javascript
  let x = new Promise((resolve)=>{
      return
      resolve()
  }).then(()=>{
      console.log(111)
  })
  //x永远pending
  let x = new Promise((resolve)=>{
      setTimeout(resolve)
      return
      resolve()
  }).then(()=>{
      console.log(111)
  })
  //x下一轮fulfilled
  let x = new Promise((resolve)=>{
      resolve()
      resolve()
      resolve()
  }).then(()=>{
      console.log(111)
  })
  //只会输出一个111
  let p = new Promise((resolve)=>{
      resolve()
  })
  p.then(()=>{
      console.log(1)
  })
  p.then(()=>{
      console.log(2)
  })
  //1 2都会输出
  let p = new Promise((resolve)=>{
      resolve(1233)
  }).then(123).then((res)=>{
      console.log(res)
  })
  //1233
  ```

### 静态方法

- Promise.all(迭代对象)返回一个Promise，等待所有可迭代对象里的Promise执行结束后返回他们处理出来的结果，如果有一个错误就直接catch出第一个错误，数组顺序按照可迭代对象排列

- ```javascript
  var p1 = Promise.resolve(3);
  var p2 = 1337;
  var p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
  });
  
  Promise.all([p1, p2, p3]).then(values => {
    console.log(values); // [3, 1337, "foo"]
  });
  ```

- Promise.race(可迭代对象)第一个结束的

- ```javascript
  var p1 = new Promise(function(resolve, reject) {
      setTimeout(resolve, 500, "one");
  });
  var p2 = new Promise(function(resolve, reject) {
      setTimeout(resolve, 100, "two");
  });
  
  Promise.race([p1, p2]).then(function(value) {
    console.log(value); // "two"
    // 两个都完成，但 p2 更快
  });
  
  var p3 = new Promise(function(resolve, reject) {
      setTimeout(resolve, 100, "three");
  });
  var p4 = new Promise(function(resolve, reject) {
      setTimeout(reject, 500, "four");
  });
  
  Promise.race([p3, p4]).then(function(value) {
    console.log(value); // "three"
    // p3 更快，所以它完成了
  }, function(reason) {
    // 未被调用
  });
  
  var p5 = new Promise(function(resolve, reject) {
      setTimeout(resolve, 500, "five");
  });
  var p6 = new Promise(function(resolve, reject) {
      setTimeout(reject, 100, "six");
  });
  
  Promise.race([p5, p6]).then(function(value) {
    // 未被调用
  }, function(reason) {
    console.log(reason); // "six"
    // p6 更快，所以它失败了
  });
  
  ```

- Promise.any(可迭代对象)

- ```javascript
  const pErr = new Promise((resolve, reject) => {
    reject("总是失败");
  });
  
  const pSlow = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, "最终完成");
  });
  
  const pFast = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "很快完成");
  });
  
  Promise.any([pErr, pSlow, pFast]).then((value) => {
    console.log(value);
    // pFast fulfils first
  })
  // 期望输出："很快完成"有一个完成就全部完成，除非全失败，返回 All promises were rejected
  ```

- Promise.reject(reason)：直接返回一个带有reason的拒绝 `Promise` 对象 

- ```javascript
  Promise.reject(new Error('fail')).then(function() {
    // not called
  }, function(error) {
    console.error(error); // Stacktrace
  });
  ```

- Promise.resolve(value)：直接返回一个带有value或者thenable对象的 `Promise` 对象 

- ```javascript
  Promise.resolve("Success").then(function(value) {
    console.log(value); // "Success"
  }, function(value) {
    // 不会被调用
  });
  
  // Resolve 一个 thenable 对象
  var p1 = Promise.resolve({
    then: function(onFulfill, onReject) { onFulfill("fulfilled!"); }
  });
  console.log(p1 instanceof Promise) // true，这是一个 Promise 对象
  
  p1.then(function(v) {
      console.log(v); // 输出"fulfilled!"
    }, function(e) {
      // 不会被调用
  });
  
  // Thenable 在 callback 之前抛出异常
  // Promise rejects
  var thenable = { then: function(resolve) {
    throw new TypeError("Throwing");
    resolve("Resolving");
  }};
  
  var p2 = Promise.resolve(thenable);
  p2.then(function(v) {
    // 不会被调用
  }, function(e) {
    console.log(e); // TypeError: Throwing
  });
  ```

- ```javascript
  let p = new Promise((resolve,reject)=>{
      setTimeout(()=>{
          console.log('first')
          resolve("first")
      },1000)
  }).then((v)=>{
      return new Promise((resolve,reject)=>{
          setTimeout(()=>{
              console.log("second",v)
              resolve('third')
          },1000)
      })
  }).then((v)=>{
          setTimeout(()=>{
              console.log("forth",v)
              resolve('third')
          },1000)
  })//一个链式调用的例子
  ```

# Reflect

这个对象没有实例，它更像是一个方法集合。

### 只有静态方法

- set(obj,propkey,value,receiver)，为obj设置propkey属性为value，如果遇到setter，receiver则被设置为setter方法的this值。
- get(obj,propkey,receiver)类似set的读取属性
- has(obj,propkey)查找是否有对应属性
- preventExtensions(obj)、isExtensible(obj),getPrototypeOf(obj),setPrototypeOf(obj)->返回boolean，其实就是Object里的同名方法，不过它遇到非对象不会自动转换为对象而是抛异常
- ownKeys：等价于Object.getOwnPropertyNames+Object.getOwnPropertySymbols
- getOwnPropertyDescriptor(obj,propkey)，类似Object的同名函数，返回属性描述对象，不过它遇到非对象不会自动转换为对象而是抛异常
- defineProperty(obj,propKey,attribute)，定义obj.propkey=attribute,返回设置是否成功
- deleteProperty(obj,propKey)，和delete obj.propkey一样，返回的是boolean
- construct(target,argumentsList,newTarget?) 相当于运行 `new target(...args)`. 
  new.target 检测函数或构造方法是否是通过new运算符被调用的。在通过new运算符被初始化的函数或构造方法中，`new.target`返回一个指向构造方法或函数的引用。在普通的函数调用中，`new.target` 的值是undefined。 newTarget 作为新创建对象的原型对象的 `constructor` 属性，默认值为 `target`。 
- Reflect.apply(target, thisArgument, argumentsList) 该方法与 Function.prototype.apply()方法类似：调用一个方法并且显式地指定 `this` 变量和参数列表 (arguments) ，参数列表可以是数组，或类似数组的对象。 

# Proxy

### 构造

- new Proxy(target,handler)

- 代理target，handler是代理对象上的自定义行为

-  handler它们会对底层被代理对象的调用进行劫持。 

- 不是`透明代理`,也就是说：即使handler为空对象（即不做任何代理），代理人中的this指向也不是源对象，而是proxyObj对象。 

- |           handler配置           |             对应的劫持行为             |
  | :-----------------------------: | :------------------------------------: |
  |              apply              |                函数调用                |
  |            construct            |                  new                   |
  |         defineProperty          |        Object.defineProperty()         |
  |         deleteProperty          |              delete操作符              |
  |            get、set             |                读写操作                |
  |    getOwnPropertyDescriptor     |    Object.getOwnPropertyDescriptor     |
  |         getPrototypeOf          |           读取原型时就会调用           |
  |               has               |                in操作符                |
  | isExtensible、preventExtensions | Object.isExtensible、preventExtensions |
  |             ownKeys             |            Reflect.ownKeys             |
  |         setPrototypeOf          |         Object.setPrototypeOf          |

### 细说handler

- get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
- set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
- has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
- deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
- ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
- defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
- getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
- isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
- setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。