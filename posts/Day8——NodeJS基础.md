---
title: "NodeJS基础"
date: "2023-01-16"
---

# JS模块化

### 模块化的呼声

- 封装方法，全都写道global里面，导致变量污染
- 后来我们把同一个功能封装到一个对象里，但是本质是个对象，不安全
- 匿名闭包模式，然会函数对象（就是Day7里面那个）
- 难以维护，请求过多，依赖模糊

### 石器时代

- 引入Lab.js

- ```javascript
  $LAB.script("framework.js").wait().script("plugin.framework.js")    .script("myplugin.framework.js").wait().script("init.js"); 
  
  $LAB
  .script( [ "script1.js", "script2.js", "script3.js"] )
  .wait(function(){ // wait for all scripts to execute first
      script1Func();
      script2Func();
      script3Func();
  });
  ```

### 蒸汽朋克

- YUI

- ```javascript
  // hello.js
  YUI.add('hello', function(Y){
      Y.sayHello = function(msg){
          Y.DOM.set(el, 'innerHTML', 'Hello!');
      }
  },'3.0.0',{
      requires:['dom']
  })
  
  // main.js
  YUI().use('hello', function(Y){
      Y.sayHello("hey yui loader");
  })
  ```

- 在单个请求中提供多个文件GET 请求，需要服务器支持

### 号角吹响cjs

- commonJS

- 主要运行于服务器端，该规范指出，一个单独的文件就是一个模块。 Node.js为主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。`require` 命令用于输入其他模块提供的功能，`module.exports`命令用于规范模块的对外接口，输出的是一个值的拷贝，输出之后就不能改变了，会缓存起来。

- ```javascript
  // math.js
  exports.add = function(a, b){
      return a + b;
  }
  
  // main.js
  var math = require('math')      // ./math in node
  console.log(math.add(1, 2));    // 3
  ```

- ```javascript
  // timeout.js
  var EXE_TIME = 2;
  
  (function(second){
      var start = +new Date();
      while(start + second*1000 > new Date()){}
  })(EXE_TIME)
  
  console.log("2000ms executed")
  //同步阻塞式加载。只有加载完成，才能执行后面的操作。
  //输入的是被输出的值的拷贝。
  ```

### 双塔奇兵

- AMD(Async Module Definition)，requireJS（实现）

- ```javascript
  //AMD Wrapper
  define(
      ["types/Employee"],  //依赖
      function(Employee){  //回调在所有依赖都被加载后才执行
          function Programmer(){
              //do something
          };
  
          Programmer.prototype = new Employee();
          return Programmer;  //return Constructor
      }
  )
  ```

- ```javascript
  // AMD with CommonJS sugar
  define(["require"], function(require){
      // 在这里， a.js 已经下载并且执行好了
      var a = require("./a")
  })//依赖自收集
  //在这里，我们使用define来定义模块，return来输出接口， require来加载模块，这是AMD官方推荐用法。
  ```

- CMD(Common Module Definition)，SeaJS（实现）

- ```javascript
  define(function(require, exports) {
      var a = require('./a');
      a.doSomething();
  
      exports.foo = 'bar';
      exports.doSomething = function() {};
  });
  
  // RequireJS 兼容风格
  define('hello', ['jquery'], function(require, exports, module) {
      return {
          foo: 'bar',
          doSomething: function() {}
      };
  });
  
  // CMD 执行时机
  define(function(require, exports, module){
      var a = require("a");
      a.doSomething();
      var b = require("b");
      b.doSomething();    // 依赖就近，延迟执行
      //注意和AMD的区别，二者都是提前下载，但是CMD不会提前执行依赖
  })
  ```

- 其实还有个UMD， 这是一种思想，就是一种兼容 commonjs,AMD,CMD 的兼容写法，define.amd / define.cmd / module 等判断当前支持什么方式， 

### 去掉包裹

- NPM的出现， 浏览器没有定义require方法，但Node.js定义了。
- Browserify，浏览器里的CommonJs
- webpack

### 王者归来

- 直到ES6Module，js都没有模块

- babel，JS编译器

- ```javascript
  // export Declaration
  export function foo(){
      console.log('I am not bar.');
  }
  
  // export VariableStatement;
  export var PI = 3.14;
  export var bar = foo;   // function expression
  
  /*
  var PI = 3.14;
  var foo = function(){};
  
  export { PI, foo };
  */
  
  import { PI } from "./math";
  import { foo as bar } from "./math";
  import * as math from "./math";
  
  ```

