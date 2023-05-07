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
- 物理层

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
    - Access-Control-Allow-Credentials响应报头指示的请求的响应是否可以暴露于该页面。当`true`值返回时它可以被暴露。
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
    - Accept-Encoding: gzip. deflate, br
- 正文(entity)，也就是请求体，千奇百怪

### 状态码

| code |                           content                            |
| :--: | :----------------------------------------------------------: |
| 200  |                           成功响应                           |
| 201  |                         创建资源成功                         |
| 204  |                    成功，但是没有资源返回                    |
| 206  |  对资源某一部分进行响应，由Content-Range 指定范围的实体内容  |
| 301  | 永久重定向（浏览器默认缓存，如果是post会变成get，308弥补了这个问题） |
| 302  |     临时重定向（如果是post会变成get，307弥补了这个问题）     |
| 400  |                     请求报文存在语法错误                     |
| 401  |                      发送的请求需要认证                      |
| 403  |                          服务被拒绝                          |
| 404  |                           notfound                           |
| 405  |                         不允许的方法                         |
| 500  |                        服务器内部错误                        |
| 501  |       服务器：对不起做不到（不支持的方法或者内容协商）       |
| 502  |                            超时了                            |
| 503  |                         服务器维护中                         |
| 100  |                         好，继续发送                         |
| 101  |                           切换协议                           |
| 103  | server push，服务器在处理主资源的同时向浏览器发送一些关键子资源或页面可能使用的其他来源的提示，让浏览器提前加载这些资源（http2、3） |

### 缺点

- 明文传输的不安全性
- 性能不能符合广大人民的需要

# HTTP历史版本

- 最早到http0.9，只有get和纯文本内容
- http1.0
  - 任意数据类型
  - GET、POST、HEAD
  - 无法复用TCP连接(长连)
- http1.1
  - 引入更多请求方法，put、patch、delete、options、trace、connect
  - 引入长连接，就是请求头connect:keep-alive，建立SOCKET连接后不管是否使用都保持连接，但安全性较差。 如果长时间不关闭会浪费服务端资源。
  - 并行的请求限制在6~8个
  - 丰富的请求响应头信息。以header中的Last-Modified/If-Modified-Since和Expires作为缓存标识
  - 强化缓存管理和控制支持分块传输，利用请求头Range实现
  - 使用虚拟网络，一台服务器多个虚拟机共享IP
  - 队头阻塞：顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据。
  - 无状态特性，导致HTTP头部特别大
  - 全部明文传输
  - 对一个域名下最大TCP连接数为6
- http2
  - 使用新的二进制协议而不是纯文本，避免文本歧义还减小了体积
  - 头部压缩，收发双方都有缓存。
  - 多路复用，可以在一个TCP连接中发送多个HTTP请求。 同域名下所有通信都是在单链接(双向数据流)完成，提高连接的复用率，在拥塞控制方面有更好的能力提升。
  - 允许服务器主动推送数据给客户端（你以后要我提前给，serverpush）
  - 增加了安全性，至少TLS1.2
  - 使用虚拟的流传输消息，解决了应用层的队头阻塞问题（没有彻底解决）
- http3或QUIC
  - 在传输层直接干掉TCP，用UDP替代
  - 实现了一套新的`拥塞控制算法`，彻底解决TCP中队头阻塞的问题
  - 实现了类似TCP的`流量控制`、传输可靠性的功能。虽然UDP不提供可靠性的传输，但QUIC在UDP的基础之上增加了一层来保证数据可靠性传输。它提供了数据包重传、拥塞控制以及其他一些TCP中存在的特性
  - 实现了`快速握手`功能。由于QUIC是基于UDP的，所以QUIC可以实现使用0-RTT或者1-RTT（TLS和TPC的连接一起）来建立连接，这意味着QUIC可以用最快的速度来发送和接收数据。
  - 集成了TLS加密功能。目前QUIC使用的是TLS1.3
  - QUIC(quick udp Internet Connect):数据-拆>quic流-组>quic帧-封>quic包

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
- 服务器返回另一个server-random和加密方法
- 然后两者用加密方法将两个随机数混合生成密钥，这就是通信双上加解密的密钥

