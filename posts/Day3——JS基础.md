---
title: "JS基础"
date: "2023-01-11"
---

# 数据类型

### 基本数据类型

- 数字

  - NaN
  - 正常数字
  - infinity
  - Number类的静态方法
    - isInfinite是否有穷
    - isInteger是否为整数
    - isNaN，全局函数isNaN的安全版本
    - isSafeInteger
    - parseFloat、parseInt和全局函数相同
  - Number类的实例方法
    - toEcponential( fractionDigits  可选，用来指定小数点后有几位数字。 )以指数方法表示该数字(1.2e+1->12)
    - toFixed(digits小数点后数字的个数，介于 0 到 20) 使用定点表示法表示给定数字的字符串。 
    - toPrecision(  `precision` 一个用来指定有效数个数的整数)
    - toString(radix:指定进制)
    - 这几个返回都是字符串

- 字符串

  - 属性length

  - 静态方法

    - fromCharCode(num1[, ...[, numN]])根据utf-16生成对应字符串

    - fromCodePoint(num1[, ...[, numN]]) 使用指定的 Unicode 编码位置创建的字符串。 

    - raw

    - ```javascript
      String.raw`Hi\n${2+3}!`;
      // 'Hi\\n5!'，Hi 后面的字符不是换行符，\ 和 n 是两个不同的字符
      String.raw({ raw: 'test' }, 0, 1, 2); // 't0e1s2t'
      // 注意这个测试，传入一个 string，和一个类似数组的对象
      // 下面这个函数和 `foo${2 + 3}bar${'Java' + 'Script'}baz` 是相等的。
      String.raw({
        raw: ['foo', 'bar', 'baz']
      }, 2 + 3, 'Java' + 'Script'); // 'foo5barJavaScriptbaz'
      ```

  - 实例方法

    - at(index)类似charArray[index]，不过可以接收负数（倒着数）

    - charAt、charCodeAt、codePointAt(见名识意)

    - includes、indexOf、lastIndexOf、startWith、endsWith、concat不解释

    - localCompare，比较两个字符串，可以自定义比较方法

    - match、matchAll分别返回匹配正则表达式的值数组和迭代器

    - normalize按照指定unicode形式将字符串规范化

    - padEndwith，padStart，参数为长度和可选字符串

    - ```javascript
      'abc'.padEnd(10);          // "abc       "
      'abc'.padEnd(10, "foo");   // "abcfoofoof"
      'abc'.padEnd(6, "123456"); // "abc123"
      'abc'.padEnd(1);           // "abc"
      ```

    - repeat(count)返回重复count次的副本

    - replace、replaceAll，匹配对应字串或正则并修改为目标字串（也可以是一个替换函数）

    - search，返回符合正则匹配的第一个字串索引

    - split(分隔符，切割数量限制)、slice（beginIndex，endIndex?）不解释

    - substring类似slice，但是参数不能为负（不支持倒着数）

    - substr(start,length)

    - toLowerCase、toUpperCasse、trim、trimStart、trimEnd不解释

    - \[Symbol.iterator\]() 返回一个新的 Iterator 对象，它遍历字符串的代码点，返回每一个代码点的字符串值。 
    
    - ```javascript
      var strIter = string[Symbol.iterator]();
      
      console.log(strIter.next().value); // "A"
      console.log(strIter.next().value); // "\uD835\uDC68"
      ```

- 布尔

  - 只有toString和valueOf方法

- null

  - 就是空指针

- undefined

  - 未定义

- symbol

  - ES6解释此类型
  
- BigInt

### 引用类

- 对象object

  - 关于属性值描述

    - configurable：表示该属性的描述是否可以改变
    - enumerable：表示是否可以枚举(for in 和 keys)
    - value：属性值
    - writable：是否可以用等号修改
    - get：getter
    - set：setter
  - 静态方法
    - assign(target, ...sources)将sources的属性复制或覆盖到target（内部的引用值不会复制），只能复制可枚举的属性
    
    - create(proto,propertiesObject?)根据proto为原型创建对象，propertiesObject为自带的特定属性值，这个特定属性值必须是一个描述符对象。
    
    - Object.defineProperty(obj, prop, descriptor)，修改或定义prop属性值为descriptor
    
    - defineProperties(obj,props:{'xxx':描述符,'xxx':描述符})：多次执行defineProperty
    
    - entries、keys、values返回可枚举属性的k、v（不会遍历原型链上的，forin会）
    
    - setPrototypeOf(obj,prototype)设置新的原型对象|getyPrototypeOf获取原型对象
    
    - getOwnPropertyDescriptor(obj, prop)获取obj身上prop的属性描述
    
    - getOwnPropertyDescriptors(obj)获取一个对象的所有自身属性的描述符。 
    
    - getOwnPropertyNames(obj)获取obj身上的所有非继承的可枚举属性
    
    - getOwnPropertySymbols(obj)获取obj自身的所有可枚举的symbol键属性
    
    - hasOwn(instance, prop)查看instance自身（非继承）上是否有prop属性
    
    - is(v1,v2)符合人类理解的判断是否一致
    
    - preventExtensions让一个对象永远不能再添加新的属性 、seal 阻止添加新属性并将所有现有属性标记为不可配置。freeze冻结一个对象。冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。同时有对应的isExtensible、isFrozen、isSeal方法
    
    - fromEntries( iterable )，就是entries的逆操作
    
      ```javascript
      const arr = [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ];
      const obj = Object.fromEntries(arr);
      console.log(obj); // { 0: "a", 1: "b", 2: "c" }
      ```
  - 实例属性有constructor和\_\_proto\_\_
  - 实例方法
    - (define|lookup)(Getter|Setter)设置或读取属性的getter或setter，不要过多使用
    - hasOwnProperty(string|Symbol)查找对象中是否有对应的属性（非原型链上的）
    - isPrototypeOf(object)查找此对象是否在object的原型链上，注意object是子，调用者为父
    - propertyIsEnumerable(prop)返回对应prop是否可枚举