- ES6 模块的运行机制与 CommonJS 不一样。ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个**只读引用**。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。模块内部引用的变化，会反应在外部。 

  ```javascript
  import { x } from './m2.js';
  console.log(x)//1
  setTimeout(() => {
    console.log(x)//3
  }, 3000);
  
  //m2.js
  var x = 1
  setTimeout(() => {
    x = 3
  }, 1500);
  export var x
  ```

### 动静态

- 动态加载，只有当模块运行后，才能知道导出的模块是什么。

- ```javascript
  var test = 'hello'
  module.exports = {
    [test + '1']: 'world'
  }
  ```

-  静态编译，则是在编译阶段就能知道导出什么模块。  

- ```javascript
  export function hello() {return 'world'}
  ```

- ES6：export 命令会有变量声明提前的效果，import 命令会被 JavaScript 引擎静态分析，优先于模块内的其他内容执行(就是import提升到代码最开始)。

-  export 变量声明提升，为了防止环路引用

- ```javascript
  
  // a.js
  import { foo } from './b.js';
  console.log('a.js');
  export const bar = 1;
  export const bar2 = () => {
    console.log('bar2');
  }
  export function bar3() {
    console.log('bar3');
  }
  
  // b.js
  export let foo = 1;
  import * as a from './a.js';
  console.log(a);
  
  // [Module] {
  //  bar: <uninitialized>,
  //  bar2: <uninitialized>,
  //  bar3: [Function: bar3]
  }
  ```

### CJS(require)和ESM(import)区别

- cjs用于服务器端而esm都可以

- cjs是值的拷贝而esm是值的引用

- cjs是运行时加载，而esm是静态的

- cjs同步加载（执行到require才加载）而esm异步加载（import('m').then(fn)）

- ESM会把import都提到最上边，并且是只读的。规范规定 import/export 必须位于模块顶级，不能位于作用域内；其次对于模块内的 import/export 会提升到模块顶部，这是在编译阶段完成的。 

- 循环引用

  ```javascript
  // a.js
  exports.done = false;
  let b = require('./b');
  console.log('a.js: b.done = %j', b.done);  // true
  exports.done = true;
  console.log('a.js执行完毕');
  
  // b.js
  exports.done = false;
  let a = require('./a');
  console.log('b.js: a.done = %j', a.done);  // false
  exports.done = true;
  console.log('b.js执行完毕');
  
  // main.js
  let a = require('./a');
  let b = require('./b');
  console.log('main.js: a.done = %j, b.done = %j', a.done, b.done);  // true true
  
  // 输出结果
  // node main.js
  b.js: a.done = false
  b.js执行完毕
  a.js: b.done = true
  a.js执行完毕
  main.js: a.done = true, b.done = true
  /*
  b.js: a.done = false b获取到的是暂停了的a
  b.js执行完毕
  a.js: b.done = true b已经结束了
  a.js执行完毕
  main.js: a.done = true, b.done = true*/
  ```

  commonjs 模块的 exports 是动态执行的，具体 require 能获取到的值，取决于模块的运行情况。 

  ```javascript
  // a.mjs
  export let a_done = false;//这里的赋值在import和export之后，也就是说export提升以后只是一个未定义的值
  import { b_done } from './b';
  console.log('a.js: b.done = %j', b_done);
  console.log('a.js执行完毕');
  
  // b.mjs
  import { a_done } from './a';
  console.log('b.js: a.done = %j', a_done);
  export let b_done = true;
  console.log('b.js执行完毕');
  
  // main.mjs
  import { a_done } from './a';
  import { b_done } from './b';
  console.log('main.js: a.done = %j, b.done = %j', a_done, b_done);
  
  // 输出结果
  //ReferenceError: a_done is not defined
  //babel模拟以后es6->es5,结果是
  /*b.js: a.done = undefined
  b.js执行完毕
  a.js: b.done = true
  a.js执行完毕
  main.js: a.done = false, b.done = true*/
  ```

  这是因为提升，声明有了还没定义。

# 从NPM开始

### 命令