### 非对称加密

-  就是一对密钥，有`公钥`(public key)和`私钥`(private key)，其中一个密钥加密后的数据，只能让另一个密钥进行解密。
- 浏览器发送给服务器client-random和支持的加密方法列表
- 服务器把另一个随机数、加密方法、公钥传给浏览器
- 浏览器用公钥把两个随机数加密生成密钥，这个密钥只能用私钥解密

### TLS

TLS实际用的是两种算法的混合加密。通过非对称加密算法交换对称加密算法的密钥，交换完成后，再使用**对称加密**进行加解密传输数据。这样就保证了会话的机密性。过程如下

1. 浏览器给服务器发送一个随机数`client-random`和一个支持的加密方法列表
2. 服务器把另一个随机数`server-random`、`加密方法或者说数字证书`、`公钥`传给浏览器
3. 浏览器确认证书有效，生成另一个随机数`pre-random`，并用公钥（通过解析证书）加密后传给服务器
4. 服务器再用私钥解密，得到`pre-random`
5. 浏览器和服务器都将三个随机数用加密方法混合生成最终密钥

### 防止中间人伪装

- 数字签名！需要向有权威的CA机构获取授权，服务器和CA分别有一对密钥，CA把包含公钥等信息打包并哈希最后用CA私钥加密，生成签名，并且附加到证书上。
- 浏览器负责验证证书，注意证书的信息二者都是拥有的，那么浏览器也可以哈希证书得到HASH A，同时对附加到签名用CA公钥解密生成摘要B，A==B则没有问题。

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
  - pop3收邮件、smtp发邮件
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

- set-Cookie(响应头)属性

  |                           content                            | attribute  |
  | :----------------------------------------------------------: | :--------: |
  |       键值对，设置cookie名称及其对应值，都是字符串类型       | name=value |
  |                       cookie所属的域名                       |   domain   |
  | 指定cookie在那个路径，默认'/'，只有路径及其子路径可以访问这个cookie |    path    |
  | cookie 失效的时间，单位秒，设置有效时长。如果为整数，则该 cookie 在 maxAge 秒后失效。如果为负数，该 cookie 为临时 cookie ，关闭浏览器即失效，浏览器也不会以任何形式保存该 cookie 。如果为 0，表示删除该 cookie 。默认为 -1。 |   maxAge   |
  |                   过期时间，设置过期时间点                   |  expires   |
  | 该cookie是否仅被使用安全协议传输。安全协议有 HTTPS，SSL等，在网络上传输数据之前先将数据加密。默认为false。 |   secure   |
  | 设置了 httpOnly 属性，则无法通过 JS 脚本 读取到该 cookie 的信息（但是可以在控制台改） |  httpOnly  |
  | Strict，其他网站请求不许包含cookie，Lax仅仅post表单请求不许包含 |  Samesite  |

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
  - 客户端保存到cookie或localStorage等地方
  - 此后每次发送都给一个token用来验证
- 为什么服务端不需要存放token？因为token是通过解析辨别真伪的，服务端只是保存了一个密钥用来解密token(私钥)
- 与session相比，token实现服务端无状态化，不需要存储信息。但是如果要实现一些有状态的会话，仍可以增加session来保存状态。
- JWT算是一种实现，黑客就算获取到凭证，修改payload会改变signature无法识别（signature依赖于此），而且黑客没法生成签名。

### refresh token

- refresh token是专用于刷新 access token 的 token。如果没有 refresh token，也可以刷新 access token，但每次刷新都要用户输入登录用户名与密码，会很麻烦。有了 refresh token，可以减少这个麻烦，客户端直接用 refresh token 去更新 access token，无需用户进行额外的操作。
- Access Token 的有效期比较短，当 Acesss Token 由于过期而失效时，使用 Refresh Token 就可以获取到新的 Token，如果 Refresh Token 也失效了，用户就只能重新登录了。

