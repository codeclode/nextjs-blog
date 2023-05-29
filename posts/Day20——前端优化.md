---
title: "前端优化"
date: "2023-01-28"
---

# TS

### 开始

```shell
npm i -g typescript
tsc [filename.ts]
```

### 类型

- boolean、number、string
- Symbol
- Array:number[]或Array\<number\>
- Enum

```javascript
enum Direction{
  NORTH,
  SOUTH,
  EAST,
  WEST,
}
enum Direction {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
}
//使用字符串枚举。在一个字符串枚举里，每个成员都必须用字符串字面量，或另外一个字符串枚举成员进行初始化。

enum Enum {
  A,
  B,
  C = "C",
  D = "D",
  E = 8,
  F,
}//异构枚举
```

- any类型，可以被赋予任何类型
- unknown，可以被赋予任何类型，但是此类型变量只能赋值给unknown和any
- Tuple元素，对数组的元素对应位置的类型进行要求

```typescript
let tupleType: [string, boolean];
tupleType = ["semlinker", true];
```

- void类型，与any相反，它表示没有任何类型。
- null和undefined
- never类型，表示的是那些永不存在的值的类型。比如直接抛出错误的函数和while(true){}

### 断言

- 类型断言

  - 尖括号法

  - as法

  - ```typescript
    let someValue: any = "this is a string";
    let strLength: number = (<string>someValue).length;
    let someValue: any = "this is a string";
    let strLength: number = (someValue as string).length;
    ```
  
- 非空断言!

  - ```typescript
    function myFunc(maybeString: string | undefined | null) { 
      const onlyString: string = maybeString; // Error
      const ignoreUndefinedAndNull: string = maybeString!; // Ok
    }
    
    type NumGenerator = () => number;
    function myFunc(numGenerator: NumGenerator | undefined) {
      const num1 = numGenerator(); // Error
      const num2 = numGenerator!(); //OK
    }
    ```

- 确定赋值断言

  - ```typescript
    let x!: number;//明确地告诉编译器我在用之前会赋值的
    initialize();
    console.log(2 * x); // Ok，如果没有x!会说x没有赋值
    
    function initialize() {
      x = 10;
    }
    ```

### 类型保护

- in关键字，确定属性是否存在于对象中

- typeof关键字

- instanceof

- 自定义保护谓词

- ```typescript
  if 'attr' in obj{
      console.log(obj.attr)
  }
  
  function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
  }
  
  if obj instanceof Object{
      console.log(obj.toString())
  }
  
  function isNumber(x: any): x is number {
    return typeof x === "number";
  }
  ```

### 联合类型、交叉类型以及别名

```typescript
let num: 1 | 2 = 1;
type EventNames = 'click' | 'scroll' | 'mousemove';//联合类型

type Message = string | string[];//类型别名

type PartialPointX = { x: number; };
type Point = PartialPointX & { y: number; };

let point: Point = {
  x: 1,
  y: 1
}//交叉类型

interface X {
  c: string;
  d: string;
}

interface Y {
  c: number;
  e: string
}

type XY = X & Y;//如果同名的不同基础类型属性出现交叉，对应属性类型会变成never

interface D { d: boolean; }
interface E { e: string; }
interface F { f: number; }

interface A { x: D; }
interface B { x: E; }
interface C { x: F; }

type ABC = A & B & C;//如果不是基础类型，会出现合并现象

let abc: ABC = {
  x: {
    d: true,
    e: 'semlinker',
    f: 666
  }
};
```

### 函数

```typescript
let IdGenerator: (chars: string, nums: number) => string;

function createUserId(name: string, id: number,age?:number): string {
  return name + id;
}

IdGenerator = createUserId;
//ts的函数可以实现重载，但是精确的要保证放前边
```

### 接口和类

```typescript
interface Person {
  readonly name: string;//只读属性，对于数组有ReadonlyArray表示只读的数组
  age?: number;//可选
  [propName: string]: any;//剩下的任意属性
}
//多次定义合并
interface Point { x: number; }
interface Point { y: number; }
const point: Point = { x: 1, y: 2 };
```

```typescript
class Greeter {
  // 静态属性
  static cname: string = "Greeter";
  // 成员属性
  greeting: string;
  #name: string;//私有属性，其实也可以用private

  // 构造函数 - 执行初始化操作
  constructor(message: string) {
    this.greeting = message;
  }

  get name(): string {
    return "李傲松";
  }

  set name(name:string): string {
	return "设置牛魔酬宾"
  }

  // 静态方法
  static getClassName() {
    return "Class name is Greeter";
  }

  // 成员方法
  greet() {
    return "Hello, " + this.greeting;
  }
}
//抽象类，和java一样
abstract class Person {
  constructor(public name: string){}

  // 抽象方法
  abstract say(words: string) :void;
}

class Developer extends Person {
  constructor(name: string) {
    super(name);
  }
  
  say(words: string): void {
    console.log(`${this.name} says ${words}`);
  }
}
```