- 函数function
  - 实例属性
    - length，参数长度
    - name函数名
  - 实例方法(专门的一个问题)
    - apply
    - bind
    - call

# \=\=与\=\=\=

### \=\=\=必须强烈相等，不存在转换

### 细说\=\=

- null和undefined
  - null == undefined 为true
  - 他们不等于任何东西
- NaN不等于任何值，甚至他自己
- 数字与字符串，把字符串转为数字后比较
- 数字和布尔，把布尔转为数字
- 字符串和布尔，都转为数字
- 对象和数字，把对象转为数字
- 对象和字符串，把对象转为字符串
- 对象和布尔，都转为数字
- 规律就是除了字符串和对象转字符串，只要数据类型不同就都转为数字

### 但是我们还要了解一下类型转换问题

- Number

  - Number("4")                  // 4 

  - Number("4a")                 // NaN 

  - Number("")                   // 0 

  - Number(false)                // 0 

  - Number(true)                 // 1 

  - Number(null)                 // 0 

  - Number(undefined)            // NaN 

  - Number(Symbol('s'))          // TypeError...

  - Number([])//0

  - Number([1])//1

  - Number(obj)

  - ```javascript
    var arr = [1, 2]
    Number(arr)    // NaN
    // 因为arr.toString()等于"1,2"，强制转换后为NaN
    
    arr.toString = function() { return '43' }
    Number(arr)    // 43
    
    arr.valueOf = function() { return '42' }
    Number(arr)    // 42
    
    var obj1 = {}
    Number(obj1)   // NaN
    
    var obj2 = {
        valueOf: function () {
            return '99'
        }
    }
    Number(obj2)   // 99
    ```

- String

  - String(4)                    // "4" 
  - String(false)                // "false" 
  - String(true)                 // "true" 
  - String(null)                 // "null" 
  - String(undefined)            // "undefined" 
  - String(Symbol('s'))          // "Symbol(s)"，就是没有引号的哦
  - 对于Object类，取决于他们的toString方法，比如[1,2]=>"1,2"

- 隐式转换： **如果其中一个操作数是字符串；或者其中一个操作数是对象，且可以通过ToPrimitive操作转换为字符串，则执行字符串连接操作；其他情况执行加法操作。** 

- **对于执行加法操作的情况，如果操作数有一边不是number，则执行ToNumber操作，将操作数转换为数字类型。** 

-  关于常见的Array我们在JS内置对象（数据容器）中讨论

### toString、valueOf、ToPrimitive

 `toString` 方法对于值类型数据使用而言，其效果相当于类型转换，将原类型转为字符串。 `valueOf` 方法对于值类型数据使用而言，其效果将相当于返回原数据。对于unll和undefined，.toString()报错（String(x)不会）

对象的`Symbol.toPrimitive`属性。指向一个方法。该对象被转化为原始类型的值时，会调用这个办法，返回该对象对应的原始类型值。 `Symbol.toPrimitive`被调用时,会接受一个字符串参数，表示当前运算的模式，一个有三种模式。 

```javascript
var obj2 = {
  [Symbol.toPrimitive](hint) {
    if(hint == "number"){
        return 10;
    }
    if(hint == "string"){
        return "hello";
    }
    return true;
  }
}

console.log(+obj2);     //10    --hint in "number"
console.log(`${obj2}`); //hello --hint is "string"
console.log(obj2 + ""); //"true"
```

而对于对象，自己实现这两个方法，作用于强制类型转换时，在进行字符串强转时候，优先调用toString()方法。在进行数值运算的时候，优先调用valueOf方法。再有运算符的情况下，valueOf的优先级要高于toString()方法。   Symbol.toPrimitive在类型转换方面，优先级是最高的。

# 特殊流程控制

### for (let index in obj)

- 遍历所有的key值，对于数组就是索引
- 此方法会遍历到原型链上的所有可以枚举的属性键
- 对于对象
  - 首先遍历所有数值键，按照数值升序排列
  - 其次遍历所有字符串键，按照加入时间升序排列
  - 最后遍历所有Symbol键，按照加入时间升序排列

