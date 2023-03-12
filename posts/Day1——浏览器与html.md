---
title: "浏览器与html"
date: "2023-01-09"
---

# 浏览器进线程(V8)

### 进程

> 浏览器有三个不变进程
>
> > 浏览器总进程：负责控制浏览器除标签页外的界面，包括地址栏、书签、前进后退按钮等，以及负责与其他进程的协调工作，同时提供存储功能 
> >
> > GPU进程：实现3D效果
> >
> > 网络进程：负责发起和接受网络请求 
>
> 还有多个渲染进程
>
> > 渲染进程可以理解为：默认情况下会为每一个标签页配置一个渲染进程，但从A页面里面打开一个新的页面B页面，而A页面和B页面又属于同一站点的话，A和B就共用一个渲染进程，其他情况就为B创建一个新的渲染进程 
>
> 以及多个插件进程（一个插件一个）

### 线程

渲染进程中的线程

- GUI渲染线程：负责解析DOM和页面绘制
- JS引擎线程：负责解析执行JS， **它和GUI渲染进程不能同时执行，只能一个一个来，如果JS执行过长就会导致阻塞掉帧** 
- 计时器线程：负责处理setInterval和setTimeout。
- 异步http请求线程：  XMLHttpRequest连接后浏览器开的一个线程，负责处理请求后的回调函数（只负责添加到执行队列，执行依然靠JS进程）
- 事件触发线程：用来控制事件环 

# W3C万维网联盟标准

万维网联盟标准不是某一个标准，而是一些列标准的集合。网页主要有三部分组成：结构（Structure）、表现（Presentation）、行为（Behavior）。

对应的标准也有三方面：结构化标准主要包括XHTML和XML，表现标准语言主要包括CSS、行为标准主要包括（如W3C DOM）、ECMAScript等。这些标准大部分是W3C起草发布，也有一是其他标准组织制定的标准。 

# URL处理流程

### 概念

 URL（Uniform Resource Locator），统一资源定位符，用于定位互联网上资源，俗称网址。 

```
scheme: // host.domain:port / path / filename ? abc = 123 # 456789
scheme       - 定义因特网服务的类型。常见的协议有 http、https、ftp、file，
               其中最常见的类型是 http，而 https 则是进行加密的网络传输。
host         - 定义域主机（http 的默认主机是 www）
domain       - 定义因特网域名，比如 baidu.com
port         - 定义主机上的端口号（http 的默认端口号是 80）
path         - 定义服务器上的路径（如果省略，则文档必须位于网站的根目录中）。
filename     - 定义文档/资源的名称
query        - 即查询参数
fragment     - 即 # 后的hash值，一般用来定位到某个位置
```

### DNS域名解析

- 首先把网址变成IP地址
- DNS 协议提供通过域名查找 IP 地址，或逆向从 IP 地址反查域名的服务。 
- DNS迭代查询
  - 个人电脑
  - 猫
  - local ISP   互联网服务提供商
  - regional ISP   经过多个主干网络
  - NSP   网络服务提供商  大型网络  卖带宽给ISP
  - NAP   每个NSP连接到至少三个网络访问点
  - ISP  NSP 所有网络提供都携带路由器，每个路由有当前子网络ip的路由表，当底层向上层发送数据时候，找不到会依次向上找，可能由一个主干网络跳到另外一个主干网络。 
- DNS优化
  - 多级缓存：浏览器缓存，系统缓存，路由器缓存，IPS服务器缓存，根域名服务器缓存，顶级域名服务器缓存，主域名服务器缓存。
  
  - DNS负载均衡
  
  - CND（ Content Delivery Network ）分布式网络，最近的IP地址
  
  - dns-prefetch，浏览器预解析域名。
  
    ```html
    <link rel="dns-prefetch" href="http://xxx.net" />
    ```

### TCP三次握手建立连接

### HTTP请求与缓存

### 接下来是浏览器解析绘制

### 最后四次挥手断开连接

# 浏览器解析渲染

### 渲染流程

- 解析HTML，构建DOM树
- 解析CSS，构建CSS规则树（与HTML解析同步）
- 合并DOM和CSS，生成render树
- 布局layout树，负责各元素尺寸位置计算（回流、重排）
- 绘制render树，绘制像素信息（重绘）

### HTML解析

-  Conversion转换：把获得的Byts转换为字符（可阅读的html标签）
-  Tokenizing分词： 将标签转化为树形的token
-  Lexing词法分析： 根据token生成结点
- 构建Dom树

### CSSOM解析类似DOM树

### 合并排布渲染

- 计算CSS样式 
- 构建渲染树，重排时并不会计算不占位（display:none等）标签，因此render tree是DOM树根据CSSOM舍弃了不可见标签和不显示标签的结果
- 布局，主要定位坐标和大小，是否换行，各种position overflow z-index属性 reflow
- 绘制，将图像绘制出来  repaint

# 跨域

### 同源策略

浏览器安全的基石是"同源政策"（same-origin policy），所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。

限制行为

-  Cookie、LocalStorage 和 IndexDB 无法读取。 
-  DOM 无法获得。 
-  AJAX 请求不能发送。 

