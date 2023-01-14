---
title: "JS常见问题"
date: "2023-01-14"
---

# 变量提升

- 对于所有带var和function的函数，都会进行变量提升

- var提前声明，function会提前声明和定义

- ‘对于一个函数的作用域，函数执行时也会变量提升

- function func; 高版本浏览器中用判断或者循环等包裹起来的函数，在变量提升阶段，不论条件是否成立，只会先声明，进入块以后才会提升定义

- ```javascript
  console.log(func); //=>undefined
  if (1 === 1) {
  	// 此时条件成立，进来的第一件事情还是先把函数定义了（迎合ES6中的块作用域） => func=function(){ .... }
  	console.log(func); //=>函数
  	function func() {
  		console.log('OK');
  	}
  	console.log(func); //=>函数
  }
  console.log(func); //=>函数
  ```

- 如果函数重复定义，那么最后提升的是最后一次定义。

- 对于var，只要不是在函数中，无论块作用域是否被执行都会有提升

- 注意，自执行函数的作用域也理解为函数作用域

# var、无var、let

- 全局对象GO：是浏览器天生自带的存储属性和方法的堆，是一个对象（window）；
- 全局变量对象VO：是我们自己写代码创建的变量要存储的地方；是栈内存；
- 全局上下文
  - 带VAR是创建一个全局变量，存放在全局变量对象VO(G)中，并且在GO中也存储一份
  - 不带VAR创建的不是变量，而是全局对象GO（global object）的一个属性
  - let和GO无关，仅仅是全局变量，且不存在重复定义和变量提升
- 私有上下文
  - var x=1，会在私有上下文中的私有变量对象AO中创建x
  - x=1，沿着作用域链一直向上查找，找不到就会给GO设置一个x属性
  - let x=1，旨在私有上下文里边用
- let的块级作用域
  - 除对象/函数等大括号以外，如果在其余的大括号中（例如：判断和循环）出现 LET/CONST 等，则会把当前大括号包起来的部分形成一个独立的私有上下文，基于 LET/CONST创建的变量是当前块级作用域域中的私有变量;
  - 在循环中，每一个循环都会形成新的子作用域
- 也就是说，var只在全局会给GO创建属性，且会真正存在作用域的变量对象中，而不带var的操作都是基于Go的，let则只和VO、AO有关
- var a = b = 12；  相当于：var a = 12; b = 12。var a=12 , b=12 相当于var a = 12;  var b = 12;  
- let、var定义过的变量无法delete删除(全局变量)

# 闭包

>  函数执行形成的私有上下文，即能保护里面的私有变量不受外界干扰，也能在当前上下文中保存一些信息
>
> > 保护这个上下文中会有一些私有的变量不会与外界冲突
> >
> > 保存上下文中的某些内容（函数柯里化）
>
> 闭包内的值如何暴露
>
> > window.xxx=xxx
> >
> > 返回需要的值组成对象
>
> 高阶函数
>
> > 返回函数的函数，这个函数的上下文依然是本函数，因此也会保存返回函数使用的的部分变量

# 类

### 构造函数

- ```javascript
  function Func(name, age) {
      this.name = name; 
      this.age = age;
  }
  let f1 = Func('李', 18);//=> 把Func函数执行（当做普通函数执行）
  //=>方法中的THIS:window
  console.log(f1); //=>undefined 因为没有返回值
  console.log(window.name, window.age); //=>'李'  18
  
  
  let f2 = new Func('李', 18);
  console.log(f2); //=> {name: "李", age: 18}
  console.log(window.name, window.age); //=> window.name是空  window.age是undefined
  ```

- new函数()这种方式就是基于构造函数的方法执行，返回的结果就是一个类的实例

- new Fn,无括号就是无参数的new

- new函数执行中，会把this指向新创建的实例对象

- 注意，如果构造函数有return并且是一个应用数据类型就会覆盖new 的执行结果

### 原型链

- 每个函数都有prototype属性，值是一个对象
- prototype原型对象中默认存在一个constructor属性，指向函数本身
- 每一个对象都是\_\_proto\_\_属性，值是当前实例所属类的prototype原型
- Object类的\_\_proto\_\_为null
- 函数的\_\_proto\_\_是Function.prototype，Function构造函数本身的\_proto\_也是Function.prototype
- Function.prototype的\_\_proto是Object.prototype，而Object构造函数的\_\_proto\_\_是Function.prototype
- 查找属性时，按照先自己，再\_\_proto\_\_逐层查找

