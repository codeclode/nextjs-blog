---
title: "ES6+"
date: "2023-01-13"
---

# ES2015

### let与const

- 作用域
  - 全局
  - 函数
  - 块级
- 声明方式
  - var在全局代码执行
  - const和let只能所属代码块执行，且const声明后必须马上赋值。
- 注意
  - let和const不允许重复声明且不存在变量提升
  - 块级使用全局不能用，注意和var不同
  - let声明产生暂时性死区，就是在声明以前使用，报错。

```javascript
for(let i = 0;i < 9;i++){
    console.log(i);
    //0-8
}
for(let i = 0;i < 9;i++){
    console.log(i);
    //报错
    let i = '9';
}
for(let i = 0;i < 9;i++){
    let i = '9';  
    console.log(i)//9个9 
}
```

解释一下 **for循环会在迭代之前创建一个和初始化变量同名的变量，并使用之前迭代的终值将这个变量初始化以后，再交还给执行上下文**。

```javascript
(let i = 0) {
    console.log(i)
}
```

对于第3个循环，在新环境里创建的是一个可变的绑定，因此如果在循环体内重复声明一个名字为`i`的变量，只是会影响循环体内执行语句对`i`值的访问。 而对于第2个循环，这个意思是我虽然没有提升变量，但是我先解绑了外边的let。

### 解构赋值

- 字符串 \[a,b,c\]="abc"

- 数值结构 const { toSting : s } = 123...请自动过滤

- 对象结构

  - const {x,y} =  { x: 1, y: 2 } 
  - const { x, y = 2 } = { x: 1 } 
  - const { x, y: z } = { x: 1, y: 2 } 

- 数组结构，任何有iterator接口的数据结构都可以这样解构

  - const[x,y=2]=[1]

- 函数参数解构

  - 数组function Func([x=0,y=1]){}

  - 对象function Func({x=0,y=1}={}){}，这里参数加={}的意思是默认值

  - ```javascript
    function Func({x=0,y=1}={}){}
    //可以传入Func({})或者Func()
    function Func({x=0,y=1}){}
    //则不能Func()
    ```

### 模板字符串

### 对象简化写法

```javascript
let name = "訾博";
let change = function(){
	console.log("活着就是为了改变世界！");
}
//创建对象
const school = {
	name,
	change,
	say(){
		console.log("言行一致！");
	}
}
```

### 函数扩展

- 默认值，参数=xxx
- rest参数
  - function Func(a,b,...args)，args是第三个及其以后的参数数组
- 函数name属性
  - 将匿名函数赋值给变量：`空字符串`(**ES5**)、`变量名`(**ES6**)
  - 将具名函数赋值给变量：`函数名`(**ES5和ES6**)
  - bind返回的函数：`bound 函数名`(**ES5和ES6**)
  - Function构造函数返回的函数实例：`anonymous`(**ES5和ES6**)
- 箭头函数：()=>{}、x=>返回值、({x,y})=>{},this是定义时所在对象，没有arguments和yield

### 扩展运算符，\[...arr\]

### 正则扩展，详见Day4

### Symbol

这里对Symbol详细说明

- 方法
  - **Symbol()**：创建以参数作为描述的Symbol值(不登记在全局环境)
  - **Symbol.for()**：创建以参数作为描述的Symbol值，如存在此参数则返回原有的Symbol值(先搜索后创建，登记在全局环境)
  - **Symbol.keyFor()**：返回已登记的Symbol值的描述(只能返回Symbol.for()的key)
  - **Object.getOwnPropertySymbols()**：返回对象中所有用作属性名的Symbol值的数组

- 内置的值，这些值都是作为某个对象类型的属性去使用

  - **Symbol.hasInstance**：指向一个内部方法，当其他对象使用`instanceof运算符`判断是否为此对象的实例时会调用此方法
  - **Symbol.isConcatSpreadable**：指向一个布尔，定义对象用于`Array.prototype.concat()`时是否可展开
  - **Symbol.species**：指向一个构造函数，当实例对象使用自身构造函数时会调用指定的构造函数
  - **Symbol.match**：指向一个函数，当实例对象被`String.prototype.match()`调用时会重新定义`match()`的行为
  - **Symbol.replace**：指向一个函数，当实例对象被`String.prototype.replace()`调用时会重新定义`replace()`的行为
  - **Symbol.search**：指向一个函数，当实例对象被`String.prototype.search()`调用时会重新定义`search()`的行为
  - **Symbol.split**：指向一个函数，当实例对象被`String.prototype.split()`调用时会重新定义`split()`的行为
  - **Symbol.iterator**：指向一个默认遍历器方法，当实例对象执行`for-of`时会调用指定的默认遍历器
  - **Symbol.toPrimitive**：指向一个函数，当实例对象被转为原始类型的值时会返回此对象对应的原始类型值
  - **Symbol.toStringTag**：指向一个函数，当实例对象被`Object.prototype.toString()`调用时其返回值会出现在`toString()`返回的字符串之中表示对象的类型
  - **Symbol.unscopables**：指向一个对象，指定使用`with`时哪些属性会被`with环境`排除

  ```javascript
  class Person{
  static [Symbol.hasInstance](param){
  		console.log(param);
  		console.log("我被用来检测类型了");
  		return false;
  	}
  }
  let o = {};
  console.log(o instanceof Person);
  const arr = [1,2,3];
  const arr2 = [4,5,6];
  // 合并数组：false数组不可展开，true可展开
  arr2[Symbol.isConcatSpreadable] = false;
  console.log(arr.concat(arr2));
  //输出：{},我被用来检测类型了，false
  ```