- npm init初始化一个新的 package.json 文件。 
- npm install
  -  npm install 模块：安装好后不写入package.json中 
  - npm i --production  只安装 dependencies 字段的模块。 
  - --save|-S   安装好后写入package.json的dependencies中（生产环境依赖） 
  -  --save-dev|-D 安装好后写入package.json的devDepencies中（开发环境依赖） 
  - -f  一个模块不管是否安装过， npm 都要强制重新安装 
  - 版本 module@lastest，module@0.1.1，module@">=0.1.0 <=0.2.0"
- npm set name 'value' 设置环境变量
- npm info module 查看模块信息
- npm run xxx运行package.json中的对应脚本
- npm remove xxx 移除xxx包
- npm login + npm publish  --registry http:xxx发布

### package.json

- 必须属性

  - name
  - version，"3-1-2(alpha|beta|rc)"

- 描述

  - description
- keywords，字符串数组
  
  - author，字符串或对象
- contributors，字符串数组或对象
  
  - homepage，项目主页
- repository，仓库地址
  
  - bugs，问题提交地址
  
- 依赖配置，都是依赖包对象，不同的是他们的用途

  - 依赖包对象为package:"version"，version有三种
    - "1.0.0"固定版本
    - "~1.0.3"安装1.0.x且不低于1.0.3 的版本
    - "^1.0.3"安装1.x.x且不低于1.0.3的版本
  - dependencies 生产环境中所必须的依赖包 
  - devDependencies 开发环境的依赖
  - peerDependencies 供插件指定其所需要的主工具的版本。 
  - optionalDependencies 可选包。 如果需要在找不到包或者安装包失败时，npm仍然能够继续运行，则可以将该包放在此对象中，此对象中的包会覆盖dependencies中同名的包，所以只需在一个地方进行设置即可。 
  -  bundledDependencies配置项是一个数组，数组里可以指定一些模块，这些模块将在这个包发布时被一起打包。 
  - engines：如果某些包对node有要求，可以在次指定node和npm版本

- 脚本

  - scripts：选定npm run xxx运行的脚本
  - config：配置运行时参数

- 文件

  - main：字符串，指定入口文件，默认是index.js

  - browser，如果 npm 包只在 web 端使用，并且严禁在 server 端使用，使用 browser 来定义入口文件。 

  - module， 定义 npm 包的 ESM 规范的入口文件，browser 环境和 node 环境均可使用。如果 npm 包导出的是 ESM 规范的包，使用 module 来定义入口文件。 

  - bin，定义内部命令对应的可执行文件，比如

  - ```json
    "bin": {
      "someTool": "./bin/someTool.js"
    }
    
    scripts: {  
      start: 'someTool build'
    }
    ```

  - files： 一个数组，用来描述当把npm包作为依赖包安装时需要说明的文件列表。 

  - directories字段用来规范项目的目录。  模块目录下除了必须包含包项目描述文件 package.json 以外，还需要包含目录bin、lib、doc等

  - ```json
    "directories": {
        "bin": "./bin",
        "lib": "./lib",
        "doc": "./doc",
        "test" "./test",
        "man": "./man"
    },
    ```

- 发布配置

  - os
  - cpu
  - private
  - 。。。

- 常用第三方

  - typings：指定Ts的入口文件 "types/index.d.ts" 
  - ealintConfig，等同于.edlintrc.json
  - babel，babel的编译配置
  - browserlist，支持的浏览器版本

# NodeJs本体

### 模块

- 使用require和exports
- 引入模块时，先查询文件模块缓存，再查询原生模块，再查询文件模块
- 无路径模块查找顺序：内置模块->node_module->向外遍历直到硬盘层面找node_modules->node_path根目录->全局node_Modules

### Buffer

- JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。但在处理像TCP流或文件流时，必须使用到二进制数据。因此在 Node.js中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。
-  一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。 
- 创建
  - new Buffer(10)长度为10
  - new Buffer([10,20,30])
  - new Buffer("wdnmd", "utf-8")
- 写入缓冲区
  -  buf.write(string\[, offset\[, length]][, encoding]) 
  - 如果写入的内容超过了buffer长度，那么只会部分写入
  - 返回的就是实际写入的大小
- 读取缓冲区
  -  buf.toString([encoding[, start[, end]]]) 
  - 返回start到end位置通过encoding编码后的字符串
- toJSON，转换为json对象
- 合并
  -  Buffer.concat(list[, totalLength]) 
  - 返回list中所有缓冲区按最大长度为totalLength合并后的buffer
- 比较
  - buf.compare(otherBuffer)
  - 返回数字，负数代表buf小于otherBuffer
  - 同样，也有equals方法