### 如何手动实现继承

#### 重载

- 这在JS中几乎不可能，因为JS的弱类型和函数的若要求
- 我们如果要实现重载，只能手动在函数体内部进行参数判断

#### 重写

- 这个很简单，原型链查找

#### 继承

- 原型链继承， 即重写原型对象，代之以一个新类型的实例。 

- ```javascript
  function SuperType() {
      this.property = true;
  }
  
  SuperType.prototype.getSuperValue = function() {
      return this.property;
  }
  
  function SubType() {
      this.subproperty = false;
  }
  
  // 这里是关键，创建SuperType的实例，并将该实例赋值给SubType.prototype
  SubType.prototype = new SuperType(); 
  
  SubType.prototype.getSubValue = function() {
      return this.subproperty;
  }
  
  var instance = new SubType();
  console.log(instance.getSuperValue()); // true
  ```

- 不用原型，使用父类的构造函数增强子类实例

- ```javascript
  function  SuperType(){
      this.color=["red","green","blue"];
  }
  function  SubType(){
      //继承自SuperType
      SuperType.call(this);
  }
  var instance1 = new SubType();
  instance1.color.push("black");
  alert(instance1.color);//"red,green,blue,black"
  
  var instance2 = new SubType();
  alert(instance2.color);//"red,green,blue"
  //但是这种方法只能继承父类的实例属性和方法，不能继承原型属性/方法
  ```

- 组合起来用原型链实现对**原型**属性和方法的继承，用借用构造函数技术来实现**实例**属性的继承。

- ```javascript
  function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
  }
  SuperType.prototype.sayName = function(){
    alert(this.name);
  };
  
  function SubType(name, age){
    // 继承属性
    // 第二次调用SuperType()
    SuperType.call(this, name);
    this.age = age;
  }
  
  // 继承方法
  // 构建原型链
  // 第一次调用SuperType()
  SubType.prototype = new SuperType(); 
  // 重写SubType.prototype的constructor属性，指向自己的构造函数SubType
  SubType.prototype.constructor = SubType; 
  SubType.prototype.sayAge = function(){
      alert(this.age);
  };
  
  var instance1 = new SubType("Nicholas", 29);
  instance1.colors.push("black");
  alert(instance1.colors); //"red,blue,green,black"
  instance1.sayName(); //"Nicholas";
  instance1.sayAge(); //29
  
  var instance2 = new SubType("Greg", 27);
  alert(instance2.colors); //"red,blue,green"
  instance2.sayName(); //"Greg";
  instance2.sayAge(); //27
  
  //因为原型链的原因，对于继承来的属性的查找止步于this
  ```

- 缺点就是在使用子类创建实例对象时，其原型中会存在两份相同的属性/方法。 

- 借助空对象

- ```javascript
  function object(obj){
    function F(){}
    F.prototype = obj;
    return new F();
  }
  
  var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
  };
  
  var anotherPerson = object(person);
  anotherPerson.name = "Greg";
  anotherPerson.friends.push("Rob");
  
  var yetAnotherPerson = object(person);
  yetAnotherPerson.name = "Linda";
  yetAnotherPerson.friends.push("Barbie");
  
  alert(person.friends); //"Shelby,Court,Van,Rob,Barbie"
  ```

-  多个实例的引用类型属性指向相同，存在篡改的可能。 无法传递参数

- 寄生式继承， 在空对象继承的基础上，增强对象，返回构造函数 

- ```javascript
  function createAnother(original){
    var clone = object(original); // 通过调用 object() 函数创建一个新对象
    clone.sayHi = function(){  // 以某种方式来增强对象
      alert("hi");
    };
    return clone; // 返回这个对象
  }
  ```

- 缺点和空对象继承一样

- 寄生组合

- ```javascript
  function inheritPrototype(subType, superType){
    var prototype = Object.create(superType.prototype); // 创建对象，创建父类原型的一个副本
    prototype.constructor = subType;// 增强对象，弥补因重写原型而失去的默认的constructor 属性
    subType.prototype = prototype;  // 指定对象，将新创建的对象赋值给子类的原型
  }
  
  // 父类初始化实例属性和原型属性
  function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
  }
  SuperType.prototype.sayName = function(){
    alert(this.name);
  };
  
  // 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
  function SubType(name, age){
    SuperType.call(this, name);
    this.age = age;
  }
  
  // 将父类原型指向子类
  inheritPrototype(SubType, SuperType);
  
  // 新增子类原型属性
  SubType.prototype.sayAge = function(){
    alert(this.age);
  }
  
  var instance1 = new SubType("xyc", 23);
  var instance2 = new SubType("lxy", 23);
  
  instance1.colors.push("2"); // ["red", "blue", "green", "2"]
  instance1.colors.push("3"); // ["red", "blue", "green", "3"]
  ```