### 加入map、set、weakmap、weakset

### 加入Promise

### 加入Reflect、Proxy

### Class

- 定义类的语法糖
- 原理就是原型链
- 方法和关键字
  - constructor,用来new的
  - extends，表示继承
  - super，父亲的this
  - static静态
  - get、set
- 属性
  - \_\_proto\_\_指向父亲
  - prototype.\_\_proto\_\_父亲的prototype

```javascript
class Phone{
constructor(brand,price) {
		this.brand = brand;
        this.price = price;
	}
	call(){
		console.log("我可以打电话！");
	}
}
class SmartPhone extends Phone{
// 构造函数
	constructor(brand,price,color,size) {
		super(brand,price); // 调用父类构造函数
		this.color = color;
		this.size = size;
	}
    
    get price(){
		console.log("价格属性被读取了！");
		return 123;
	}
	set price(value){
		console.log("价格属性被修改了！");
	}
    
	photo(){
		console.log("我可以拍照！");
	}
	game(){
		console.log("我可以玩游戏！");
	}
}
```

### 模块化ESM，nodeJS详细说明

### 迭代器

各个数据解构提供的用来遍历的一个封装好的指针

如何获取：data\[Symbol.iterator\]()

使用步骤：

- let iterator = xiyou\[Symbol.iterator\]();
- iterator.next()，返回value和done组成的对象，done为true表示迭代结束，这个是所有迭代器必须有的
- let iterator1 = xiyou\[Symbol.iterator]();重新初始化
- iterator1.return()直接返回{done:true}，迭代器可选方法
- 迭代器的throw()配合生成器使用

自定义迭代器：

```javascript
const banji = {
	name: "终极一班",
	stus: [
		'xiaoming',
		'xiaoning',
		'xiaotian',
		'knight'
	],
	[Symbol.iterator]() {
		// 索引变量
		let index = 0;
		// 保存this
		let _this = this;
		return {
			next: function() {
				if (index < _this.stus.length) {
					const result = {
						value: _this.stus[index],
						done: false
					};
    				index++;
					return result;
				} else {
					return {
						value: undefined,
						done: true
					};
				}
			}
		};
	}
}
```

### 生成器

一种异步编程的解决方案

如何定义

```javascript
function* foo(name){
    console.log(name,1)
    yield console.log(2)
    console.log(3)
    yield 4
    console.log(5)
    const name2 = yield console.log(6)
    console.log(7,name2)
}
```

如何调用

```javascript
const generator = foo(0)
generator.next()//0 1 2
generator.next()//3 返回值是{value:4,done:false}
generator.next(8)//5 6
generator.next()//7 8
```

提前结束

```javascript
const generator =  foo("name1")
console.log(generator.next("name1")) // {value:undefined, done: false}
// 通过return提前结束生成器
console.log(generator.return("name2")) // {value: 'name2', done: true}
```

异常

```java
const generator =  foo("name1")
console.log(generator.next("name1")) // {value:undefined, done: false}
console.log(generator.throw("name2 throw")) // Uncaught name2 throw
```

举例

```javascript
function getUsers(){
	setTimeout(()=>{
		let data = "用户数据";
		// 第二次调用next，传入参数，作为第一个的返回值
		iterator.next(data); // 这里将data传入
	},1000);
}
function getOrders(){
	setTimeout(()=>{
		let data = "订单数据";
		iterator.next(data); // 这里将data传入
	},1000);
}
function getGoods(){
	setTimeout(()=>{
		let data = "商品数据";
		iterator.next(data); // 这里将data传入
	},1000);
}
function * gen(){
	let users = yield getUsers();
	console.log(users);
	let orders = yield getOrders();
	console.log(orders);
	let goods = yield getGoods();
	console.log(goods); // 这种操作有点秀啊！
}
let iterator = gen();
iterator.next();
```