### for (let index of arr)

- 遍历所有的拥有迭代器的对象（ES6+），如数组、map、set、字符串
- 他遍历的是值，依据的是迭代器

# 函数

- ```javascript
  function functionName() {}//函数声明，会产生函数提升现象
  ```

- ```javascript
  var x = function(){}//实际上这是创建了一个匿名函数然后复制给x
  ```

- ```javascript
  var myFunction = new Function("a", "b", "return a * b");
  var x = myFunction(4, 3);
  ```

- ```javascript
  ()=>{}//箭头函数
  ```

- ```javascript
  //函数自调用
  (function () {
      var x = "Hello!!";// 我将调用自己
  })();//注意不写函数名（不要声明）
  //也可以不带括号，在function前边加+|-|~|!并且在末尾加入(实参)
  ```

- arguments：记录传入的参数的一个类数组结构
- 其他细节在ES6+以及JS高级中

### 全局（不依赖浏览器环境）函数

- decodeURI(encodedURI) 返回一个给定编码统一资源标识符 (URI) 的未编码版本的新字符串。 
- encodeURI(URI)上个函数的逆过程
- eval(string)执行string代码
- isFinite和isNaN
- parseInt(string, radix)、parseFloat(string)，注意radix如果为0则假定为10，会自动截断非数字字符，除非没参数或者第一个字符就是非数字

# DOM与BOM

### DOM，操作文档对象

- `document`是`window`的一个对象属性。`window` 对象表示浏览器中打开的窗口。如果文档包含框架（`frame` 或 `iframe` 标签），浏览器会为 HTML 文档创建一个 `window` 对象，并为每个框架创建一个额外的 `window` 对象。所有的全局函数和对象都属于 `window` 对象的属性和方法。
- `window` 指窗体。`document`指页面。`document`是`window`的一个子对象。
- 获取元素结点
  - getElementById、 getElementsByName、 getElementsByClassName、 getElementsByTagName、querySelector
  - 修改属性getAttribute、setAttribute
  - 创建节点：createElement(tagname)、createTextNode(string)、createAttrubute('attrubuteName')
  - 添加结点appendChild、appendBefore
  - 删除结点removeChild
- 结点常用属性
  - parent
  - children（所有html结点）、childNodes（所有子节点，包括html、text、属性）
  - nextSibling、previousSibling（后前兄弟）
  - innerText和innerHtml
  - nodeType（1->元素结点，2->属性结点，3->文本结点）
  - style样式
- DOM原型链
  - Object <EventTarget< Node < Element < HTMLElement < (e.g., HTML*Element)
  - Object <EventTarget < Node < Attr (this is deprecated in DOM4)
  - Object <EventTarget < Node < CharacterData < Text
  - Object <EventTarget< Node < Document < HTMLDocument
  - Object <EventTarget< Node < DocumentFragment
- addEventListener('事件',()=>{},是否捕获，是否冒泡),可以绑定多次
- 事件流程是从外到内捕获再从内到外冒泡

### BOM，浏览器对象

- Location
  - hash哈希值
  - host hostname加端口
  - hostname 主机路径
  - href 完整URI
  - pathname URL的路径部分(\\index.html)
  - port
  - protocol
  - search协议？其实就是url?后边的东西
  - assign(string)加载新文档
  - reload()刷新页面
  - replace(string)用新文档替换当前文档，类似assign
- Navigator系统信息
- Screen屏幕信息，pixelDepth，颜色分辨率
- History，forward、back、go，操作浏览器前进后退

# 几个关键词

```javascript
var obj = {
    a: 1,
    b: 2,
    c: 3
};
// 重复引用obj进行属性赋值
obj.a = 3;
obj.b = 4;
obj.c = 5;
// 等价于以下代码
with (obj) {
    a = 3;
    b = 4;
    c = 5;
}//with关键词不建议使用，会产生内存泄漏

for(xxx in xxx);//遍历keys
console.log(4 in [1,2,3,4,5],'a' in {a:1})//查询是否有对应的key

var obj={name:'张三',age:22,job:'软件开发'}
console.log(obj.name)//张三

var result=delete obj.name;
console.log(result) //true 表示删除成功
var result_1=delete obj.name;
console.log(result_1) //true  表示删除的属性不存在
console.log(obj);//{age:22,job:'软件开发'}

let arr = [1,2,3,4,5,6];
let flag1 = delete arr[5];
let flag2 = delete arr[5];
console.log(flag1);//true
console.log(flag2);//true
console.log(arr);//[1, 2, 3, 4, 5, empty]

xxx = 3
delete xxx//true，这是因为xxx被绑定到了全局变量window上，可以删除
var xxx=3//这是全局变量
delete xxx//false

void 2 === '2';   // (void 2) === '2'，返回 false
void (2 === '2'); // void (2 === '2')，返回 undefined
//void让后面的语句强制返回undefined，他的优先级比较高哦！
```