#### type和接口的区别

- type可以定义基本类型别名 type name = string
- type可以声明联合类型 {stuNo: number} | {classId: number} 
- type可以声明元组
- interface重复声明会合并而type报错
- 类可以实现接口（ implements ），接口可以继承接口

### 泛型

```typescript
function identity <T, U>(value: T, message: U) : T {
  console.log(message);
  return value;
}

interface GenericIdentityFn<T> {
  (arg: T): T;
}

class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

interface Person {
  name: string;
  age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join" 
type K3 = keyof { [x: string]: Person };  // string | number
//keyof，获取某个类型的所有键

//infer声明一个类型变量并且对它进行使用
//infer的意思是推断，只有在指定了泛型才知道是什么
//有点像泛型之泛型
//推断函数
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;//T是否继承自一个返回R的函数，如果是，T=R，否则T=any
type b = ReturnType<() => string>; // type b = string

//推断数组
type Ids = number[];
type Names = string[];
type Unpacked<T> = T extends (infer R)[] ? R : T;
type idType = Unpacked<Ids>; // idType 类型为 number
type nameType = Unpacked<Names>; // nameType 类型为string
//keyof typeof obj|keyof Class
//获取键的枚举

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}//泛型必须是xxx的子类

type Partial<T> = {
  [P in keyof T]?: T[P];//将某个类型里的属性全部变为可选项
};
```

### d.ts和declare

在.d.ts声明变量或者模块等东西之后，在其他地方可以不用import导入这些东西就可以直接用，用，而且有语法提示。.d.ts 文件中的顶级声明必须以 "declare" 或 "export" 修饰符开头，通过declare声明的类型或者变量或者模块，在include包含的文件范围内，都可以直接引用而不用去import或者import type相应的变量或者类型。

```typescript
declare var jQuery: (selector: string) => any;
declare type Asd {
    name: string;
}
declare module '*.css';
declare namespace API{
  interface ResponseObj {
      xxx
  }
}
```

### 装饰器

- 装饰器属于实验性特性
- 类似java的注解
- 类装饰器

```typescript
function Greeter(target: Function): void {
  target.prototype.greet = function (): void {
    console.log("Hello!");
  };
}

@Greeter
class Greeting {
  constructor() {
    // 内部实现
  }
}

let myGreeting = new Greeting();
(myGreeting as any).greet(); // console output: 'Hello Semlinker!';

//当然，也可以通过高阶函数自定义输出
function Greeter(greeting: string) {
  return function (target: Function) {
    target.prototype.greet = function (): void {
      console.log(greeting);
    };
  };
}
//@Greeter("fuck")如此使用
```

- 属性装饰器

```typescript
function logProperty(target: any, key: string) {
  delete target[key];

  const backingField = "_" + key;

  Object.defineProperty(target, backingField, {
    writable: true,
    enumerable: true,
    configurable: true
  });

  // property getter
  const getter = function (this: any) {
    const currVal = this[backingField];
    console.log(`Get: ${key} => ${currVal}`);
    return currVal;
  };

  // property setter
  const setter = function (this: any, newVal: any) {
    console.log(`Set: ${key} => ${newVal}`);
    this[backingField] = newVal;
  };

  // Create new property with getter and setter
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}//定义了一个代理属性

class Person { 
  @logProperty
  public name: string;

  constructor(name : string) { 
    this.name = name;
  }
}

const p1 = new Person("semlinker");
p1.name = "kakuqo";
//输出Set: name => semlinker
//Set: name => kakuqo
```

- 方法装饰器，接收三个参数，target被装饰的类，propertyKey：方法名，descriptor：属性描述符
- 参数装饰器，修饰函数参数，target被装饰的类，propertyKey：方法名， parameterIndex：方法中参数的索引值 

## 内置高级属性

### 可选和必选

```typescript
interface PhoneType {
  width?: number;
  height:  number;
}
// type Partial<T> = { [P in keyof T]?: T[P]; }
//让PhoneType所有属性变成可选的
const D:Partial<PhoneType>={
}
// type Required<T> = { [P in keyof T]-?: T[P]; }
// 将原本可选的属性变成必选的
const p: Required<PhoneType> = {
  width:100
  height:300
};
```

### 提取属性

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

interface HousesItemType {
  desc: string;
  houseCode: string;
  houseImg: string | string[];
  price: number | string;
  tags: string[];
  title: string;
}

// 从 HousesItemType 类型中提取出 houseCode houseImg price
type MiniHousesItemType = Pick<
  HousesItemType,
  "houseCode" | "houseImg" | "price"
>;
```

### 只读

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

interface ResultType<T=any>{
    data:T
    status:number
}
const res2:Readonly<ResultType<string>>={
    data:'ok',
    status:200
}
const arr:ReadonlyArray<number>=[1,2,3]
//就是const arr1:Readonly<number[]>=[1,2,3]
type Readonly<T> = {readonly [K in typeof T] : T[K]} ;
```

### 记录