- maxin多继承

- ```javascript
  function MyClass() {
       SuperClass.call(this);
       OtherSuperClass.call(this);
  }
  
  // 继承一个类
  MyClass.prototype = Object.create(SuperClass.prototype);
  // 混合其它
  Object.assign(MyClass.prototype, OtherSuperClass.prototype);
  // 重新指定constructor
  MyClass.prototype.constructor = MyClass;
  
  MyClass.prototype.myMethod = function() {
       // do something
  };
  ```

# this问题

### 使用情况

- 全局下this是window，如果是严格模式则是undefined
- 函数体的this基于有没有点，如果有.就是.前边的东西
- 自执行函数和全局一样，注意，就算他是对象里边的自执行函数也和全局一样
-  回调函数里的this一般情况下是window，除非是DOM事件this是元素本身
- 箭头函数没有this，但是要是在箭头函数里使用this，他就会往上一级作用域查找，如果上一级作用域也没有，那就继续往上找，直到找到全局的window为止 ，他的this基于写在哪里而不是谁调用了他。
-  构造函数里的this是当前实例
-   实例原型上的公有方法里的this一般是当前实例

### apply、call、bind

- call

  - 函数.call(context,params1,params2....)

  - 如果没有任何参数，那么this就是全局this(window或undefined)

  - ```javascript
    obj={
        fn:function(){
            console.log(this)
        }
    }
    obj.fn.call()//window
    obj.fn.call({})//{}
    ```

- apply

  - 和call一样，只不过是参数按数组传递
  - 函数.apply(context,[params1,params2....])

- bind

  - 函数.bind(context,params1,....)

  - bind是预处理this，他并不会让函数执行

  - bind方法的返回值是一个改变this之后的新函数

  - ```javascript
    var newFn = obj.fn.bind(1)
    newFn()//Number 1
    ```

# EventLoop

### 三大数据结构

- stack栈
- queue队列
- heap堆

### 两种任务

- macroTask宏任务，包括全部代码，定时器，IO，UI绘制
- microTask微任务， Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver

### 本体

- 有一个主线程和一个调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。 
- 当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。 
- 同步任务会在调用栈中按照顺序等待主线程依次执行，异步任务会在异步任务有了结果后，将注册的回调函数放入任务队列中等待主线程空闲的时候（调用栈被清空），被读取到栈内等待主线程的执行。 
- 执行栈在执行完**同步任务**后，查看**执行栈**是否为空，如果执行栈为空，就会去检查**微任务**(`microTask`)队列是否为空，如果为空的话，就执行`Task`（宏任务），否则就一次性执行完所有微任务。每次**单个宏任务**执行完毕后，检查**微任务**(`microTask`)队列是否为空，如果不为空的话，会按照**先入先**出的规则全部执行完**微任务**(`microTask`)后，设置**微任务**(`microTask`)队列为`null`，然后再执行**宏任务**，如此循环。
- 可以认为，所有的同步代码是一个宏任务。
- RAF，这个东西不是微任务也不是宏任务，要把它理解为下一次重绘之前更新动画帧所调用的函数
- 事件属于同步任务 

# 网络编程

### XMLHttpRequest

- let xhr = new XMLHttpRequest()
- 实例方法

  - xhr.open(method, url, async, user, password);
  - xhr.setRequestHeader(header, value)
  - xhr.getResponseHeader(name)、xhr.getAllResponseHeaders
  - xhr.send(body?)
  - xhr.abort()
- 属性
  - 关于状态：readyState(0~4)、statusText("OK"、""、"notFound")、status(0,200,404...)
  - timeout最长等待时间
  - upload： 表示上传的进度， 通过对其绑定事件来追踪它的进度(onprogress)。 
  - 关于响应：response、responseType("","json","arraybuffer","ms-stream","text","blob")、responseXML、responseURL、reponseText
- 事件
  - abort、error、timeout
  - loadstart、load加载完成、loadend加载结束或意外中止
  - progress加载中
  - readystatechange
