---
title: "技能提升"
date: "2023-05-04"
---

# 浏览器

## 架构

### 多进程

- 浏览器进程
  - UI线程
  - 网络线程
  - 存储线程（文件读写）
- render进程（一个tab或者iframe，多个**同站点页面共用**一个render进程）
  - GUI渲染线程：负责解析DOM和页面绘制
  - JS引擎线程：负责解析执行JS， **它和GUI渲染进程不能同时执行，只能一个一个来，如果JS执行过长就会导致阻塞掉帧** 
  - 计时器线程：负责处理setInterval和setTimeout。
  - 异步http请求线程：XMLHttpRequest连接后浏览器开的一个线程，负责处理请求后的回调函数（只负责添加到执行队列，执行依然靠JS进程）
  - 事件触发线程：用来控制事件环
  - 合成线程，仅仅负责绘制
- GPU
- plugin进程
- 网络请求进程
- 好处就是一个挂不会导致全部挂

### 导航

- UI线程处理输入在URL框里的文字
- 匹配是不是URL，不是调用搜索引擎搜索，否则导航
- UI线程叫网络线程（network thread）初始化一个网络请求来获取站点的内容。这时候tab上会展示一个提示资源正在加载中的旋转圈圈，而且网络线程会进行一系列诸如DNS寻址以及为请求建立TLS连接的操作，如果出现重定位就再次发送一个请求。
- 如果响应的MIME可以渲染就渲染，否则下载。
- 接下来寻找渲染进程来渲染页面。
- 接下来通过IPC告诉渲染进程提交本次导航，一旦浏览器进程收到渲染线程的回复说导航已经被提交了（commit），导航这个过程就结束了，文档的加载阶段（document loading phase）会正式开始。
- 如果在一个页面里进行重新导航，那么渲染进程会自己先检查一个它有没有注册beforeunload事件的监听函数，如果有的话就执行，执行完后发生的事情就和之前的情况没什么区别了，唯一的不同就是这次的导航请求是由渲染进程给浏览器进程发起的。如果是重新导航到不同站点（different site）的话，会有另外一个渲染进程被启动来完成这次重导航，而当前的渲染进程会继续处理现在页面的一些收尾工作。

## 渲染

### 总流程

DOM->compute style->layout->分层->paint->分块->光栅化->合成

### Dom

字节->token->词法分析->DOM构建

### 样式计算

字节->styleSheets结构->标准化（em->px,blue->(0,0,255)...)->计算DOM结点具体样式

具体样式有两个规则

- 继承 ：每个子节点会默认去继承父节点的样式，如果父节点中找不到，就会采用浏览器默认的样式，也叫`UserAgent样式`。 
- 层叠：样式层叠，是CSS一个基本特征，它定义如何合并来自多个源的属性值的算法。 
- 计算完样式之后，所有的样式值会被挂在到`window.getComputedStyle`当中，也就是可以**通过JS来获取计算后的样式**。

### 布局树

- 遍历DOM树可见节点，并把这些节点加到布局树中
- 对于不可见的节点，head,meta标签等都会被忽略，属性包含display:none的元素也不会包含进布局树。
- 布局树的root是body，而dom是document

### 分层

**浏览器的页面实际上被分成了很多图层，这些图层叠加后合成了最终的页面，并不是布局树的每个节点都包含一个图层，如果一个节点没有对应的层，那么这个节点就从属于父节点的图层。** 

- 显式合成创建新图层
  - HTML根元素
  - position不为static并且设置了z-index属性
  - 元素的 **opacity** 值不是 1
  - 元素的 **transform** 值不是 none
  - 元素的 **filter** 值不是 none
  - 元素的 **isolation** 值是isolate
  - **will-change**指定的属性值为上面任意一个。(will-change的作用后面会详细介绍)
  - 需要被裁剪，比如overflow不是visibility
-  `z-index`比较低的节点会提升为一个单独的图层，那么`层叠等级比它高`的节点**都会**成为一个独立的图层。 
  - 这也就意味着每当多一个低级zindex就会尝试2个新图层，会增大内存的压力，有时候会让页面崩溃（层爆炸）。

### 绘制

- 一层层地绘制图层
- 它的指令和canvas的指令非常像

