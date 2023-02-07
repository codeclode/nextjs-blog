---
title: "axios和sass"
date: "2023-01-30"
---

# Axios

## 使用示例

```javascript
const axios = require('axios');

// 向给定ID的用户发起请求
axios.get('/user?ID=12345')
  .then(function (response) {
    // 处理成功情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
  .then(function () {
    // 总是会执行
  });
```

## 发送一个请求

```javascript
axios({//就是axios.request(config)方法
    method:"post"//支持request,
    url:'url'
}).then((res)=>{
    /*xxx*/
})
axios('url')//直接发送一个get
```

- axios.request(config)
- 简化method
- axios.get(url[, config])
- axios.delete(url[, config])
- axios.head(url[, config])
- axios.options(url[, config])
- axios.post(url[, data[, config]])
- axios.put(url[, data[, config]])
- axios.patch(url[, data[, config]])

### 创建一个实例

```javascript
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```

创建的实例有着和axios本体一样的方法，只不过会合并配置

## 请求配置

就是我们前面的config

- url:"/user"请求的服务器URL

- method:"get"不填默认get

- baseURL 将自动加在 url 前面，除非url 是一个绝对 URL。 

- ```javascript
  transformRequest: [function (data, headers) {
    // 对发送的 data 进行任意转换处理
    return data;
  }]
  transformResponse: [function (data) {
    // 对接收的 data 进行任意转换处理
    return data;
  }],
  ```

- headers:{xxx:xxx}自定义请求头

- params:和请求一起发送的 URL 参数，一个简单对象或者URLSearchParams对象

- paramsSerializer:(params)=>string 是可选方法，主要用于序列化params

- data:用来作为 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法 的携带数据
   在没有设置 transformRequest 时，则必须是以下类型之一:  string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams,FormData, File, Blob, Stream, Buffer 

- timeout:1000最长等待毫秒，设置为0则永不超时

- withCredentials:false 跨域请求时是否需要使用凭证 

- auth: { username: 'xxx', password:"123"},http基础验证 

- responseType:"json"  选项包括: 'arraybuffer', 'document', 'json', 'text', 'stream' 

- responseEncoding: 'utf8', // 默认值 

- xsrfCookieName: 'XSRF-TOKEN', // 默认值 

- ```javascript
  onUploadProgress: function (progressEvent) {
      // 处理原生进度事件
  },
  onDownloadProgress: function (progressEvent) {
      // 处理原生进度事件
  },
  ```

- maxContentLength: 2000,  node.js中允许的HTTP响应内容的最大字节数 

- maxBodyLength: 2000, （仅Node）定义允许的http请求内容的最大字节数 

- ```javascript
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },//自定义axios如何判断reject还是resolve
  ```

- ```javascript
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },
  //定义代理服务器,使用false禁用此功能
  ```

- signal待会说

- 修改配置：请求方法本身，创建axios实例，修改默认值axios.default.baseURL=xxx

- 配置优先级：请求方法config>axios实例config>全局config>默认值

## 响应

```json
{
  // 真正的结果
  data: {},
  status: 200
  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',
  // `headers` 是服务器响应头
  // 所有的 header 名称都是小写，而且可以使用方括号语法访问
  // 例如: `response.headers['content-type']`
  headers: {},
  //请求的配置信息
  config: {},
  // `request` 是生成此响应的请求
  request: {}
}
```

## 拦截器

请求或响应被 then 或 catch 处理前拦截它们。 

```javascript
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    return Promise.reject(error);
  });
```

移除拦截器

```javascript
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

当然，实例也可以添加拦截器。

## 请求取消

CancelToken已经弃用，之说signal

使用AbortController来对请求进行中止，这个类有一个只读的signal属性用来控制请求是否中止。

提供abort方法中止请求

```javascript
const controller = new AbortController();
axios.get('/foo/bar', {
   signal: controller.signal//可以用在多个请求上，方便同时取消请求
}).then(function(response) {
   //...
});
// 取消请求
controller.abort()
```

# Sass

## 扩展的CSS

Sass允许规则和属性嵌套

```scss
#main {
  width: 97%;
  p, div {
    font-size: 2em;
    a { 
        font-weight: bold; 
    }
  }
  pre {   
    font: {
      family: fantasy;
      size: 30em;
      weight: bold;
    }
  }
}
```

&在嵌套里代表父元素

```scss
a{
  $:hover{
    cursor:"pointer"
  }
}
```

## Sass脚本

### 变量

```scss
$width: 5em;
#main{
    width:$width
}
```

支持块级作用域

```scss
#main {
  $width: 5em !global;//定义成全局的
  $height:5em;//局部的
  width: $width;
  height:$height;
}