### 前端解决方案

#### jsonp

> 浏览器允许在标签中加载跨域的静态资源，也就是说JS标签、css标签等src或href可以跨域， 我们可以通过动态创建script，再请求一个带参网址实现跨域通信。jsonp正是利用这个特性来实现的。  
>
> ```html
> <script>
>   function jsonCallback(data) {
>     console.log(data);
>   }
> </script>
> <script src="url"></script>
> <!--这个脚本调用了jsonCallback-->
> ```
>

#### CORS

服务器端设置Access-Control-Allow-Origin，如果需要Cookie，服务端Access-Control-Allow-Credentials应为true，客户端XMLHttpRequest的withCredentials=true

#### 开发模式下的代理服务器

#### postMessage 跨窗口通信（实现类似ws）

# SEO (Search Engine Optimization) 

做好SEO，可以提高网站知名度，上升在搜索引擎中的排名

### 优化方法

- 页面结构扁平化，3次跳转就能找到需求内容
- 重要代码和内容放在前面
- 控制大小，提高反应性能
- 合理的设计title、description和keywords
- 图片加上alt标签
- 语义化标签
  - title、h1~h6、列表
  - meta、description
  - nav、section、aside、main、footer、header
  - strong。。。
- 外链加rel=“nofollow”告诉蜘蛛不要爬取
- SSR或SSG
- 使用https
- URL简明扼要
- 增加友链和内链

# HTML头部标签

###  \<!DOCTYOE html\>

首先，如果写，就一定写在第一行

并非html标签，用来指定文档类型是html，只要按照这样的格式和位置写，那么浏览器就会认为你在使用标准 HTML。不用再像 HTML5 出来之前那样，既要写上 HTML 版本号，又要写上这个 HTML 文档所依据的标准是在什么位置。一劳永逸，之后不管 HTML 再怎么更新，我们的文档都可以被浏览器以最正确的方式显示出来。 

文档解析模式：在严格模式下浏览器根据W3C标准进行解析并渲染，这也是默认模式，而在混杂模式下浏览器会用自己的渲染方式解析并渲染。

### base规定页面相对地址的目标 

### HREF="mailto:xxx" 这个a标签可以直接打开设备的邮件应用 

### meta

- 所有属性都有一个content属性解释内容

  ```html
  <meta http-equiv="content-type" content="text/html"/>
  ```

- http-equiv属性
  - content-type，规定文档类型
  - expires：设置浏览器的过期时间
  - refresh：设置规定时间跳转到指定页
  - window-target：强制页面在当前窗口以独立页面显示 
  - pragma：禁止浏览器从本地计算机的缓存中访问页面的内容 
- name属性
  - author
  - description
  - keywords
  - revised最新版本
  - robots：告知机器人抓取哪些页面（`all`：文件将被检索，且页面上的链接可以被查询； `none`：文件将不被检索，且页面上的链接不可以被查询； `index`：文件将被检索； `follow`：页面上的链接可以被查询； `noindex`：文件将不被检索，但页面上的链接可以被查询； `nofollow`：文件将不被检索，页面上的链接可以被查询。）

### script标签的defer与async

- 普通script下载和执行会阻碍html解析
- async：异步下载，下完执行，阻碍解析
- defer：异步下载，html解析完执行

### link标签的特殊rel

- prefetch 用于在浏览器的空闲时间请求资源，以后可能用到，浏览器要是没事就先拿到缓存起来再说
- preload 用于提前加载在页面初始化加载（page load）时用到的资源， 强制将它的请求优先级提到前面 
- preconnect 用于提前和一个网站建立起连接
- 如果使用了特殊rel，那么需要as属性指定元素类型

# html嵌套问题

- p不能嵌套块
- a可以嵌套块，但不能嵌套自己
- h1~h6、dt不能嵌套块
- header、footer不可嵌套header、footer

# Src和href

> **href：**是指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，用于超链接。标识超文本引用，用在**link**和**a**等元素上，**href**是引用和页面关联，是在当前元素和引用资源之间建立联系。
>
> src：是指向外部资源的位置，指向的内部会迁入到文档中当前标签所在的位置；在请求src资源时会将其指向的资源下载并应用到当前文档中，例如js脚本，img图片和frame等元素。表示引用资源，表示替换当前元素，用在img，script，iframe上，src是页面内容不可缺少的一部分。
>

src会阻塞其他资源的下载和处理，直到将该资源加载或执行完毕。 而href则会下载并且不会停止对当前文档的处理。 

# HTML5的新特性

- 语义化标签
- 媒体标签
  - video
  - audio
  - source
- 新的表单（url、email等）
- meter度量器、progress进度条
- DOM查询操作querySelector
- localStorage、SessionStorage
- canvas
- draggable
- 移除css可以实现的行内标签以及对可用性产生负面影响的元素frame等 

# iframe

**优点：**

- 用来加载速度较慢的内容（如广告）
- 可以使脚本可以并行下载
- 可以实现跨子域通信

**缺点：**

- iframe 会阻塞主页面的 onload 事件
- 无法被一些搜索引擎索识别
- 会产生很多页面，不容易管理