### 分块

- 合成线程会把图层划分为图块(tile)，这是为了只绘制用户能看到的图块
- 这些块的大小一般不会特别大，通常是 256 * 256 或者 512 * 512 这个规格。这样可以大大加速页面的首屏展示。
- 合成线程负责：切分图块，把任务交给渲染线程，然后组合栅格化线程返回的比特图

### 光栅化

就是把图块转化为位图。

- 渲染进程中专门维护了一个**栅格化线程池**，专门负责把**图块**转换为**位图数据**
-  合成线程会选择视口附近的**图块(tile)**，把它交给**栅格化线程池**生成位图
-  生成位图的过程实际上都会使用 GPU 进行加速，生成的位图最后发送给`合成线程`
- 画完并合成以后发给显卡然后屏幕显示

### 三种行为

- 重排——所有的活重新干
- 重绘——仅仅计算样式和绘制
- 合成——新建合成层，无重绘重排，直接进行合成操作，在非主线程中执行合成动画操作。 

## 垃圾回收

### 内存限制

- 0.7G~1.4G
- 垃圾回收本身也是一件非常耗时的操作，假设V8的堆内存为`1.5G`，那么V8做一次小的垃圾回收需要50ms以上，而做一次非增量式回收甚至需要1s以上，并且会阻塞GUI。

### 内存分区

- 新生代：大多数的对象开始都会被分配在这里，这个区域相对较小但是垃圾回收特别频繁，该区域被分为两半，一半用来分配内存，另一半用于在垃圾回收时将需要保留的对象复制过来。 
- 新生代中的对象在存活一段时间（两次清理还没死并且to的内存超过25%了）后就会被转移到老生代内存区，相对于新生代该内存区域的垃圾回收频率较低。老生代又分为`老生代指针区`和`老生代数据区`，前者包含大多数可能存在指向其他对象的指针的对象，后者只保存原始数据对象，这些对象没有指向其他对象的指针。 
- 大对象：存放体积超越其他区域大小的对象，每个对象都会有自己的内存，垃圾回收不会移动大对象区。 
- code区

### 清理策略

- 新生代使用 Scavenge 算法，分from和to区，声明的对象首先会被分配到`From`空间，当进行垃圾回收时，如果`From`空间中尚有存活对象，则会被复制到`To`空间进行保存，非存活的对象会被自动回收。当复制完成后，`From`空间和`To`空间完成一次角色互换，`To`空间会变为新的`From`空间，原来的`From`空间则变为`To`空间，缺点就是一般的空间用来复制了。
- 老生代使用标记清除和标记整理，就是根节点能否摸到这个对象，摸不到就清理。根节点有三种，window类似的全局对象、本地函数的局部变量和参数、嵌套调用链上的其他函数的变量和参数 
- 标记整理则是删除以后把所有活着的移到内存的另一端，方便把空位让出来
- 为了减少垃圾回收带来的停顿时间，V8引擎又引入了`Incremental Marking(增量标记)`的概念，即将原本需要一次性遍历堆内存的操作改为增量标记的方式，先标记堆内存中的一部分对象，然后暂停，将执行权重新交给JS主线程，待主线程任务执行完毕后再从原来暂停标记的地方继续标记，直到标记完整个堆内存，类似fiber。

## 底层内存和数据结构

### 内存

- 堆区：就只是一块大空间，存储变量时没有什么规律可言 
- 栈：乒乓球筒，取数据就是要一个个弹出来
- js的字符串放在堆里，栈保持引用，这点很重要！
- 对于数字，嘴上说是64位，但是v8不这样做，只要没有双精度就放在栈里并且位数不高，如果非要当成双精度才会放在堆里并且提升成64位
- 数字有smi和HeapNumber之分，smi就是32位且直接放在栈内存里，而heapNumber则是以指针形式指向堆内存的64位区域
- smi就是小整数，而heapnumber则是浮点数、大整数、NaN以及Infinite等

### 数据结构

- object是哈希表
- map、set都是红黑树

### 数组