```typescript
interface PersonType {
  name: string;
  age?: number;
}

type Names = "_island" | "zhangsan" | "lisi";

// 将Names作为list的属性名称，PersonType作为属性值类型
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
const list: Record<Names, PersonType> = {
  _island: { age: 10, name: "_island" },
  zhangsan: { age: 5, name: "zhangsan" },
  lisi: { age: 16, name: "lisi" },
};
```

### 忽视和移除

```typescript
type Exclude<T, U> = T extends U ? never : T;
type Omit = Pick<T, Exclude<keyof T, K>>;

interface CarType {
  name: string;
  type: string;
  color: string;
}
interface EXC{
  name:string;
  type:string;
}
const C2: Omit<CarType, "color"> = {//移除color属性
  name: "Car1",
  type: "mini",
};
const C: Exclude<EXC,CarType> = {//CarType减EXC
  color:"green"
};
```

### 非空

```typescript
type stringType=NonNullable<string|undefined|null>
// type stringType = string
```

### 函数返回

```typescript
function f1(name: string): string {
  return name;
}
type f1Type = ReturnType<typeof f1>;
// type f1Type = string
function f2<T>(name: T): T {
  return name;
}
type f2Type = ReturnType<typeof f2>;
// type f2Type = unknown
```

### 函数参数

```typescript
export default function fun1(x: number, y: number, z: number) {}
type p1=Parameters<(name:number)=>void>
// type p1 = [name: number]
type p2=Parameters<<T>(arg:T)=>T>
// type p2 = [arg: unknown]
type p3=Parameters<typeof fun1>
// [x: number, y: number, z: number]
```

# 响应式

## 区分RWD和AWD

RWD 和 AWD 两者都是为了适配各种不同的移动设备，致力于提升用户体验所产生的的技术。核心思想是用技术来使网页适应从小到大（现在到超大）的不同分辨率的屏幕。 

RWD响应式设计：通过媒体查询配合流体布局而不消减功能来实现优化功能体验，一套代码。

AWD自适应布局：除了媒体查询，要用 Javascript 来操作 HTML 来更适应移动设备的能力。AWD 有可能会针对移动端用户减去内容。可以在服务器端就进行优化，把优化过的内容送到终端上。 

因此RWD可以认为是AWD的子集

## 升和降

渐进增强：一开始就**针对低版本浏览器**进行构建页面，完成基本的功能，然后再针对高级浏览器进行效果、交互、追加功能达到更好的体验。 

优雅降级：一开始就构建**站点的完整功能**，然后针对浏览器测试和修复。比如一开始使用 CSS3 的特性构建了一个应用，然后逐步针对各大浏览器进行 hack 使其可以在低版本浏览器上正常浏览。 

## 像素问题

### 设备独立像素DIP

CSS里边的像素，也称为逻辑像素

### 物理像素

真实屏幕由一个个像素方块组成通过控制每个像素点的颜色，就可以使屏幕显示出不同的图像，屏幕从工厂出来那天起，它上面的物理像素点就固定不变了，单位为pt。 

### DPR设备像素比

DPR=物理像素/设备独立像素

也就是说，DPR为1，那么一个点对应一个px

而大于1，那么一个DIP对应dpr*dpr个物理点

## viewport

### layout viewport

网页布局的区域，它是 html 元素的父容器，只要不在 css 中修改 元素的宽度， 元素的宽度就会撑满 layout viewport 的宽度。 其实就是整个网页的内容区域

### visual viewport

在屏幕上可以展示出的网页大小

### ideal viewport

ideal viewport 的宽度等于移动设备的屏幕宽度，所以其是最适合移动设备的 viewport。 针对ideal viewport 而设计的网站，不需要用户手动缩放，也不需要出现横向滚动条，都可以完美的呈现给用户。

### meta

|     name      |                           content                            |
| :-----------: | :----------------------------------------------------------: |
|     width     | 设置 layout viewport 的宽度，为一个正整数，或字符串 "width-device" |
|    height     | 设置 layout viewport 的高度，这个属性对我们并不重要，很少使用 |
| maximum-scale |         允许用户的最小缩放值，为一个数字，可以带小数         |
| minimum-scale |         允许用户的最小缩放值，为一个数字，可以带小数         |
| initial-scale |                          初始缩放值                          |
| user-scalable | 是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes 代表允许 |

## 适配方案

### 百分比

不大好使，因为一些属性的问题

而且，百分比自己要有参照

> 百分比值总要相对于另一个量，比如长度。每个允许使用百分比值的属性，同时也要定义百分比值参照的那个量。这个量可以是相同元素的另一个属性的值，也可以是祖先元素的某个属性的值，甚至是格式化上下文的一个度量（比如包含块的宽度）。 

- margin、padding默认的相对参考值是包含块的宽度
- border不支持百分比
- 文本大小的百分比相对的是父级的font-size
- shadow不支持百分比

因此要找别的单位

### rem

就是设置相对于根文字大小的单位

### flexible

