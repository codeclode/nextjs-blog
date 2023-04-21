---
title: "NodeJS后端框架"
date: "2023-01-18"
---

# Express

### Express提供的机制

- 为不同 URL 路径中使用不同 HTTP 动词的请求（路由）编写处理程序。
- 集成了“视图”渲染引擎，以便通过将数据插入模板来生成响应。
- 设置常见 web 应用设置，比如用于连接的端口，以及渲染响应模板的位置。
- 在请求处理管道的任何位置添加额外的请求处理“中间件”。
- 其实，这玩意也全是中间件，遇到res.end()返回

### 开启服务、静态资源和路由

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.[route|all|get|post|delete|put](path,function (req,res)=>{
	dosomethings()
})
//path，可用+?()?甚至正则匹配，()?、?代表可选字符，+代表1到无限个字符，*代表任意字符。:则是路由参数，比如/users/:userId
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
//如果需要分模块，也可以这样
var birds = express.Router()
birds.get('/', function (req, res) {
  res.send('Birds home page')
})
app.use('/birds', birds)
//静态资源
app.use('/static', express.static('public'))
//意思是，通多static前缀访问public文件夹的资源
//如http://localhost:3000/static/js/app.js
```

### 中间件

```javascript
var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

app.use(requestTime)//中间件使用
//中间件本质就一函数，里边有req，res，next
//如果需要对指定的path使用中间件
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
//当然，为了模块拆分，也可以使用router.use

app.get('/', function (req, res) {
  var responseText = 'Hello World!<br>'
  responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  res.send(responseText)
})
//错误处理中间件不太一样
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

```javascript
//如果需要配置项
module.exports = function (options) {
  return function (req, res, next) {
    // Implement the middleware function based on the options object
    next()
  }
}

var mw = require('./my-middleware.js')

app.use(mw({ option1: '1', option2: '2' }))
```

### 模板引擎

```javascript
//配置模板引擎
app.set('view engine', 'pug')
//渲染
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})
//这个意思是把index.pug文件渲染成html并返回
```

### 常用

- 中间件

  - express.json，它解析传入的请求 与 JSON 有效负载 
  - express.static
  - express.urlencoded它解析传入的请求 使用urlen编码有效载荷 

- 路由器

  - express.Router(\[{配置项，包含大小写是否区分、是否严格路由等}\])

- 变量

  - 设置和使用， 该对象具有作为应用程序中的局部变量的属性。 app.locals.xxx

- req

  - req.app这是为了方便模块化以后的中间件可用获取app实例
  - req.baseUrl挂在路由器实例的URL路径
  - req.body请求体，一般会使用已有的中间件进行处理以后再在服务本体中使用
  - req.cookies
  - req.fresh响应在客户端缓存中仍为“最新”时，将返回 true
  - host、hostname、originalUrl、params、query通url的结构
  - secure是否为https
  - signedCookies
  - get(field)，获取请求头中对应field的内容
  - is(content-type)判断请求是否为对应content-type，不是就返回false，是就返回content-type
  - 其他的不是经常用

- res

  - locals，就是app.locals

  - append(filed[,value]) 将指定的value追加到filed对应的HTTP 响应标头。如果尚未设置标头，它创建具有指定值的标头。参数可以是字符串或数组。 

  - cookie(name,value[,options])设置一个键为name值为value的cookie。参数可以指定cookie的域、到期日等信息

  - clearCookie(name[,options])，删除指定键的cookie，可以设置和上一个方法一样的options

  - attachment([filename])如果没有filename，仅设置content-Disposition为attachment（附件），否则还会设置filename和content-Type

  - download(path[,filename]\[,option\]\[fn\])将对应path的文件作为附件传输给客户端

  - end([data]\[,encoding])给客户端返回数据，同时可以设置res.status(200).end()

  - json([body])以json的形式返回对象

  - jsonp([body])以jsonp支持的形式返回json

  - links(links)，填充http的Link响应头

  - location(path)设置响应头的 Location字段

  - redirect([status,]path)，重定向

  - render

  - send

  - ```javascript
    res.send(Buffer.from('whoop'))
    res.send({ some: 'json' })
    res.send('<p>some html</p>')
    res.status(404).send('Sorry, we cannot find that!')
    res.status(500).send({ error: 'something blew up' })
    ```

  - sendStatus(number)设置返回的状态码

  - set(field[,value])设置响应头

  - res.type(type)设置响应头中的MiMe type字段

  - vary(field)如果不存在，就为响应头添加field字段

# Koa2

>  通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。 
>
> Koa使用洋葱模型，没有其他东西，全是中间件

### 搞一个中间件