- 对象身上有一个数组索引属性，就是数字键，它放在elements指针指向的内存里
- 字符串和symbol叫做命名属性，放在properties里
- 如果properties总数不到10，直接放在对象身上，叫做快属性，超过10的部分才放在properties指向的内存里，这是慢属性
- 数组也有快慢，快数组连续存放而慢数组是稀疏数组，慢数组其实就已经退化成了对象的慢属性（hashTable）
- 数组可以自动扩容，扩容过程中会导致快慢转换
  - 如果快数组扩容后的容量是原来的 **9 倍以上**，意味着它比 `HashTable` 形式存储占用更大的内存，快数组会转换为慢数组
  - 如果快数组新增的索引与原来最大索引的差值大于 1024，快数组会被转换会慢数组
  - 当慢数组转换成快数组能节省**不少于 50%** 的空间时，才会将其转换。
- 数组有带孔与全填充的区别，就是是否有空位
- 数组常用的6个类型
  - `PACKED_SMI_ELEMENTS`： 代表数组中所有元素都是由 `SMI` 类型的全填充数组
  - `HOLY_SMI_ELEMENTS`： 代表数组中元素都是由 `SMI` 类型的带孔数组
  - `PACKED_DOUBLE_ELEMENTS`： 代表数组中的元素由 `HeapNumber` 类型的全填充数组
  - `HOLY_DOUBLE_ELEMENTS`： 代表数组中元素由 `HeapNumber` 类型的带孔数组
  - `PACKED_ELEMENTS`： 用于元素不能表示为`SMI`或`DOUBLE`类型的全填充数组
  - `HOLY_ELEMENTS`： 用于元素不能表示为`SMI`或`DOUBLE`类型的带孔数组
- 这6种类型只能从简单往复杂变，不能变简单，比如给孔填上东西也还是HOLY的，变复杂的时候为了保证每个位都是一样长度会导致重新装配操作。

# 多端原理

## 两种方式

### web-view

- 纯HTML、css、js
- 速度慢
- 通过URL来和原生应用交互，比如myapp://openCamera范围相机功能
- 也可以用js桥，需要客户端定义好接口，webview通过特定的方法访问接口。

### 混合开发

- 依赖框架
- 一般用js桥对接

## uni-app

- 用的是web-view
- 浏览器端，把vue打包完原样输出到代码里
- app和小程序端依然是web-view，但是逻辑代码和view分离了，不管小程序还是app，逻辑层都独立为了单独的js引擎，渲染层仍然是webview，这样在一定程度上可用提高性能。

## RN

通过一种称为“布局引擎”的机制将 JavaScript 代码中的组件映射到原生平台的组件上，从而实现将 React 组件转换为原生平台组件的过程。 

- 首先，RN解析布局，把组件以及它的布局信息映射到特定平台的原生组件上。
- 利用虚拟DOM减少渲染成本与次数
- 用户交互事件：布局引擎会处理，比如onClick会转化为原生事件，点击时通过js桥调用js代码
- js和原生是双向调用和通信的

## Electron

electron不大一样，它内置了node和Chromium环境，Chromium处理UI显示和页面内js，而Node.js作为应用的后端环境，用于处理应用的业务逻辑和操作系统相关的功能。Node.js 提供了一套完整的 API，可以让开发者使用 JavaScript 来访问操作系统的底层功能，例如文件系统、网络、进程等，同时还有一套原生API来获取操作系统的内容，比如剪切板信息、通知等内容。 

## 小程序

只有一个要注意，小程序渲染层和js并不会相互阻塞（因为js没有dom操作），然后依然是js桥调用手机行为

# SSR实现

SSR并不是每次操作都会刷新，而是后端基于路由在后端渲染以后返回一个“骨架”给前端，这样就可以加快首屏渲染。

#### 优点

- SEO
- 首屏

#### 缺点

- 复杂度，开发效率，兼容问题
- 服务器压力

### hydrate做了什么

以`App.jsx`为例，首先我们知道，后端会渲染出大体的页面，但是有一个问题：后端无法给dom绑定方法，类似这样的操作依然要交给前端，hydrate就是做了这样一个功能：比对后端回传内容和App.jsx本体，把后端处理后还没做的事情做了，因为这是一个js行为，执行的时候页面已经有东西了（后端渲染好了），所以加速了首屏渲染。