- 根据 `document.documentElement.clientWidth` 动态修改html标签的 font-size ，页面其他元素使用 rem 作为长度单位进行布局，从而实现页面的等比缩放

但是这样动态修改引入了一定js，而且让width等属性去匹配rem。。。

### vw、vh、vmin、vmax

这个不用多说，就是基于屏幕的大小

### dvh

vh有个问题，就是它永远都是把整个手机屏幕算进去，不管有没有地址栏啥的。。。

新规范dvh就是动态vh，去掉固有的高度

当然，字体。。。我们需要转换一下

### 写一个自动转换的东西（sass）

```scss
// 假设设计稿的宽度是 375px，假设取设计稿宽度下 1rem = 100px
$baseFontSize: 100;

@function px2rem($px) {
  @return $px / $baseFontSize * 1rem;
}
@function px2vw($px) {
  @return $px / $baseFontSize * 1vw;
}
```

### 媒体查询

```css
@media only screen and (min-width: 375px) and (max-width:400px) {
  .logo {
    width : 62.5px;
  }
}

@media only screen and (min-width: 360px) {
  .logo {
    width : 60px;
  }
}

@media only screen and (min-width: 320px) {
  .logo {
    width : 53.3333px;
  }
}
```

## 常见问题

### 1px线条

在设备像素比大于1的屏幕上，我们写的1px实际上是被多个物理像素渲染，这就会出现1px在有些屏幕上看起来很粗的现象。 

- border-image

  ```css
  .border_1px{
    border-bottom: 1px solid #000;
  }
  @media only screen and (-webkit-min-device-pixel-ratio:2){
    .border_1px{
      border-bottom: none;
      border-width: 0 0 1px 0;
      border-image: url(../img/1pxline.png) 0 0 2 0 stretch;
      }
  }
  ```

- background-image

- scale

  ```css
  .class1 {
    height: 1px; 
    transform: scaleY(0.5);
  }
  ```

- transform: scale(0.5) + :before / :after （推荐）

  ```css
  .border_1px:before{
    content: '';
    position: absolute;
    top: 0;
    height: 1px;
    width: 100%;
    background-color: #000;
    transform-origin: 50% 0%;
  }
  @media only screen and (-webkit-min-device-pixel-ratio:2){
    .border_1px:before{
      transform: scaleY(0.5);
    }
  }
  @media only screen and (-webkit-min-device-pixel-ratio:3){
    .border_1px:before{
      transform: scaleY(0.33);
    }
  }
  ```

- svg：自身具有伸缩性

- 直接设置viewport为对应像素比的倒数

### 图片模糊问题

就是因为dpr比较大，本来人家是bit图一个点一个格，结果现在一个点9个格。

- 多倍图：直接无脑全都用dpr=3的图。。。浪费带宽

- srcset

  ```html
  <div class='illustration'>
    <img src='illustration-small.png'
         srcset='images/illustration-small.png 1x,
                 images/illustration-big.png 2x'
         style='max-width: 500px'/>
  </div>
  <img sizes = "(min-width: 600px) 600px, 300px" src = "photo.png" srcset = "photo@1x.png 300w,photo@2x.png 600w,photo@3x.png 1200w"/>
  <!--sizes，如果当前屏幕css像素大于600就用600，否则用300。srcset后边的w就是说用前边的数除以刚才比较的结果，最终选取第一个大于dpr的图-->
  ```
  
- ```css
  .avatar {
    background-image: -webkit-image-set( "conardLi_1x.png" 1x, "conardLi_2x.png" 2x );
  }
  ```

- 直接用svg

### <12px问题

就是pc系统默认最小字体就是12px，要是想再小点。。。

- scale或者zoom
- svg里的text，0.1px都没问题。。。

# 防抖节流

## 防抖

就是回城技能，在怎们嗯也得等到吟唱好了再说，如果反复嗯反而会重新开始吟唱。

```javascript
//模拟一段ajax请求
function ajax(content) {
  console.log('ajax request ' + content)
}
function debounce(fun, delay) {
  return function (...args) {
    let that = this
    let _args = args
    clearTimeout(fun.id)//尝试取消上次的吟唱
    fun.id = setTimeout(function () {//开始吟唱
      fun.apply(that, _args)
    }, delay)
  }
}
let inputb = document.getElementById('debounce')
let debounceAjax = debounce(ajax, 500)
inputb.addEventListener('keyup', function (e) {
  debounceAjax(e.target.value)
})
```

## 节流

这个更像需要引导动作的技能CD。

```javascript
function throttle(fun, delay) {
  let last, deferTimer
  return function (args) {
    let that = this
    let _args = arguments
    let now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(that, _args)
      }, delay)
    }else {
      last = now
      fun.apply(that,_args)
    }
  }
}
let throttleAjax = throttle(ajax, 1000)
let inputc = document.getElementById('throttle')
inputc.addEventListener('keyup', function(e) {
  throttleAjax(e.target.value)
})
```

二者最大的区别就是节流不会取消操作