- 拷贝
  - buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]]) 
  - 没有返回值
- 裁剪
  -  buf.slice([start[, end]]) 
  - 返回一个新的缓冲区，注意，它和旧缓冲区指向同一块内存，但是从索引 start 到 end 的位置剪切。 
- 填满
  - buf.fill(value[,offset,[end]])
  - 使用value填满offset到end的缓冲区
- read和write，二者都有一系列延伸的方法，他们指定缓冲区每次读写的长度和类型。

### Stream

- Stream 是一个抽象接口，Node 中有很多对象实现了这个接口。例如，对http 服务器发起请求的request 对象就是一个 Stream，还有stdout（标准输出）。
- 四种流
  - Readable
  - Writeable
  - Duplex可读写
  - Transform管道。。。转换数据
- 他们都是EventEmitter的实例，有四种常见的事件
  - data，有数据可读
  - end，无数据可读
  - error，读写错误
  - finish，所有数据已经写好
- 具体用法基于其他模块讲解

### 全局变量

- global，nodeJs的window
- \_\_filename\_\_，表示当前正在执行的脚本的文件名。它将输出文件所在位置的绝对路径，且和命令行参数所指定的文件名不一定相同。 如果在模块中，返回的值是模块文件的路径。
- \_\_dirname\_\_ 表示当前执行脚本所在的目录。 
- setTimeout、clearTimeout、setInterval、clearInterval
- console
- process，进程有关
  - 事件
    - exit，进程准备退出，事件传入状态码code
    - beforeExit， 当 node 清空事件循环，并且没有其他安排时触发这个事件。通常来说，当没有进程安排时 node 退出，但是该监听器可以异步调用，这样 node 就会继续执行。
    -  uncaughtException，出现异常
    - Signal事件，多进程通信相关
  - 属性
    - stdout、stderr、stdin，输出、错误、输入流
    - argv，脚本参数
    - env，当前shell的环境变量
    - 。。。
  - 方法
    - abort()退出node并生成一个核心文件
    - chdir(path)改变工作目录
    - cwd()返回工作目录
    - exit(code=0)使用指定code结束进程
    - 其他有groups的setter和getter以及uid的getter、setter方法
    - nextTick(cb)下一次循环执行cb回调，事件环细说
- require和module

# 常用模块

### fs

- fs中的大部分方法都是同步和异步双版本

- 打开文件

  - fs.open(path, flags[, mode], callback)
  - flags为行为
    - r读，r+读写，rs同步读取，rs+同步读写，此方法不存在抛异常
    - w读，w+读写，wx，wx+，有x不存在抛异常，否则创建
    - a和w一样，不过为追加模式
  - mode则是文件权限，为OS内容
  - cb(err,fd)

- 文件信息

  - fs.stat(path,cb(err,stats))
  - 返回的stats，是文件属性对象

- 写入

  - fs.writeFile(filename, data[, options], callback(err)) 
  - data可以是字符串或buffer
  - options:{encoding,mode,flag}

- 读出

  - fs.read(fd, buffer, offset, length, position, callback) 
  - fs.readFile(path,options:{encoding,flag}|encoding)
  - 对于read方法，fd是open获得的文件描述符，buffer是提供的缓冲区，offset是写入偏移量，position是文件开始位置，cb有三个参数err, bytesRead, buffer，err 为错误信息， bytesRead 表示读取的字节数，buffer 为缓冲区对象。 
  - 实际上也有write方法，参数一样，只不过cb参数error，write和buffer

- 关闭

  - fs.close(fd,cb)
  - cb无参数

- 截取

  - fs.ftruncate(fd, len, callback) 
  - cb无参数
  - 修改了文件内容为len长度内的内容

- 删除

  - fs.unlink(path,cb(err))

- 目录

  - fs.mkdir(path[, mode], callback) 
  - fs.readdir(path, callback) 回调函数带有两个参数err, files，err 为错误信息，files 为 目录下的文件名数组列表。 
  -  fs.rmdir(path, callback) 删除目录

- 其他

  - fs.exists(path,cb)检测存在性
  - access指定权限
  - createReadStream(path,options:{encoding、start...})
  - createWriteStream(path,options:{encoding、start...})