### 第三方平台OSS

# 其他常见问题

### get和post

- get在浏览器回退时是无害的，而post则会再次发送（浏览器行为，重新发送表单）
- get会被浏览器主动缓存，post在不设置时不会
- get在url传递有长度限制（一般2k），post没有
- get参数通过url传递，而post放在请求体中
- get只能进行url编码，而post支持多种编码方式
- get只能接收ascii字符参数，post无限制
- GET产生一个TCP数据包（header+data），POST产生两个TCP数据包（先发header，得到100状态码以后发body，再发data除非是firefox浏览器）。

### 请求方法

| method  |                           meaning                            |
| :-----: | :----------------------------------------------------------: |
|   get   |                             获取                             |
|  post   |                       增加，也可以修改                       |
|   put   |                          上传或修改                          |
| delete  |                             删除                             |
|  head   |        获取header，不返回报文主体，除此之外和get一样         |
| options | 获取服务器支持的所有HTTP请求方法(返回的响应头中的allow字段)、嗅探请求以判断是否有对指定资源的访问权限。 |
| connect |   要求在与代理服务器通信时建立隧道，使用隧道进行TCP通信；    |
|  trace  |          回显服务器收到的请求，主要⽤于测试或诊断。          |

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
- 内容重要并且更新频繁，所以适合协商缓存，但对于并发量大的页面，也可以使用有效期较短的强缓存；而js、css和图片等静态文件，一般变更少，而且内容更新后可以重新命名文件进行刷新，适合强缓存。 
- 相关请求头
  - 强缓存
    - expires(http1.0)：过期时间点，如果设置了时间，则浏览器会在设置的时间内直接读取缓存，不再请求，修改本地时间可能导致缓存失败 
    - cache-control(http1.1)：当值设为Cache-Control:max-age=300时，则代表在这个请求正确返回时间（浏览器也会记录下来）的5分钟内再次加载资源，就会命中强缓存。s-maxage:代理服务器缓存时间长度 
    - Cache-Control:private内容只缓存到私有缓存中,代理服务器不可缓存，而public则相反
    - Cache-Control:no-store：禁止一切缓存（包括协商缓存）
    - Cache-Control:no-cache：强制客户端直接向服务器发送请求，但这个不是不缓存，而是每次都跟服务器确认是否更新。
  - 协商缓存
    - **Etag/If-None-Match**：Etag用来帮助服务器控制web端的缓存验证，默认是文件的INode，大小，最后修改时间的hash。if-none-match，当资源变化时，浏览器发现响应头里有Etag，则再次像服务器请求时带上请求头if-none-match(值是Etag的值)。服务器收到请求进行比对，决定返回200或304 （有变化返回200，否则304）
    - **Last-Modifed/If-Modified-Since**：Last-Modified，浏览器向服务器发送资源最后的修改时间。 If-Modified-Since：当浏览器判断Cache-Control标识的max-age过期，发现响应头具有Last-Modified声明，则再次向服务器请求时带上头if-modified-since，表示请求时间。服务器收到请求后发现有if-modified-since则与被请求资源的最后修改时间进行对比（Last-Modified）,若最后修改时间较新（大），说明资源被改过，则返回最新资源，HTTP 200 OK;若最后修改时间较旧（小），说明资源无新修改，响应HTTP 304 走缓存。
    - etag优先级高于Last-Modifed，且时间精度更高（Last-Modifed是秒级的）
    - Etag和Last-Modifed都是服务器返回给浏览器的，也就是先（带着 if-modified-since或if-none-match）请求，然后服务器比对，再决定200|304，200就会替换原来的请求字段
  - 优先级：CacheControl > Expires > ETag > Last-Modified 
  - 如果添加冗余query可以强制绕过缓存

### 再谈跨域问题