# 性能优化

## 先来看一下几个指标

### RAIL——4个评价大指标

- Response：对于用户的交互动作，响应应该小于100ms
- Animation： 每一帧动画要在16毫秒内完成
- Idle：不需要很快地响应的任务在浏览器空闲时做
- Load：首屏渲染和网络性能

### FP——First Paint

首次绘制，记录页面第一次绘制像素的时间，表示渲染出第一个像素点。 

### FCP——First Contentful Paint

页面首次绘制文本、图片、非空白 Canvas 或 SVG 的时间。 

FP<FCP，因为背景肯定会比dom先绘制。

### FMP——First Meaning Paint

首次渲染有意义的内容的时间，“有意义”没有一个标准的定义，FMP的计算方法也很复杂。 

### LCP——Largest Contentful Paint

页面最大元素绘制的时间，该时间会随着页面渲染变化而变化，因为页面中的最大元素在渲染过程中可能会发生改变，另外该指标会在用户第一次交互后停止记录。 

### TTI——Time to Interactive

1. 从 FCP 指标后开始计算
2. 持续 5 秒内无长任务（执行时间超过 50 ms）且无两个以上正在进行中的 GET 请求
3. 往前回溯至 5 秒前的最后一个长任务结束的时间，则与 FCP 值相同。

这代表了网页对用户的响应是否迅速。

### FID——First Input Delay

记录在 FCP 和 TTI 之间用户首次与页面交互时响应的延迟。 

第一次处理响应别太慢

### TBT——Total Blocking Time

记录在 FCP 到 TTI 之间所有长任务的阻塞时间总和。 

长任务的阻塞时间是实际耗时减去50ms

### CLS——Cumulative Layout Shift

记录了页面上非预期的位移波动。 

计算方式：突然变化的东西移动的距离*位移前后影响的面积。

### 核心指标

- LCP：别让我等你！
- FID：抓紧响应！
- CLS：别动！

获取指标，可以通过安装Lighthouse插件或者直接用devTools里的performance实现。

或者也可以通过PerformanceObserver API获取

```javascript
const observer = new PerformanceObserver((list) => {
  for(const entry of list.getEntries()){
    console.groupCollapsed(entry.name);
	console.log(entry.entryType);
	console.log(entry.startTime);
	console.log(entry.duration);
	console.groupEnd(entry.name);
  }
})
observer.observe({entryTypes://只有这一个参数，代表要记录的性能字符串
['longtask','frame','navigation','resource','mark','measure','paint']});
observer.disconnect()//停止监听
var records = observer.takeRecords();//返回当前存储在性能观察器中的性能条目列表，并将其清空。
console.log(records[0].name);
console.log(records[0].startTime);
console.log(records[0].duration);
```

## 如何优化

首屏优化过程基于浏览器渲染页面的过程

- 开启浏览器缓存（强缓存和协商缓存）减少资源获取时间

- 后端配置Gzip压缩节约带宽，webpack中使用 compression-webpack-plugin 提前可以提前压缩好

  ```json
  new CompressionPlugin({ 
    filename: '[path].gz[query]', 
    algorithm: 'gzip', 
    test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/, 
    threshold: 10240, 
    minRatio: 0.8,
    deleteOriginalAssets: false
  })
  ```

- 第三方库提取出来，设置一个较长的缓存时间（因为这玩意不大会变）。其实就是分包

- dns预解析，提前解析好ip地址

  ```html
  <link rel="dns-prefetch" href="xxx.com">
  ```

- prefetch标签闲时加载，preload马上加载，这个玩意和serverpush没啥关系

- dns负载均衡，后端的活

- 开启http2，后端的活

  - 二进制分帧，比1的文本好

  - 多路复用，仅需要一个 TCP 建立请求通道,请求与响应可以同时基于此通道进行双向通信，而 http1.x 每次请求需要建立 TCP，还有并发限制。

  - 头部压缩减少体积

  - 可以进行服务端推送，提前得到需要的资源

    ```javascript
    res.push('/styles.css', {
          request: {
            accept: 'text/css'
          },
          response: {
            'content-type': 'text/css'
          }
        }, (err, stream) => {
          if (err) return;
          fs.createReadStream('styles.css').pipe(stream);
    });
    ```

  - 可以设置高优先级请求

- 直接服务端渲染

- 骨架屏。。。提高用户体验，同时防止着急乱嗯

- 打包的时候代码分割和树摇

- gzip压缩响应

  - Accept-Encoding: gzip, deflate客户端
  - Content-Encoding: gzip 服务端

- 压缩文件

  - js：UglifyPlugin
  - css：minicssexxtractPlugin
  - htmlWebpackPlugin

- cdn静态资源，就近获取，并且把静态资源放在不同域名可以避免请求带cookie