官网：hydrateRoot希望前后端呈现的dom内容一致（也就是说后端只是没有绑定方法一起不显示的数据）。

后续再获取数据+渲染就只是前端的工作，服务端仅仅在首屏渲染时工作。

```javascript
root = hydrateRoot(document.getElementbyid('root'), reactNode, options?)
root.render(reactNode)
root.unmount()
```

### 路由同构

这一步很简单，原理其实就是以前我们的router只能在前端生效（思考一下historyRouter刷新的行为），现在我们为了实现SSR，在后端把对应的路由也处理以下，也就是在接收到对应路由的时候渲染好页面返回给前端。

```jsx
if(url==="/") return renderToString(<App>仅有首页</App>)//路由同构
switch url{
    case "/":{
        return renderToString(<App>仅有首页</App>)
        break;
    } 
    case "/dashBoard":{
        return renderToString(<App><DashBoard/></App>)
        break;
    }...
}
```

### 数据预取同构

服务端返回浏览器的 html 并无请求的数据，只有静态的 html 结构，所以我们要在服务端提前获取到数据发送给浏览器。前面也提到过，服务端返回的结构要和客户端渲染的 html 一致，这样客户端只需要完成事件绑定，否则会在客户端再进行一次解析渲染。

```jsx
export async function serverRender(path) {
  const router = findRoute(path);
  const res = await router.fetch();
  if (router) {
    const content = renderToString(
      <StaticRouter location={router.path} context={{
        initData: res
      }}>
        <Index />
      </StaticRouter>
    );
  return {
    content,
    state: res
    }
  }
} 
```

根据不同的路由获取数据并利用数据进行渲染

### 渲染同构

随让有了数据，但是此时出现了一个问题：由于我们拿到了数据导致hydrate比对BS的dom内容发现了不一致，最后导致了重新请求而出现闪烁，要解决这个问题，就要使得数据必须让B端也拿到，而不能只是在服务端。那么我们就需要数据的注水与脱水。

#### 注水

很简单，在root结点之外放一个不可见的textarea，把数据 stringify以后放进去。

#### 脱水

也很简单，在根组件的 **constructor** 中通过获取附加textarea里的内容并解析出来，放在一个context里供子组件使用，子组件的 **constructor** 在渲染之前获取到了data并渲染了vdom，这样比对的时候就发现页面表现一致，就解决了闪烁问题。

1.如何在服务端预取数据
2.取到数据之后如何保证服务端和客户端渲染一致

## SSG\ISR

SSG是static site generate，ISR是Increase static render，增量静态生成

SSG的问题是，接口内容更新后，用户访问页面获取到的信息并不会更新，因此需要一种可以在服务运行中动态去触发 SSG 生成的 html 的能力，于是就出现了 `ISR`，让 `SSG` 也能拥有增量更新的能力。 

要在 Next.js 中开启 ISR ，只需要在前面介绍的 `getStaticProps` 函数中返回一个 `revalidate` 属性，原理是当用户请求一个需要更新的页面时，ISR 会在后台自动重新生成该页面，然后将其缓存，以便下一次请求时可以快速响应。 

```jsx
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
// 这个方法会在服务端渲染或者 build 时被调用
// 当使用了 serverless 函数、开启 revalidate 并且接受到新的请求时也会被重新调用
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()
  return {
    props: {
      posts,
    },
    
    // Next 将会尝试重新生成页面:
    // - 接受到新的请求
    // - 每隔最多十秒钟
    revalidate: 10, // 单位为秒
  }
}
```

## SPA

### 优点

- 有良好的交互体验，避免了页面的重新加载；
- 前后端分离，单页Web应用可以和 RESTful 规约一起使用，通过 REST API 提供接口数据，并使用 Ajax 异步获取，这样有助于分离客户端和服务器端工作。
- 减轻服务器压力
- 共用一套后端程序代码，不用修改后端程序代码就可以同时用于 Web 界面、手机、平板等多种客户端

### 缺点

- SEO
- 首屏渲染时间长

# 打包工具原理

### webpack

- 原理就是，从入口文件开始摸，向外寻找依赖

- 每个文件都找到它的依赖，形成一个对象，对象包含code源代码和deps依赖的绝对路径