- 在浏览器一节已经说过jsonp、代理服务器和CORS的解决方案

- 这一次把目光聚焦到iframe和跨窗口上

- postMessage是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题

  - 页面和其打开的新窗口的数据传递
  - 多窗口之间消息传递
  - 页面与嵌套的iframe消息传递
  - 上面三个场景的跨域数据传递

- ```html
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

  - ```html
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

### TCP队头拥塞

- TCP的队头阻塞 
  - 当一个分组传输失败，导致接收端收到乱序的分组时，接收端将发送缺失包的重复请求(其实是缺失包上一个包的确认包)
  -  这时，发送端就必须将缺失包发送给接收端，并接收到确认才能发送接下来的分组，这段重发造成的阻塞，使得后面的分组必须等待，就是队头阻塞
- HTTP1.1中的队头阻塞 
  - HTTP1.1允许在一个TCP连接中，发送多个HTTP请求，但请求的响应顺序必须与请求的发送顺序一致，这是因为请求跟响应并没有序号标识。
  - 因此，当先发出的请求，迟迟未响应时，导致后面的响应必须要等待其响应，这段等待时间造成的阻塞，称为队头阻塞
- HTTP2如何消除队头阻塞 
  - HTTP2不使用管道化的方式，而是引入了帧、消息和数据流等概念，每个请求/响应被称为消息，每个消息都被拆分成若干个帧进行传输，每个帧都分配一个序号。每个帧在传输是属于一个数据流，而一个连接上可以存在多个流，各个帧在流和连接上独立传输，到达之后在组装成消息，这样就避免了请求/响应阻塞。
  - 但由于HTTP2底层使用的是TCP协议，因此仍可能出现TCP队头阻塞。

### SSO、CAS

SSO 是英文 Single Sign On 的缩写，翻译过来就是单点登录。顾名思义，它把两个及以上个产品中的用户登录逻辑抽离出来，达到只输入一次用户名密码，就能同时登录多个产品的效果。 

- 提升用户体验。
- 避免重复开发

- 提升安全系数

SSO 仅仅是一种架构，一种设计，而 CAS 则是实现 SSO 的一种手段。 

#### 实现

- 同域sso 两个产品都是在一个域名下，单点登录是很自然的选择。 cookie本来是统一的，所以非常简单地实现了SSO
- 同父域名，服务器在返回 cookie 的时候，要把cookie 的 domain 设置为其父域。 这下又同域了。比如两个产品的地址分别为 a.xy.cn 和 b.xy.cn，那么 cookie 的域设置为 xy.cn 即可。 
- 跨域CAS

#### CAS

- Client：用户。
- Server：中心服务器，也是 SSO 中负责单点登录的服务器。
- Service：需要使用单点登录的各个服务，相当于上文中的产品 a/b。

过程

- 用户首次访问产品 a，域名是 www.a.cn。
- 由于用户没有携带在 a 服务器上登录的 a cookie，所以 a 服务器返回 http 重定向，重定向的 url 是 SSO 服务器的地址，同时 url 的 query 中通过参数指明登录成功后，回跳到 a 页面。重定向的url 形如 sso.dxy.cn/login?service=https://www.a.cn。
- 由于用户没有携带在 SSO 服务器上登录的 **TGC**（服务器生成TGT放入自己的 Session 中，而 TGC 就是这个 Session 的唯一标识，以 Cookie 形式放到浏览器端，是 CAS Server 用来明确用户身份的凭证。），所以 SSO 服务器判断用户未登录，给用户显示统一登录界面。用户在 SSO 的页面上进行登录操作。
- 登录成功后，SSO 服务器构建用户在 SSO 登录的 **TGT**（CAS 为用户签发的登录票据，拥有了 TGT，用户就可以证明自己在 CAS 成功登录过。TGT 封装了 Cookie 值以及此 Cookie 值对应的用户信息。），同时返回一个 http 重定向。这里注意：
  - 重定向地址为之前写在 query 里的 a 页面。
  - 重定向地址的 query 中包含 sso 服务器派发的 **ST**。（ CAS 发现用户有 TGT，则签发一个 ST，返回给用户。 用户用ST访问资源）
  - 重定向的 http response 中包含写 cookie 的 header。这个 cookie 代表用户在 SSO 中的登录状态，它的值就是 **TGC**。