- 事件委托

  - ```javascript
    let item1 = document.getElementById("li1");
    let item2 = document.getElementById("li2");
    let item3 = document.getElementById("li3");
    
    document.addEventListener("click", function (e) {
      let t = e.target;
      //当事件处理程序直接绑定在目标元素上e.target===e.currentTarget，e.target ===this
      //这种情况，currentTarget会指向绑定的父元素，而target依旧指向目标元素
      //总之就是，target就是真正的触发人，currentTarget和this是事件的主人
      switch (t.id) {
        case "li1":
          document.title = "事件委托";
          break;
        case "li2":
          location.href = "http://www.baidu.com";
          break;
  })
    //会有点问题，如果子元素里边还有子元素，理论上点击孙元素应该也可以触发，但是这种写法无法触发
    ```
    
  - ```javascript
    function delegate(element, eventType, selector, fn) {
      element.addEventListener(eventType, e => {
        let el = e.target
        while (!el.matches(selector)) {
          if (element === el) {
            el = null
            break
          }
          el = el.parentNode
        }
        el && fn.call(el, e, el)
      })
      return element
    }
    //这种写法就不会有问题
    ```

  - 比如li绑定一样的事件，特别消耗内存，不如绑定给父元素ul，配合e的事件target或者结点父元素来调用事件。注意的是，事件委托依赖的是冒泡。

- 图片优化

  - 懒加载
  - 压缩图片
  - 使用webp格式图片（压缩大小并且不会很模糊）
  - 小图片base64
  - 响应式图片，就是响应式那边的东西

- 某些特定js引入时defer、async

- 善用RAF函数

- 甚至使用web Worker多线程

- css方面

  - transform开启GPU加速
  - will-change属性
  - 为0不要加单位
  - 不要过多嵌套

- 渐进式渲染——其实就是懒加载，不过不仅是图片，比如优先重要资源，HTML分块异步获取等

- 流式渲染——差不多，在做ssr渲染时，服务器同构处理组件，将处理结果以流的形式pipe给服务器的输出，而不是等全部组件处理完毕后将字符串作为结果输出，这样我们就实现了分块（流失）传输。 

- 回流重绘

  - 不要使用table：一个小改动可能会造成整个table重新布局。而且table渲染通常要3倍于同等元素时间 
  - 能用css就不用js
  - 在异步任务中修改DOM时把其包装成微任务（参考事件环想想为什么）
  - 如果要设置dom，先甚至为display：none或者绝对定位脱离文档流再设置
  - 增加dom可以先创建documentFragment在它上面操作，最后再把它添加到文档中。
  - 尽量在DOM的叶子上进行修改 
  - 一些引起回流的属性和方法，这些属性都是只读的，改的话不报错但没效果
    - clientWidth、clientHeight、clientTop、clientLeft
    - offsetWidth、offsetHeight、offsetTop、offsetLeft
    - scrollWidth、scrollHeight、scrollTop、scrollLeft
    - scrollIntoView()、scrollIntoViewIffNeeded()
    - window.getComputedStyle()
    - getBoundingClientRect()
    - scrollTo()
    - 如果改变style.left这种，只会在整个代码之后回流1次，毕竟这个东西不是计算出来的只读属性

# 自动化测试

### TDD：Test-Driven Development（测试驱动开发）

- TDD：Test-Driven Development（测试驱动开发）：TDD 则要求在编写某个功能的代码之前先编写测试代码，然后只编写使测试通过的功能代码，通过测试来推动整个开发的进行

### BDD：Behavior-Driven Development（行为驱动开发）

- BDD：Behavior-Driven Development（行为驱动开发）：BDD 可以让项目成员（甚至是不懂编程的）使用自然语言来描述系统功能和业务逻辑，从而根据这些描述步骤进行系统自动化的测试

# 网络安全

## XSS

跨站脚本攻击，利用的是浏览器script不受跨域限制，通过漏洞给网页添加script窃取信息。

### 类型

- 存储型：攻击的脚本代码被服务端写⼊进数据库中，黑客事先将恶意的脚本代码植入到漏洞服务器中，只要受害者浏览包含此恶意脚本代码的页面，就会执行恶意代码。 有点像贴吧里那些把名字评论倒过来的操作。
- 反射性：非持久性的攻击，黑客通过特定手法，比如在地址后面传入一个参数或者一个script脚本，或者诱使用户去访问一个包含恶意代码的URL，当受害者真的访问这些含有恶意脚本的网站时，恶意脚本代码会直接在受害者主机上的浏览器执行。 可以窃取cookie等。
- 基于DOM的xss：非持久性的攻击，修改网页的内容加载广告或者钓鱼内容甚至窃取密码

### 如何防范

