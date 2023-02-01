---
title: "前端计算机网络"
date: "2023-01-21"
---

# 网络模型

### OSI

- 应用层
- 表示层
- 会话层
- 运输层
- 网络层
- 链路层
- 物理层

### 常用的分层则是

- 应用层
- 运输层
- 网络层
- 链路层
- 网络层

# HTTP

### 下定义

- http是超文本传输协议，用来传输超文本的协议。
- 超文本，文本语义的扩大化，不仅仅是char，还有图片、音频、视频，甚至点击文字或图片能够进行超链接的跳转。
- 传输，两台计算机之间会形成互联关系进行通信，我们存储的超文本会被解析成为二进制数据包，由传输载体（例如同轴电缆，电话线，光缆）负责把二进制数据包由计算机终端传输到另一个终端的过程。
- 网络协议就是网络中(包括互联网)传递、管理信息的一些规范。如同人与人之间相互交流是需要遵循一定的规矩一样，计算机之间的相互通信需要共同遵守一定的规则，这些规则就称为网络协议。 

### 特征

- 支持CS模式
- 简单快速，客户向服务器请求服务时，只需传送请求方法和路径。 
- 灵活，可以传输多种数据对象，用content-type标记
- 无连接，服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。
- 无状态，没有记忆能力，如果后续处理需要前面的信息，则它必须重传。

### 内容（组成）

- 起始行(start line)
  - 请求方法
    - get、post、put、delete、head、delete、options、trace、connect
  - URL
    - URL=URI+URN
    - 协议://主机地址:端口/路径?查询参数#锚点
  - 版本号
- 头部(header):k-v形式
  - 通用标头
    - Date表示日期时间，采用格林威治时间
    - Cache-Control，控制缓存行为，有max-age（ 资源被认为仍然有效的最长时间 ） s-maxage: 重写了 max-age 和 Expires 请求头，仅仅适用于共享缓存，被私有缓存所忽略 max-stale：表示客户端接受的最大响应时间，min-fresh，表示客户端希望响应在指定的最小时间内有效
    - Connection：keep-alive|close，连接是否持久
  - 请求标头
    - host，指明了服务器域名
    - Referer当浏览器向 web 服务器发送请求的时候，一般会带上 Referer，告诉服务器该网页是从哪个页面链接过来的
    - Upgrade-Insecure-Requests  向服务器端发送信号，表示客户端优先选择加密及带有身份验证的响应。 
    - if-Modified-Since 这个标头让请求变成条件请求，如果在 Last-Modified 之后更新了服务器资源，那么服务器会响应200，如果在Last-Modified之后没有更新过资源，则返回 304。 
    - If-None-Match HTTP请求标头使请求成为条件请求。 对于 GET 和 HEAD 方法，仅当服务器没有与给定资源匹配的 `ETag` 时，服务器才会以200状态发送回请求的资源。 对于其他方法，仅当最终现有资源的`ETag`与列出的任何值都不匹配时，才会处理请求。
  - 响应标头
    - 状态码
    - Access-Control-Allow-Origin，允许跨域
    - keep-alive 有两个参数，它们是以逗号分隔的参数列表，每个参数由一个标识符和一个由等号 = 分隔的值组成。 timeout= 空闲连接必须保持打开状态的最短时间 ，max= 指示在关闭连接之前可以在此连接上发送的最大请求数。 
    - server：服务器系统信息
    - set-Cookie，鉴权讲
    - Transfer-Encoding 规定了传输报文主体时采用的编码方式。 
  - 实体标头
    - Content-tyoe
    - Content-Language
    - Content-Encoding，用来压缩媒体类型。Content-Encoding 指示对实体应用了何种编码。 
  - 内容协商
    - 是指客户端和服务器端就响应的资源内容进行交涉，然后提供给客户端最为适合的资源。内容协商会以响应资源的语言、字符集、编码方式等作为判断的标准。 
    - MIME类型，其实就是一系列消息内容类型的集合，后边跟的q代表权重，默认1
    - Accept 接受请求 HTTP 标头会通告客户端其能够理解的 MIME 类型` Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`
    - Accept-Charset：规定服务器处理表单数据所接受的字符集，比如UTF-8，可以是unknown
    - Accept-Language：接受的语言及其权重