- 浏览器重定向到产品 a。此时重定向的 url 中携带着 SSO 服务器生成的 **ST**。

- 根据 **ST**，a 服务器向 SSO 服务器发送请求，SSO 服务器验证票据的有效性。验证成功后，a 服务器知道用户已经在 sso 登录了，于是 a 服务器构建用户登录 session，记为 a session。并将 cookie 写入浏览器。注意，此处的 cookie 和 session 保存的是用户在 a 服务器的登录状态，和 CAS 无关。
- 之后用户访问产品 b，域名是 www.b.cn。

- 由于用户没有携带在 b 服务器上登录的 b cookie，所以 b 服务器返回 http 重定向，重定向的 url 是 SSO 服务器的地址，去询问用户在 SSO 中的登录状态。
- 浏览器重定向到 SSO。注意，第 4 步中已经向浏览器写入了携带 **TGC** 的cookie，所以此时 SSO 服务器可以拿到，根据 **TGC** 去查找 **TGT**，如果找到，就判断用户已经在 sso 登录过了。
- SSO 服务器返回一个重定向，重定向携带 **ST**。注意，这里的 ST 和第4步中的 ST 是不一样的，事实上，每次生成的 ST 都是不一样的。
- 浏览器带 **ST** 重定向到 b 服务器，和第 5 步一样。
- b 服务器根据票据向 SSO 服务器发送请求，票据验证通过后，b 服务器知道用户已经在 sso 登录了，于是生成 b session，向浏览器写入 b cookie。
- 注意，TGT就类似session，放在CASserver里，凭借TGC获取。TGT用来签发ST

### 轮询和WS

#### 长轮询

设置xhr.timeout为一个比较大的数，长轮询选择尽可能长的时间保持和客户端连接打开，仅在数据变得可用或达到超时阙值后才提供响应（当然也可以让前端因为timeout502导致error时直接再发一个），而不是在给到客户端的新数据可用之前，让每个客户端多次发起重复的请求。 

```javascript
async function subscribe() {
  let response = await fetch("/subscribe");

  if (response.status == 502) {
    // 状态 502 是连接超时错误，
    // 让我们重新连接
    await subscribe();
  } else if (response.status != 200) {
    // 一秒后重新连接
    await new Promise(resolve => setTimeout(resolve, 1000));
    await subscribe();
  } else {
    // 获取并显示消息
    let message = await response.text();
    await subscribe();
  }
}

subscribe();
```

#### WS 

WebSockets是一个构建在设备TCP/IP协议栈之上的传输层。其目的是向 Web 开发人员提供本质上尽可能接近原始的 TCP 通信层，同时添加一些抽象概念，以消除 Web 工作中存在的一些阻力。 

原生的JS内容

```java
var ws = new WebSocket(url);
ws.onopen = function(event) {
  console.log("WebSocket is open now.");
};
ws.onclose = function(event) {
  console.log("WebSocket is closed now.");
};
ws.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    ws.send("other message")
});
ws.addEventListener('error', function (event) {
  console.log('WebSocket error: ', event);
});
ws.send("Hello server!");
ws.readyState//0 connencting,1 open,2 closing,3 closed
```

##### socket.io框架

这玩意类似触发器，前后端要约定好事件用来emit（发）和on（接）

而且后端要记住用户的链接

客户端

```html
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

node服务端

```javascript
const app = http.createServer();
const io = require('socket.io')(app);
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

### 共享cookie

- 后端设置Secure是None
- 前端设置域名为共享的一级域名
  - window.location.host='xxx'
  - window.document.cookie=\`${name}=${value};domain=${host}`