- 过滤脚本

  ```javascript
  // 阻止恶意脚本注入，转码
  function transCode(str) {
      str = str.replace(/&/g, '&amp;')
      str = str.replace(/</g, '&lt;')
      str = str.replace(/>/g, '&gt;')
      str = str.replace(/"/g, '&quto;')
      str = str.replace(/'/g, '&#39;')
      str = str.replace(/`/g, '&#96;')
      str = str.replace(///g, '&#x2F;')
      return str
  }
  ```

- CSP

  ```html
  <meta http-equiv="Content-Security-Policy" content="style-src 'self' 'unsafe-inline';script-src 'self' 'unsafe-inline' 'unsafe-eval' https://webapi.amap.com https://restapi.amap.com https://vdata.amap.com https://appx/web-view.min.js;worker-src blob:">
  <!--通过meta标签配置允许的资源路径-->
  ```

  ```javascript
  //设置 HTTP Header 中的 Content-Security-Policy
  //设值default-src "self"只允许加载本站资源
  //设值child-src "none" 允许加载任何来源框架
  //设值img-src https://*只允许加载https协议图片
  ```

- 设置cookie httpOnly让js无法获取cookie，response.addHeader("Set-Cookie", "uid=112*; Path=/; HttpOnly")

- 当然，React和Vue自身已经配备了防范XSS的内容。

- 浏览器自带防御X-XSS-Protection（这是一个请求头，设置为1代表打开）

## CSRF

跨站请求伪造，利用用户已登录的身份，以⽤户的名义完成非法操作。比如前段事件QQ的那个事件，聊天截图诱骗点击，因为是从QQ进去的，所以可以获取QQ的cookie最后盗号。

### 类型

- get：比如使用别人的图片，会走一次get请求，那么图片源供应网站就可以获得到cookie
- post自动提交表单：黑客注入一个自动提交的表单来获取cookie
- 钓鱼连接，这个更容易理解

### 防御

CSRF通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对CSRF的防护能力来提升安全性。 

- 阻止不明外域

  - 同源检测

    - Origin Header请求的Header中会携带Origin字段。字段内包含请求的域名，如果存在Origin，可以检测来源域名

    - Referer Header对于资源请求，Referer为发起请求的页面地址。对于页面跳转，Referer为打开页面历史记录的前一个页面地址。

      ```html
      <img src="http://bank.example/withdraw?amount=10000&for=hacker" referrerpolicy="no-referrer"> 
      <!--referrerpolicy：No Referrer、no-Referrer-when-downgrade、、originunsafe-url、origin-when-crossorigin、origin-->
      ```

  - Samesite Cookie：为Set-Cookie响应头新增Samesite属性，它用来标明这个 Cookie是个“同站 Cookie”，同站Cookie只能作为第一方Cookie，不能作为第三方Cookie 

    - ```ini
      Set-Cookie: foo=1; Samesite=Strict
      Set-Cookie: bar=2; Samesite=Lax
      Set-Cookie: baz=3
      ```

    - 对于跨越了站点的请求，foo 这个 Cookie 不会被包含在 Cookie 请求头中，但 bar 会。 但是如果页面跳转是通过表单的 post 提交触发的，则bar也不会发送。 

- 提交时要求附加本域才能获取的信息

  - CSRF token：攻击者只能冒用cookie而无法窃取信息，那么我们利用这一点用用户信息或者随机生成一个token来区分正常请求和攻击，当然，token不能放在cookie里。
  - 双重cookie：访问网页时向请求域名注入一个Cookie，前端向后端发起请求时取出Cookie添加到URL参数中，后端接口验证Cookie中的字段与URL参数中的字段是否一致，不一致则拒绝。这个要求我们开启HttpOnly，保证其他人不能获取到cookie，只能利用它。就是前端保存另一个Cookie，这样不会带着这个Cookie到其他网页。
  
- 最好的方法：反正这玩意损失的大部分是用户而不是网站本身，那我就直接写个免责声明（反正用户不大可能看），或者是提前告知外链风险（比如掘金的站外链接），让用户自己决定。


## SQL注入

通过把SQL命令插入到Web表单递交或输入域名或页面请求的查询字符串，最终达到欺骗数据库服务器执行恶意的SQL命令,从而达到和服务器 进行直接的交互 

这个防御不是很难

- 严格限制Web应⽤的数据库的操作权限 
- 后端进行预编译，对特殊字符预处理
- 后端严格限制变量的类型

## Ddos

哈哈，人海战术

疯狂地访问你，直到把你干瘫痪。。。

如何防御：这个真不好防

- 服务器设置ip黑名单，谁疯狂访问，我就连大门都不让进
- 验证码、UA校验。。。
- 花钱解决，升级服务器
- 服务器设置一个ip防火墙，不让这个ip访问

## 劫持

### DNS劫持

怎么我访问淘宝给我引到京东了

### http劫持

利用http名文传输。。。中间人给你加点广告

# PWA和service worker

## 定义

PWA 指的是使用指定技术和标准模式来开发的 Web 应用，这同时赋予它们 Web 应用和原生应用的特性。 网站不仅可以直接pin到桌面上，还可以在离线时读取一些网站的缓存。

## 主屏幕

通过\<link rel="manifest" href="/manifest.json">定义说明文件，定义添加到主屏幕时的信息。

```json
{
  "name": "HackerWeb",
  "short_name": "HackerWeb",
  "start_url": ".",
  "display": "standalone",
    //展示模式，fullscreen全屏、standalone独立的应用程序、minimal-ui独立的应用程序，但会有浏览器地址栏。、browser浏览器模式
  "background_color": "#fff",
  "description": "A simply readable Hacker News app.",
  "icons": [{
    "src": "images/touch/homescreen48.png",
    "sizes": "48x48",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen72.png",
    "sizes": "72x72",
    "type": "image/png"
  }],
  "related_applications": [{
    "platform": "web"
  }, {
    "platform": "play",
    "url": "https://play.google.com/store/apps/details?id=cheeaun.hackerweb"
  }]
}
```

```javascript
window.addEventListener('beforeinstallprompt', (e) => {//支持安装到主屏幕的浏览器安装会在打开页面后触发，e是我们需要的一个自带的安装小帮手
  e.preventDefault();
  deferredPrompt = e;
    //addBtn用来让用户决定安装
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', (e) => {
    // 隐藏显示 A2HS 按钮的界面
    addBtn.style.display = 'none';
    // 显示安装提示
    deferredPrompt.prompt();
    // 等待用户反馈
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});
```

## Service Worker

ServiceWorker 是一种特化的 Worker，专门来处理跟网页有关的资源（assets），在浏览器和真正的服务端之间扮演一个代理（Proxy）的角色。ServiceWorker 同时引入了缓存（Cache），可以用来存储一个网络响应。 主要负责离线请求和性能优化。

一个页面只能注册一个，一个可以被多个注册。

```javascript
//页面脚本
if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker
          // .register('./serviceWorker.js', { scope: '/page/' })
          .register('./serviceWorker.js')
          .then(function(registration){
            /*干一些自定义事件*/
        })