- 正文(entity)，也就是请求体，千奇百怪

### 状态码

| code |                          content                           |
| :--: | :--------------------------------------------------------: |
| 200  |                          成功响应                          |
| 204  |                   成功，但是没有资源返回                   |
| 206  | 对资源某一部分进行响应，由Content-Range 指定范围的实体内容 |
| 301  |                         永久重定向                         |
| 302  |                         临时重定向                         |
| 400  |                    请求报文存在语法错误                    |
| 401  |                     发送的请求需要认证                     |
| 403  |                         服务被拒绝                         |
| 404  |                          notfound                          |
| 500  |                       服务器内部错误                       |
| 503  |                        服务器维护中                        |
| 1xx  |                          指示信息                          |

### 缺点

- 名文传输的不安全性
- 性能不能符合广大人民的需要

# HTTP历史版本

- 最早到http0.9，只有get和纯文本内容
- http1.0
  - 任意数据类型
  - GET、POST、HEAD
  - 无法复用TCP连接(长连)
- http1.1
  - 引入更多请求方法，put、patch、delete、options、trace、connect
  - 引入长连接，就是请求头connect:keep-alive
  - 丰富的请求响应头信息。以header中的Last-Modified/If-Modified-Since和Expires作为缓存标识
  - 强化缓存管理和控制支持分块传输，利用请求头Range实现
  - 使用虚拟网络，一台服务器多个虚拟机共享IP
  - 队头阻塞：顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据。
  - 无状态特性，导致HTTP头部特别大
  - 全部明文传输
- http2
  - 使用新的二进制协议而不是纯文本，避免文本歧义还减小了体积
  - 多路复用，同域名下所有通信都是在单链接(双向数据流)完成，提高连接的复用率，在拥塞控制方面有更好的能力提升 
  - 允许服务器主动推送数据给客户端（你以后要我提前给，serverpush）
  - 增加了安全性，至少TLS1.2
  - 使用虚拟的流传输消息，解决了应用层的队头阻塞问题（没有彻底解决）
- http3或QUIC
  - 在传输层直接干掉TCP，用UDP替代
  - 实现了一套新的`拥塞控制算法`，彻底解决TCP中队头阻塞的问题
  - 实现了类似TCP的`流量控制`、传输可靠性的功能。虽然UDP不提供可靠性的传输，但QUIC在UDP的基础之上增加了一层来保证数据可靠性传输。它提供了数据包重传、拥塞控制以及其他一些TCP中存在的特性
  - 实现了`快速握手`功能。由于QUIC是基于UDP的，所以QUIC可以实现使用0-RTT或者1-RTT来建立连接，这意味着QUIC可以用最快的速度来发送和接收数据。
  - 集成了TLS加密功能。目前QUIC使用的是TLS1.3

# HTTPS

超文本传输安全协议，在应用层http和传输层tcp之间有安全层SSL/TLS

### SSL/TLS

- TLS是SSL的升级版，SSL3升级以后就是TLS，目前TLS1.1及之前版本都已经弃用
- B与S通信之前会先协商，选出它们都支持的加密套件，用来实现安全的通信。
- 随便拿出一个加密套件举例，如：RSA-PSK-AES128-GCM-SHA256
  - RSA是握手时用来交换密钥的算法
  - PSK是签名用的算法
  - AES128-GCM表示使用AES256对称加密算法通信，密钥长度128，分组模式GCM。
  - SHA256是用来验证信息完整性并生成随机数的算法。 

### 对称加密

- 加密和解密使用同一个密钥
- 浏览器发送给服务器client-random和支持的加密方法列表
- 服务器返回另一个server-random和支持的方法列表
- 然后两者用加密方法将两个随机数混合生成密钥，这就是通信双上加解密的密钥

### 非对称加密

-  就是一对密钥，有`公钥`(public key)和`私钥`(private key)，其中一个密钥加密后的数据，只能让另一个密钥进行解密。
- 浏览器发送给服务器client-random和支持的加密方法列表
- 服务器把另一个随机数、加密方法、公钥传给浏览器
- 浏览器用公钥把两个随机数加密生成密钥，这个密钥只能用私钥解密

### TLS

TLS实际用的是两种算法的混合加密。通过非对称加密算法交换对称加密算法的密钥，交换完成后，再使用对称加密进行加解密传输数据。这样就保证了会话的机密性。过程如下