#sidebar {
  width: $width;
}
```

可以在变量的结尾添加 `!default` 给一个未通过 `!default` 声明赋值的变量赋值，此时，如果变量已经被赋值，不会再被重新赋值，但是如果变量还没有被赋值，则会被赋予新的值。 

```scss
$content: "First content";
$content: "Second content?" !default;
$new_content: "First time reference" !default;
#main {
  content: $content;
  new-content: $new_content;
}
```

### 数据类型

- 数字，1,2,10px
- 字符串，"foo", 'bar', baz，这个怎么写就怎么编译，除非只有一种情况例外，使用 #{}时，有引号字符串将被编译为无引号字符串，这样便于在 mixin 中引用选择器名
- 颜色，blue，#66ccff，rgba(255,0,0,0.5)
- 布尔，false,true
- 空值null
- 数组，不过用空格和逗号分隔1.5em 1em 0 2em, Helvetica, Arial, sans-serif
- maps：(key1: value1, key2: value2) 

### 运算

- 数字可以直接加减乘除和mod，也可以大于小于，会自动单位转换
- 等于和不等于可以作用在所有类型上
- 颜色运算也可以加减乘除，不过是r、b、g分别运算
- 字符串可以使用+链接，有引号的文本字符串可以使用#{xxx}动态引入值
- 布尔可以and、or、not

## 流程和函数

### 流程

- if

  ```scss
  p {
    @if 1 + 1 == 2 { border: 1px solid; }
    @else if 5 < 3 { border: 2px dotted; }
    @else  { border: 3px double; }
  }
  ```

- for

  ```scss
  @for $i from 1 through 3 {
    .item-#{$i} { width: 2em * $i; }
  }//1,2,3
  @for $i from 1 to 3 {
    .item-#{$i} { width: 2em * $i; }
  }//1,2
  ```

- each遍历列表

  ```scss
  @each $animal in puma, sea-slug, egret, salamander {
    .#{$animal}-icon {
      background-image: url('/images/#{$animal}.png');
    }
  }
  ```

- while

  ```scss
  $i: 6;
  @while $i > 0 {
    .item-#{$i} { width: 2em * $i; }
    $i: $i - 2;
  }
  ```

### 函数

```scss
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar { width: grid-width(5); }
```

## @指令

### @import

```scss
@import "foo.css";
@import "foo" screen;
@import "http://foo.com/bar";
@import url(foo);
@import 'foo.scss'
```

可以嵌套到css里边，与平时的用法效果相同，只是这样导入的样式只能出现在嵌套的层中。 

```scss
.example {
  color: red;
}
#main {
  @import "example";
}
```

### @media

和CSS 中用法一样，只是增加了一点额外的功能：允许其在 CSS 规则中嵌套。 

```scss
.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}
```

### @extend

```scss
.error {
  border: 1px #f00;
  background-color: #fdd;
}
.seriousError {
  @extend .error;// .error 下的所有样式继承给 .seriousError
  border-width: 3px;
}
```

extendOnly不单独渲染，只用来被继承

```scss
#context a%extreme {//%是占位符选择器 # 或 . 被替换成了 %。
  color: blue;
  font-weight: bold;
  font-size: 2em;
}
.notice {
  @extend %extreme;
}

//结果是
#context a.notice {
  color: blue;
  font-weight: bold;
  font-size: 2em; 
}
```

## 混入

### 定义一个混入

```scss
@mixin large-text {
  font: {
    family: Arial;
    size: 20px;
    weight: bold;
  }
  color: #ff0000; 
  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}
```

### 引入混合样式

```scss
.page-title {
  @include large-text;
  padding: 4px;
  margin-top: 10px;
}
@mixin silly-links {
  a {
    color: blue;
    background-color: red;
  }
}
@include silly-links;
//也可以直接定义在最外层，这就相当于把maxin的外壳扒了
```

### 参数

和include不同的是，我们可以定义参数

```scss
@mixin sexy-border($color, $width) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue, 1in); }
h1{ @include sexy-border($width:2in,$color:blue)}

@mixin box-shadow($shadows...) {//...不能确定有多少个 'shadow' 会被用到
  -moz-box-shadow: $shadows;
  -webkit-box-shadow: $shadows;
  box-shadow: $shadows;
}
.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
```