```

```javascript
const CACHE_NAME = 'cache-v1';
const urlsToCache = [
  '/constant.js',
  '/serviceWorker.html',
  '/serviceWorker.js',
  '/image/131.png',
];
self.oninstall = (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME) // 这是promise
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache); // 返回一个promise
        //安装时
      })
  );
};
self.onfetch = (event) => {
  event.respondWith(
    caches
      .match(event.request) // 此方法从服务工作线程所创建的任何缓存中查找缓存的结果
      .then(function (response) {
        // response为匹配到的缓存资源，如果没有匹配到则返回undefined，需要fetch资源
        // fetch就相当于放行请求
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
};
```

# SSR之同构

所谓同构就是采用一套代码，构建双端（server 和 client）逻辑，最大限度的重用代码，不用维护两套代码。保持前后端干一样的事情。

### 路由同构

前端点击link或者nagivate之后，发送请求给后端，携带者path，后端match这个path，把对应的页面组件回传给前端。

### 数据同构

其实也是一样的，在查找到要渲染的组件后，需要预先得到此组件所需要的数据，然后将数据传递给组件后，再进行组件的渲染。但是数据也仅仅是服务端有，浏览器端是没有这个数据，当客户端进行首次组件渲染的时候没有初始化的数据，渲染出的节点肯定和服务端直出的节点不同，导致组件重新渲染。 

```jsx
const branch =  matchRoutes(routes,url);
const Component = branch[0].route.component;
//数据预取
const data = Component.getInitialProps(branch[0].match.params);
const html = renderToString(<Component data={data}/>);
res.end(html);
```

### 渲染同构(一些数据不要页面展示)

在服务端将预取的数据注入到浏览器，使浏览器端可以访问到，客户端进行渲染前将数据传入对应的组件即可，这样就保证了props的一致。 

#### 注水

```jsx
const propsData = `<textarea style="display:none" id="krs-server-render-data-BOX">${JSON.stringify(data)}</textarea>`;

// 通过 ejs 模板引擎将数据注入到页面
ejs.renderFile('./index.html', {
    htmlContent: html,  
    propsData
},  // 渲染的数据key: 对应到了ejs中的index
  (err, data) => {
    if (err) {
      console.log(err);
    } else {
        console.log(data);             
        res.end(data);
      }
  })
```

#### 脱水

```jsx
export default class Index extends React.Component {
    constructor(props,context) {
        super(props);
    }

    render() {
        return <RootContext.Provider value={this.props.initialData||{}}>
            {this.props.children}
        </RootContext.Provider>
    }
}

//渲染入口  接收脱水数据
function renderUI(initialData) {
    ReactDOM.hydrate(<BrowserRouter><Provider initialData={initialData}>
        <Routes />
    </Provider>
    </BrowserRouter>, document.getElementById('rootEle'), (e) => {
    });
}

//函数执行入口
function entryIndex() {
    let APP_INIT_DATA = {};
    let state = true;
    //取得数据
    let stateText = document.getElementById('krs-server-render-data-BOX');
    if (stateText) {
        APP_INIT_DATA = JSON.parse(stateText.value || '{}');
    }
    if (APP_INIT_DATA) {//客户端渲染
        
        renderUI(APP_INIT_DATA);
    }
}
//入口执行
entryIndex();
```