```javascript
const Koa = require('koa');
const app = new Koa();
app.listen(3000);

function logger(format) {
  format = format || ':method ":url"';

  return async function (ctx, next) {
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', ctx.url);

    console.log(str);

    await next();
  };
}

app.use(logger());
app.use(logger(':method :url'));
```

### 组合中间件

```javascript
const compose = require('koa-compose');

async function random(ctx, next) {
  if ('/random' == ctx.path) {
    ctx.body = Math.floor(Math.random() * 10);
  } else {
    await next();
  }
};

async function backwards(ctx, next) {
  if ('/backwards' == ctx.path) {
    ctx.body = 'sdrawkcab';
  } else {
    await next();
  }
}

async function pi(ctx, next) {
  if ('/pi' == ctx.path) {
    ctx.body = String(Math.PI);
  } else {
    await next();
  }
}

const all = compose([random, backwards, pi]);

app.use(all);

app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});//错误处理
```

### ctx对象

- ctx.req等同于Node的request对象
- ctx.res等同于response，但是不要绕过koa处理返回，因此避免使用res提供的返回方法和对象
- ctx.request,Koa本身的Request
- ctx.response,Koa本身的Response
- state， 推荐的命名空间，用于通过中间件传递信息和你的前端视图。 
- app，程序实例
- app.emit()，发送事件，方便错误统一处理
- cookie.set(name, value, [options])、get方法
- throw(statusCode,message)抛出错误
- 以及把ctx.response、ctx.request的一些属性直接付给ctx方便使用

### Request对象基本和express中的一致

### Response对象

- header、headers、socket只读
- status状态码
- message状态信息
- body响应体，这里可以直接等号设置，可以直接吧对象和数组转json
- get、has、set、append、remove对于响应头进行操作，其中set可以接收键+值或者用一个对象设置多个响应头
- type： 设置响应 Content-Type 通过 mime 字符串或文件扩展名。 
- redirect(url,alt) 当 url不存在时，使用 alt或 “/”。
- attachment，和express一样
- lastModified，设置或读取上一次修改的日期 

# NodeJS中的websocket

### 基于

- 原生
- socket.io
- expressWs
- koa-websocket(好久没人维护了)

### 原生

```javascript
const server = http.createServer((req, res) => {
  // 检查请求是否为 WebSocket 握手请求，握手仍然基于http
  if (req.method === 'GET' &&
      req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() === 'websocket' &&
      req.headers.connection &&
      req.headers.connection.toLowerCase() === 'upgrade' &&
      req.headers['sec-websocket-key']) {
    // 返回 WebSocket 握手响应
    const key = req.headers['sec-websocket-key'];
    const hash = require('crypto').createHash('sha1');
    hash.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    const accept = hash.digest('base64');
    // 要求升级协议
    res.writeHead(101, {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
      'Sec-WebSocket-Accept': accept
    });
    // 创建 WebSocket 连接
    const socket = new WebSocket(req, res);
    socket.on('open', () => {
      console.log('Client connected');
    });
    socket.on('message', (message) => {
      console.log(`Received message: ${message}`);
      socket.send(message);
    });
    socket.on('close', () => {
      console.log('Client disconnected');
    });
    return;
  }
  // 处理其他 HTTP 请求
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, world!\n');
});
server.listen(8080);
```

### socket.io的一个实现

```javascript
//客户端
<script src="/socket.io/socket.io.js"></script>
  <script>
    //连接socket服务
    let socket = io('http://127.0.0.1:3000');
    //浏览器注册服务端
    socket.on('send', data => {
      console.log(data);
    });

    socket.on("transform", data => {
      console.log(data);
    })

    let name = window.prompt("输入名称");

    //向服务器发送数据
    socket.emit('clientData', { name: name });

    function sendDate(toUser, content) {
      socket.emit("sendData", { name: toUser, fromName: name, content: content })
    }
</script>
```

```javascript
const io = require('socket.io')(app);
//监听用户连接的事件
//socket表示用户的连接
//socket emit表示触发某个事件   如果向浏览器发送一个数据，需要触发浏览器注册的某个事件
//socket on表示注册某个事件，如果需要获取浏览器数据，就需要注册一个事件，等待浏览器触发
var sockets = {}
io.on('connection', socket => {
  console.log('新用户连接');
  //给浏览器发送数据emit('发送的事件','发送的事件')
  socket.emit('send', { name: 'jack' });

  //获取浏览器发送的数据,注册事件只要和触发事件一样就行
  socket.on('clientData', data => {
    console.log(data);
    if (!sockets[data.name]) {
      sockets[data.name] = socket
    }
  })

  socket.on("sendData", data => {
    if (sockets[data.name]) {
      sockets[data.name].emit("transform", { name: data.fromName, content: data.content })
    }
  })
});
```