-  在跨域的情况下，默认是不会携带请求域下的`cookie` 的，比如`http://domain-a.com` 站点发送一个 `http://api.domain-b.com/get` 的请求，默认是不会携带 `api.domain-b.com` 域下的 `cookie`。
  - 前端请求时在`request`对象中配置`"withCredentials": true`；
  - 服务端在`response`的`header`中配置`"Access-Control-Allow-Origin":"前端地址，不能为*"`;
  - 服务端在`response`的`header`中配置`"Access-Control-Allow-Credentials", "true"`

### HTTPS连接过程

共12个过程

- C->S，发送Client Hello,包含客户端支持的SSL的指定版本、加密组件列表（还有第一个随机数）
- S->C，发送Server Hello,包含SSL版本以及加密组件。服务器的加密组件内容是从客户端加密组件内筛选出来的。
- S->C，发送证书，里面有公钥（第一二个随机数混合公钥）
- S->C，发送Server Hello Done，告诉客户端握手协商部分结束。
- C->S，以Client Key Exchange报文作为回应。包含被称为Pre-master secret的随机密码串，该报文用刚才的公钥进行加密（第三个随机数）。
- C->S，发送Change Cipher Spec报文，提示服务器，在此报文之后的通信会采用Pre-master secret密匙加密。（生成的对称加密的公钥）
- C->S，发送Finished报文，包含连接至今全部报文的整体校验值。 
- S->C，发送Change Cipher Spec报文
- S->C，Finished报文
- 接下来SSL连接就算建立完成。当然，通信会收到SSL的保护。从此处开始进行应用层协议的通信，即发送HTTP请求。
- 应用层协议通信，即发送HTTP相应。  
- 最后由客户端断开连接。断开连接时，发送close_notify报文。

### content-type

 Content-Type：type/subtype ;parameter 

- type：主类型，任意的字符串，如text
- subtype：子类型，任意的字符串，如html，如果是*号代表所有
- parameter：可选参数，如charset，boundary等。
- 常见类型
  - text/html
  - image/gif,jpeg,png...
  - application/javascript
  - application/json
  - application/xml
  - application/x-www-form-urlencode，表单默认
  - multipart/form-data,用来传带文件的formdata

### 细说206

当客户端指定 `Range` 范围请求头时，服务器端将会返回部分资源，即 `Partial Content`，此时状态码为 206。

当请求音视频资源体积过大时，一般使用 `206` 较多。

比如b站的视频，分段请求和返回。

range: bytes=1-20客户端

content-range: bytes 1-20/33229服务端 

Content-Length: 917618服务端

### CDN

内容分发网络:类似物流建立的区域仓库、前置仓库，用户下单后优先在最近的仓库配货，极限情况下几小时就可以送到用户手里，用户体验好、物流压力小。 

- 就是放在应用服务器与用户之间的一层缓存。所以如果使用DNS的时候，返回给客户端的是CDN机器的IP而不是应用的IP，那么自然就走到了CDN机器上。

- 为了实现上述目的，我们会为该域名配置一个 `CNAME`，其实流程与DNS解析是一样的。当发现一个域名设置了CNAME时，DNS解析器会继续解析这个CNAME别名（其实就是另一个域名）。对这个CNAME解析的时候会用到全局负载DNS解析，它会根据访问者的地理位置信息返回对应的IP（CDN机器的IP）。因此客户端实际上得到的是距离它最近的CDN机器的IP地址。

- 如果说用户访问CDN，但是CDN上没有对应内容，CDN机器会根据自身专用的DNS解析服务，根据域名得到源站的IP，然后向源站发送请求获取数据，并把这些数据缓存到本地。

- CDN其实也是分层的。距离用户最近的称之为边缘节点。而CDN的中心服务器集群被称为二级缓存。在上面就是应用部署的源站。一般边缘节点没数据就去找二级缓存，二级缓存没数据就去找源站（被称为回源）。