1. 浏览器给服务器发送一个随机数`client-random`和一个支持的加密方法列表
2. 服务器把另一个随机数`server-random`、`加密方法`、`公钥`传给浏览器
3. 浏览器又生成另一个随机数`pre-random`，并用公钥加密后传给服务器
4. 服务器再用私钥解密，得到`pre-random`
5. 浏览器和服务器都将三个随机数用加密方法混合生成最终密钥

### 防止中间人伪装

- 数字签名！需要向有权威的CA机构获取授权，服务器和CA分别由一对密钥，CA通过摘要算法生成服务器公钥的摘要，然后通过特定算法加密摘要生成签名，最后把签名和服务器公钥打包放到数字证书里返回给服务器。
- 浏览器负责验证证书，获得摘要内容，再用摘要算法对证书里的服务器公钥生成摘要，再把这个摘要和上一步得到的摘要对比，如果一致说明证书合法，里面的公钥也是正确的，否则就是非法的 

### 优缺点

- 优点
  - 内容加密
  - 身份验证
  - 数据完整
- 缺点
  - 要钱
  - 证书绑定IP，不能在同一个IP上绑定多个域名
  - 加密解密消耗计算资源
  - 连接更加耗时
- 与http对比
  - 加密传输
  - 80端口变443端口
  - 连接次数和方式不同，TLS握手6~7次
  - 有状态

# TCPIP/UDP

- TCP/IP即传输控制/网络协议，是面向连接的协议，发送数据前要先建立连接(发送方和接收方的成对的两个之间必须建 立连接)，TCP提供可靠的服务，也就是说，通过TCP连接传输的数据不会丢失，没有重复，并且按顺序到达

- UDP它是属于TCP/IP协议族中的一种。是无连接的协议，发送数据前不需要建立连接，是没有可靠性的协议。因为不需要建立连接所以可以在在网络上以任何可能的路径传输，因此能否到达目的地，到达目的地的时间以及内容的正确性都是不能被保证的。

### 区别TCP与UDP

- TCP先连接在发送，服务可靠不会丢失重复，UDP无连接，不可靠
- TCP只能点对点，UDP可以121，n2n，12n，n21（2->to）
- TCP是面向字节流的，UDP是面向报文的，也就是说TCP可分片，UDP只能一次送完
- TCP主要用在网站、邮件上，UDP则是RPC、game等
- TCP比UDP更适合局域网，UDP更适合广域网
- TCP上的协议
  - http、https
  - ftp
  - pop3收邮件、smtp发又见
  - ssh
- udp上
  - bootp应用于无盘设备
  - ntp网络同步
  - dhcp动态ip
- 都可以
  - dns
  - arp
  - dhcp

# 鉴权问题

### cookie

- HTTP是无状态的，每个请求完全独立，服务器为了知道是谁在访问以及对话的跟踪，只能主动维护状态

- cookie生成在服务端，存储在客户端，他会在浏览器发送请求时带给服务器

- cookie不可跨域，每个 cookie 都会绑定单一的域名，无法在别的域名下获取使用，一级域名和二级域名之间是允许共享使用的

- 单个cookie数据不能大于4k

- cookie属性

  | attribute  |                           content                            |
  | :--------: | :----------------------------------------------------------: |
  | name=value |       键值对，设置cookie名称及其对应值，都是字符串类型       |
  |   domain   |                       cookie所属的域名                       |
  |    path    | 指定cookie在那个路径，默认'/'，只有路径及其子路径可以访问这个cookie |
  |   maxAge   | cookie 失效的时间，单位秒，设置有效时长。如果为整数，则该 cookie 在 maxAge 秒后失效。如果为负数，该 cookie 为临时 cookie ，关闭浏览器即失效，浏览器也不会以任何形式保存该 cookie 。如果为 0，表示删除该 cookie 。默认为 -1。 |
  |  expires   |                   过期时间，设置过期时间点                   |
  |   secure   | 该 cookie 是否仅被使用安全协议传输。安全协议有 HTTPS，SSL等，在网络上传输数据之前先将数据加密。默认为false。 |
  |  httpOnly  | 设置了 httpOnly 属性，则无法通过 JS 脚本 读取到该 cookie 的信息（但是可以在控制台改） |