- 最后形成一个大对象graph，每个文件的绝对路径的值就是解析以后生成的对象

- 找完以后为了打包成一个文件，所有的文件转换成一个自执行函数IIFE来防止变量污染问题

- 一定要想明白，在node里的字符串，到处以后是代码而不再是字符串

  ```javascript
  function bundle(graph) {
    let modules = ''
    for (let filename in graph) {
      let mod = graph[filename]
      modules += `'${filename}': [
        function(require, module, exports) {
          ${mod.code}
        },
        ${JSON.stringify(mod.mapping)},
      ],`
    }
  
    // 注意：modules 是一组 `key: value,`，所以我们将它放入 {} 中
    // 实现 立即执行函数
    // 首先实现一个 require 函数，require('${entry}') 执行入口文件，entry 为入口文件绝对路径，也为模块唯一标识符
    // require 函数接受一个 id（filename 绝对路径） 并在其中查找它模块我们之前构建的对象. 
    // 通过解构 const [fn, mapping] = modules[id] 来获得我们的函数包装器和 mappings 对象.
    // 由于一般情况下 require 都是 require 相对路径，而不是id（filename 绝对路径），所以 fn 函数需要将 require 相对路径转换成 require 绝对路径，即 localRequire
    // 注意：不同的模块 id（filename 绝对路径）时唯一的，但相对路径可能存在相同的情况
    // 将 module.exports 传入到 fn 中，将依赖模块内容暴露处理，当 require 某一依赖模块时，就可以直接通过 module.exports 将结果返回
    const result = `
      (function(modules) {
        function require(moduleId) {
          const [fn, mapping] = modules[moduleId]
          function localRequire(name) {
            return require(mapping[name])
  		  //子模块如果想要require，那么也是调用require从modules里取值
          }
          const module = {exports: {}}//我们自己定义一个module供子模块使用和导出
          fn(localRequire, module, module.exports)
          return module.exports
        }
        require('${entry}')//entry是我们在config里定义的入口
      })({${modules}})
    `//为什么modules是字符串？因为我们输出的result代码就是字符串本串。。。
    //现在的modules是k:v形式的对象字符串，那么就可以完美地保持code字符串
    //我们需要自己实现require方法，这个方法基于我们本来就持有modules，那么就可以通过modules[name]得到对应函数然后调用，里边的module也变成了一个新的仅有空对象的exports的对象。
    //上边的代码更好理解
    return result
  }
  ```

### vite

vite不能算是在打包，因为它直接使用了<script type="module" src="xxx"/>的方式实现模块化。

# 微前端

## 概念

- 类似微服务，把前端应用拆分成更小粒度的应用，方便协作
- 优点就是把可以隔离的模块隔离，并且提供沙箱，多个模块不会相互影响
- 每个模块技术栈无关

## 现有的方案

- single-SPA
- qiankun多个子应用集成到统一页面
- micro-app
- Module Federation（基于webpack）

## 方案详情

### qiankun

- 目的是统一项目的路由，比如我们希望把React和Vue的应用集成到同一页面下，就需要管理路由保证统一
- 基于web components实现隔离
- qiankun的子应用就是整个加载的
- 需要手动配置通信方式，比如CustomEvent和postMessage
- 实现了沙箱机制

### Module Fedration

- 目的是将多个独立的Webpack构建之间共享模块，从而实现代码统一。多个独立的应用可以共享一个代码库，从而避免了代码的重复和冗余 。 
- 通过共享模块实现通信和复用
- 核心是多个模块，把多个子应用作为多个模块运行，每个模块可以暴露自身的函数、组件等等供其他模块使用
- 一般用在工具库和业务公共组件情境下

## 和iframe相比

- iframe的主要问题其实就是qiankun解决的问题，所有iframe和本体公用一个URL，路由混乱
- 同时iframe的DOM完全和本体分离，设想一个小iframe想要弹窗几乎无法引起注意，而微前端的弹窗就可以在浏览器中心弹出。
- 当然，iframe作为原生组件，，速度和开发成本以及沙箱机制优于微前端。

# 设计模式

- 观察者
- 发布订阅
- 访问器（babel）
- 单例模式
- 工厂
- 代理
- 装饰器