- 使用流

  - ```javascript
    var fs = require("fs");
    var zlib = require('zlib');
    
    // 压缩 input.txt 文件为 input.txt.gz
    fs.createReadStream('input.txt')
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream('input.txt.gz'));
    
    console.log("文件压缩完成。");
    
    //other
    var fs = require("fs");
    
    // 创建一个可读流
    var readerStream = fs.createReadStream('input.txt');
    
    // 创建一个可写流
    var writerStream = fs.createWriteStream('output.txt');
    
    // 管道读写操作
    // 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
    readerStream.pipe(writerStream);
    
    console.log("程序执行完毕");
    ```

### path

- **path.normalize(p)** 规范化路径
- **path.join(...paths)** 用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是"/"，Windows系统是"\"。  
- **path.resolve([from ...], to)** 将 to 参数解析为绝对路径。  
- **path.isAbsolute(path)** 判断参数 path 是否是绝对路径。  
- **path.relative(from, to)** 用于将相对路径转为绝对路径。  
- **path.dirname(p)** 返回路径中代表文件夹的部分，
- **path.basename(p[, ext])** 返回路径中的最后一部分。
-  **path.extname(p)** 返回路径中文件的后缀名  
- **path.parse(pathString)** 返回路径字符串的对象。  
- **path.format(pathObject)** 从对象中返回路径字符串，和 path.parse 相反。
- sep当前平台的文件路径分隔符
- delimiter，平台的分隔符

### OS提供访问系统信息的模块

### Domain、DNS、Net

三者属于最底层的网络通信模块，提供最底层通信功能

# 使用Node搭建网络服务

```javascript
var http = require('http');
var fs = require('fs');
var template = require('art-template');
var url = require('url');
var comments = [
  {
    name: '张三',
    message: '今天气不辍',
    dataTime: '2015-10-16'
  },
  {
    name: '李四',
    message: '今天气不辍',
    dataTime: '2015-10-16'
  },
  {
    name: '王五',
    message: '今天气不辍',
    dataTime: '2015-10-16'
  },
  {
    name: '陈六',
    message: '今天气不辍',
    dataTime: '2015-10-16'
  }
]
http
  .createServer(function (req, res) {
    var parseObj = url.parse(req.url, true);//true表示分析query参数
    //req.method获取get、post。。。
    var pathname = parseObj.pathname;
    if (pathname === '/') {
      res.setHeader("Content-type", "text/html;charset=utf8");
      fs.readFile('./views/index.html', function (err, data) {
        if (err) {
          return res.end('404')
        }
        var htmlStr = template.render(data.toString(), {
          comments: comments
        })
        res.end(htmlStr);
      });
    } else if (pathname.indexOf('/public/') === 0) {
      fs.readFile('.' + pathname, function (err, data) {
        if (err) {
          return res.end(404);
        }
        res.end(data);
      });
    } else if (pathname === '/post') {
      res.setHeader("Content-type", "text/html;charset=utf8");
      fs.readFile('./views/post.html', function (err, data) {
        if (err) {
          return res.end(404);
        }
        res.end(data);
      });
    } else if (pathname === '/pinglun') {
      var comment = parseObj.query;
      var date = new Date();
      var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getUTCDate() + ' ' + (date.getUTCHours() + 8) + ':' + date.getUTCMinutes();
      comment.dataTime = time;
      comments.push(comment);
      res.statusCode = 302;
      res.setHeader('Location', '/');
      res.end();
    } else {
      res.end('404');
    }
  })
  .listen(3000, function () {
    console.log('running');
  });
```

# 其他

### util模块

- util.inherits(constructor, superConstructor)实现对象间原型继承
- util.inspect(object,[showHidden],[depth],[colors])将任意对象转换为字符串的方法。showHidden 是一个可选参数，如果值为 true，将会输出更多隐藏信息。depth表示最大递归的层数（默认2） 指定为 null 表示将不限递归层数完整遍历对象。 
- promisify(function)，将一个函数Promise化

### nodeJs发送请求

```javascript
const http = require("http");
// 发送请求的配置
let config = {
    host: "localhost",
    port: 3000,
    path:'/',
    method: "GET",
    headers: {
        a: 1
    }
};
// 创建客户端
let client = http.request(config, function(res) {
    // 接收服务端返回的数据
   let repData='';
    res.on("data", function(data) {
        repData=data.toString()
        console.log(repData)
    });
    res.on("end", function() {
        // console.log(Buffer.concat(arr).toString());
    });
});
// 发送请求
client.end();//结束请求，否则服务器将不会收到信息
```