### session

- session基于cookie，但是session存储在服务端，客户端只存储sessionID
- 每次请求服务端在cookie里读取sessionID并进行判断
- session比cookie安全，且因为存储在服务端，可以是任意自定义类型，但是session一般失效时间短，客户端关闭或者 Session 超时都会失效。 
- session可存储数据远高于cookie，但是访问量过多时会占用服务器内存

### Access token

- 访问资源接口所需的资源凭证
- 简单的token组成：uid（账号密码）+time（时间戳）+sign（token前几位以哈希算法压缩成的一定长度的十六进制字符串 ）
- 特点
  - 服务端无状态，可扩展
  - 支持移动设备
  - 安全
  - 支持跨程序
- 工作方式
  - 客户端发送账号密码
  - 服务端验证
  - 验证成功，给一个token
  - 服务端保存到cookie或localStorage等地方
  - 此后每次发送都给一个token用来验证
- 为什么服务端不需要存放token？因为token是通过解析辨别真伪的
- 与session相比，token实现服务端无状态化，不需要存储信息。但是如果要实现一些有状态的会话，仍可以增加session来保存状态。

### refresh token

- refresh token 是专用于刷新 access token 的 token。如果没有 refresh token，也可以刷新 access token，但每次刷新都要用户输入登录用户名与密码，会很麻烦。有了 refresh token，可以减少这个麻烦，客户端直接用 refresh token 去更新 access token，无需用户进行额外的操作。
- Access Token 的有效期比较短，当 Acesss Token 由于过期而失效时，使用 Refresh Token 就可以获取到新的 Token，如果 Refresh Token 也失效了，用户就只能重新登录了。



# 其他常见问题

### get和post

- get在浏览器回退时是无害的，而post则会再次发送
- get会被浏览器主动缓存，post在不设置时不会
- get在url传递有长度限制，post没有
- get参数通过url传递，而post放在请求体中
- get只能进行url编码，而post支持多种编码方式
- get只能接收ascii字符参数，post无限制
- GET产生一个TCP数据包（header+data），POST产生两个TCP数据包（先发header，再发data除非是firefox浏览器）。

### URL输入后发生了什么

- 域名解析
  - DNS域名解析分为递归查询和迭代查询两种方式，现一般为迭代查询。
  - 即先读本地缓存，没有向上寻找，顺序是根域名服务器->.xxx(域名最后的.com\\.cn...)->xxx.xxx.com域名服务器，注意为什么是这个顺序，网址从右向左依次缩小范围。
  - DNS还存在一些优化，比如DNS缓存（ 浏览器缓存，系统缓存，路由器缓存，IPS服务器缓存，根域名服务器缓存，顶级域名服务器缓存，主域名服务器缓存 ），DNS负载均衡（ 在DNS服务器中为同一个主机名配置多个IP地址，在应答DNS查询时， DNS服务器对每个查询将以DNS文件中主机记录的IP地址按顺序返回不同的解析结果，将客户端的访问 引导到不同的机器上去，使得不同的客户端访问不同的服务器，从而达到负载均衡的目的。）CDN（ DNS服务器会返回一个跟用户最接近的点的IP地址给用户 ）dns-prefetch（ 浏览网页时，浏览器会在加载网页时对网页中的域名进行解析缓存）
- 三握
  - C发SYN=1，Seq=x，确保客户端可发送
  - S发SYN=1，ACK=x+1，Seq=y，确保服务器可发可接
  - C发ACK=Y+1，Seq=Z，确保客户端可接
- 浏览器渲染，不说了
- 四挥
  - 发起方向被动方发送报文，Fin、Ack、Seq，表示已经没有数据传输了。并进入 FIN_WAIT_1 状态。 （要睡了）
  - 被动方发送报文，Ack、Seq，表示同意关闭请求。此时主机发起方进入 FIN_WAIT_2 状态。 （好）
  - 被动方向发起方发送报文段，Fin、Ack、Seq，请求关闭连接。并进入 LAST_ACK 状态。（睡了没）
  - 发起方向被动方发送报文段，Ack、Seq。然后进入等待 TIME_WAIT 状态。被动方收到发起方的报文段以后关闭连接。发起方等待一定时间未收到回复，则正常关闭（嗯嗯）。   