# ES7

### 指数运算符

2\*\*10=1024

# ES8

### 对象加入了一些静态方法，前面已经见过

### 字符串扩展

### 共享内存和原子操作

- 简单提一下

-  **Atomics** 对象提供了一组静态方法对 [`SharedArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) 和 [`ArrayBuffer`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 对象进行原子操作。 

- 多个共享内存的线程能够同时读写同一位置上的数据。原子操作会确保正在读或写的数据的值是符合预期的，即下一个原子操作一定会在上一个原子操作结束后才会开始，其操作过程不会中断。

-  将数据存储在一块共享内存空间中，这些数据可在JS主线程和web-worker线程之间共享 

### 字符串添加padEnd和padStart方法

### 允许函数最后一个参数有尾逗号

### Async与await 

```javascript
// async函数 + await表达式：异步函数
// 创建Prmise对象
const p = new Promise((resolve,reject)=>{
	resolve("成功啦！");
})
async function fn(){
	// await 返回的是 promise 成功的值
	let result = await p;
	console.log(result); // 成功啦！
}
fn();
```

- Async会自动返回Promise，如果return了其他了类型会进行自动包裹
- await命令只能用在Async函数之中，否则会报错
- 返回的Promise对象必须等到内部所有await命令Promise对象执行完才会发生状态改变，除非遇到return语句或抛出错误
- 一个await rejected，整个Async中断
- await 的 promise 失败了, 就会抛出异常, 需要通过 try...catch 捕获处理
- 不要和forEach一起用， forEach在内部进行调用的时候并没有使用await关键字来等待异步执行的结果，而是直接进行循坏，所以当然不会拿到结果。 

# ES9

### 对象使用扩展运算符

```javascript
const obj = { ...obj1, ...obj2 }
{ ..."hello" }//{0: 'h', 1: 'e', 2: 'l', 3: 'l', 4: 'o'}
{ ...[1, 2] }//{0: 1, 1: 2}
const { x, ...res } = { x: 1, y: 2, z: 3 }//x=1,res={y:2,z:3}
const obj = { x: 1, ...{ x: 2 } }//obj:{x: 2}
```

### 正则更加强大

### Promise加入finally,finally没有参数

### 异步迭代器(for-await-of)

```javascript
function Gen(time) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(time)
    },time)
  })
}

async function test() {
  let arr = [Gen(2000), Gen(1000), Gen(3000),123]
  for await(let item of arr) {
    console.log(Date.now(), item)
  }
}

test()
//首先停2秒
//1673576763410 2000
//不会停，马上输出，因为1s已经过去了
//1673576763410 1000
//再等1s输出
//1673576764408 3000
//1673576764408 123
//for await of 是可以对异步集合进行操作，这个意思是，先把异步执行获得值再进行操作


//自定义数据结构的异步迭代器
const obj = {
  count: 0,
  Gen(time) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve({ done: false, value:time })
      }, time)
    })
  },
  [Symbol.asyncIterator] () {
    let self = this
    return {
      next() {
        self.count++
        if(self.count < 4) {
          return self.Gen(Math.random() * 1000) //retuen的返回值是Gen函数的resolve返回的对象
        }else{
          return Promise.resolve({
            done: true,
            value: ''
          })
        }
      }
    }
  }
}
```

# ES10

### Object.fromEntries，Object.entries的逆运算

### 字符串加入trimStart和trimEnd方法

### 数组加入flat和flatMap方法

### Symbol实例description方法获取描述

# ES11

### BigInt

### 对象扩展

- 链判断操作符(?.)是否存在对象属性(不存在返回`undefined`且不再往下执行) 
  - 对象属性：`obj?.prop`、`obj?.[expr]`
  - 函数调用：`func?.(...args)`

- 空判断 (??)：是否值为`undefined`或`null`，是则使用默认值 

### 类的私有属性

```javascript
class c{
    #name;//私有属性
}
```

### Promise.allSettled()

- 和Promise.all的区别是，all要求全部成功，出现错误直接报错进catch，而allSettled则是返回所有状态和结果的数组，交给程序员处理。

### 动态import

```javascript
//hello.js
export function hello(){
	alert('Hello');
}

//app.js
// import * as m1 from "./hello.js"; // 传统静态导入
//获取元素
const btn = document.getElementById('btn');
btn.onclick = function(){
	import('./hello.js').then(module => {
		module.hello();
	});
}
```

### globalThis

- Browser：顶层对象是`window`
- Node：顶层对象是`global`
- WebWorker：顶层对象是`self`
- 以上三者：通用顶层对象是`globalThis`
- 方便跨环境使用global