### 协商缓存与强缓存

- 强缓存：浏览器不会像服务器发送任何请求，直接从本地缓存中读取文件并返回Status Code: 200 OK，在请求的控制台会说200(from memory|disk cache)
- 协商缓存: 也叫对比缓存，向服务器发送请求，服务器会根据这个请求的request header的一些参数来判断是否命中协商缓存，如果命中，则返回304状态码并带上新的response header通知浏览器从缓存中读取资源。
- 相关请求头
  - 强缓存
    - expires：过期时间，如果设置了时间，则浏览器会在设置的时间内直接读取缓存，不再请求 
    - cache-control：当值设为Cache-Control:max-age=300时，则代表在这个请求正确返回时间（浏览器也会记录下来）的5分钟内再次加载资源，就会命中强缓存。 
    - cache-Control:private内容只缓存到私有缓存中,代理服务器不可缓存 public相反
    - Cache-Control:no-store：禁止一切缓存
    - Cache-Control:no-cache：强制客户端直接向服务器发送请求，但这个不是不缓存，而是每次都跟服务器确认是否更新。
  - 协商缓存
    - **Etag/If-None-Match**：Etag用来帮助服务器控制web端的缓存验证，默认是文件的INode，大小，最后修改时间的hash。if-none-match，当资源变化时，浏览器发现响应头里有Etag，则再次像服务器请求时带上请求头if-none-match(值是Etag的值)。服务器收到请求进行比对，决定返回200或304 （有变化返回200，否则304）
    - **Last-Modifed/If-Modified-Since**：Last-Modified，浏览器向服务器发送资源最后的修改时间。 If-Modified-Since：当浏览器判断Cache-Control标识的max-age过期，发现响应头具有Last-Modified声明，则再次向服务器请求时带上头if-modified-since，表示请求时间。服务器收到请求后发现有if-modified-since则与被请求资源的最后修改时间进行对比（Last-Modified）,若最后修改时间较新（大），说明资源被改过，则返回最新资源，HTTP 200 OK;若最后修改时间较旧（小），说明资源无新修改，响应HTTP 304 走缓存。
    - etag优先级高于Last-Modifed，且时间精度更高（Last-Modifed是秒级的）
    - Etag和Last-Modifed都是服务器返回给浏览器的

### 再谈跨域问题

- 在浏览器一节已经说过jsonp、代理服务器和CORS的解决方案

- 这一次把目光聚焦到iframe和跨窗口上

- postMessage是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题

  - 页面和其打开的新窗口的数据传递
  - 多窗口之间消息传递
  - 页面与嵌套的iframe消息传递
  - 上面三个场景的跨域数据传递

- ```javascript
  //主窗口
  <iframe src="http://localhost:4000/b.html" frameborder="0" id="frame" onload="load()"></iframe> //等它加载完触发一个事件
    //内嵌在http://localhost:3000/a.html
      <script>
        function load() {
          let frame = document.getElementById('frame')
          frame.contentWindow.postMessage('我爱你', 'http://localhost:4000') //发送数据
          window.onmessage = function(e) { //接受返回数据
            console.log(e.data) //我不爱你
          }
        }
  </script>
  
  //内嵌窗口
  window.onmessage = function(e) {
      console.log(e.data) //我爱你
      e.source.postMessage('我不爱你', e.origin)
  }
  ```

- window.name+iframe

  -  name值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。 

  - 设置中间代理页，通过设置name并传递给下一个需要的页面

  - ```javascript
    <iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe>
      <script>
        let first = true
        // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
        function load() {
          if(first){
          // 第1次onload(跨域页)成功后，切换到同域代理页面
            let iframe = document.getElementById('iframe');
            iframe.src = 'http://localhost:3000/b.html';
            first = false;
          }else{
          // 第2次onload(同域b.html页)成功后，读取同域window.name中数据
            console.log(iframe.contentWindow.name);
          }
        }
    </script>
    
    //代理页
    <script>
        window.name = '我不爱你'  
    </script>
    ```

- location.hash，子页面可以设置父页面的，也就是url里面#后边的东西，通过设置这个实现两个iframe的交流

- document.domain，通过js强制设置主域名，比如a.test.com和b.test.com，都设置成 document.domain ='test.com' ，这样二者就是同域了。