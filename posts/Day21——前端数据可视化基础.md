---
title: "canvas和svg"
date: "2023-01-28"
---

# Canva(2d)

## 开始

在html里要有一个canvas

```html
<canvas id="canvas" width="200" height="200">当前浏览器不支持canvas元素，请升级或更换浏览器！</canvas>
```

获取canvas上下文

```javascript
var canvas = document.getElementById('canvas');
if(canvas.getContext) {
  var ctx = canvas.getContext('2d');
}
```

## 形状

### 直线

|     api     |          作用          |
| :---------: | :--------------------: |
| moveTo(x,y) |       提笔到某点       |
| lineTo(x,y) | 从当前落笔处画到目标处 |
|  stroke()   |  画完要调用，不然不画  |

### 矩形

|             api             |      作用      |
| :-------------------------: | :------------: |
|     strokeRect(x,y,w,h)     | 画一个线框矩形 |
|      fillRect(x,y,w,h)      | 画一个填充矩形 |
| clearRect(x,y,width,height) |  清除矩形区域  |

### 圆和椭圆

在此之前，要先看一下路径的开合

```javascript
ctx.beginPath()//开启路径
ctx.closePath()//闭合路径
ctx.stroke()//画线
ctx.fill()//根据路径填充
```

把画线和填充放这里，因为要注意，closePath和这两个api的顺序问题。closePath会把路线上的起始点闭合起来，如果之后stroke或fill会出现这条起始线。

```javascript
arc(x, y, radius, startAngle, endAngle, anticlockwise)
//角度使用弧度制，第五个参数默认为false，从顺时针方向
ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)
//椭圆
```

### 贝塞尔曲线

```javascript
ctx.quadraticCurveTo(cp1x, cp1y, x, y);
//cp1x,cp1y是控制的，(x,y)是终点，起点是画笔当前落点
ctx.bezierCurveTo(cp1x,cp1y, cp2x,cp2y, x, y)
//同上边那个二次曲线，这个是三次曲线
```

### path2D

可以认为是一个线条group，方法基本和ctx的线条方法一致

```javascript
ctx.arc(250, 250, 200, 0, Math.PI*2, false);
var path1 = new Path2D();
path1.rect(100, 100, 300, 300);
path1.addPath()
path1.closePath()
path1.arcTo()
```

## 样式属性

### 线条

- lineWidth线条粗细

- lineCap端点样式(butt无样式，round：原型的线头，square：方形线头，和butt不一样的是他会让线条长度和round一样)

- lineJoin两线段连接处所显示的样子(round：圆头, bevel：尖头削平，miter：尖头)

- miterLimit 限制当两条线相交时交接处最大长度，交接处长度是指线条交接处内角顶点到外角顶点的长度。 

- setLineDash(Array<number\>)\getLineDash()

  ```javascript
  ctx.setLineDash([10,20])
  ctx.getLineDash()//[10,20]
  ctx.setLineDash([10,20,30])
  ctx.getLineDash()//[10,20,30,10,20,30]
  //绘画顺序是实->虚->实，线长度无限延展getLineDash的结果
  ```

- lineDashOffset：虚线偏移

- strokeStyle：线条颜色

### 全局透明 globalAlpha(0~1)

### 渐变

```javascript
var gradient1 = ctx.createLinearGradient(10, 10, 400, 10);
gradient1.addColorStop(0, "#00ff00");
//第一个参数是颜色在渐变色条上的偏移值
gradient1.addColorStop(1, "#ff0000");
ctx.fillStyle = gradient1;
ctx.fillRect(10, 10, 400, 100);

ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)
//addColorStop(0, "#00ff00");和线性渐变一样
```

### 阴影

```javascript
ctx.shadowOffsetX=10
ctx.shadowOffsetX=10
ctx.shadowBlur=10
ctx.shadowColor="#66ccff"
```

### 图片样式

```javascript
var img = new Image();
  img.src = "./image.png";
  img.onload = function() {
    var ptrn = ctx.createPattern(img, 'no-repeat');
      //no-repeat,repeat,repeat-x,repeat-y 
    ctx.fillStyle = ptrn;
    ctx.fillRect(0, 0, 500, 500);
}
```

## 文本

### 样式设置

```javascript
ctx.font = "30px serif";
ctx.textAligh="start";//left、right、center、start和end。默认值是 start。
ctx.direction="ltr"//rtl，lrt，inherit
ctx.textBaseline="alphabetic"//文字垂直方向的对齐方式。可选值为：top、hanging、middle、alphabetic、ideographic和bottom。
```

### 描边

```javascript
ctx.strokeText("Canvas", 50, 50);
//str,x,y,maxWidth?,超过maxWidth就缩小字体
```

### 填充

```javascript
ctx.fillText("Canvas", 50, 50);
//str,x,y,maxWidth?,超过maxWidth就缩小字体
```

## 图片绘制

```javascript
img.src ='imgsrc'
img.onload = function(){
  ctx.drawImage(img, 0, 0);
  //在0，0处绘制图片
  ctx.drawImage(img, 0, 0,100,100);
  //在0，0处绘制一个缩放到100*100的图片
  ctx.drawImage(img, 20, 20,100,100,0,0,300,300);
  //在0，0处绘制一个缩放到300*300的原图片(20,20)处开始宽高都为100的图片
}
```

## 变形

### 状态

```javascript
ctx.save()//拍快照
ctx.restore()//返回上一个快照
//注意这个东西返回状态不会清空画布上画了的内容画布，只是返回了canvas的属性
```

### 变化

- 移动：translate(x, y) ，x 是左右偏移量，y 是上下偏移量。
- 旋转：rotate(angle)，angle是旋转的角度，它是顺时针旋转，以弧度为单位的值。旋转的中心是(0,0)
- 缩放：scale(x, y)，x 为水平缩放的值，y 为垂直缩放得值。x和y的值小于1则为缩小，大于1则为放大。默认值为 1。
- transform(a, b, c, d, e, f)方法能将当前的变形矩阵乘上一个基于自身参数的矩阵；
- setTransform(a, b, c, d, e, f)方法会将当前变形矩阵重置为单位矩阵，然后用相同的参数调用 transform 方法
- resetTransform()方法为重置当前变形为单位矩阵。效果等同于调用 setTransform(1, 0, 0, 1, 0, 0)

### 合成类型多，按需查找即可

```javascript
globalCompositeOperation = type
```

### 裁剪或遮罩

```javascript
ctx.arc(250, 250, 200, 0, Math.PI*2, false);
ctx.clip();
// 创建完后绘制
ctx.drawImage(img, 0, 0, 500, 500);
//圆形图片
```

# SVG

## 标签

### svg

- width、height

- viewBox：类似canvas的图片裁剪

  ```html
  <svg width="300" height="300" viewBox="0 0 100 100">
      <!--这样设置，会让0~100的正方形区域放大到300*300的区域，类似规定比例尺-->
  </svg>
  ```

- xmlns,xmlns:link：SVG文件是纯粹的XML文件。 在XML中，标签和属性属于命名空间，这是为了防止来自不同技术的标签和属性发生冲突。 xmlns用于声明命名空间，xmlns:xlink 表示前缀为xlink的标签和属性，应该由理解该规范的UA 使用xlink规范 来解释。 

### 图形标签

```html
<svg width="300" height="300" viewBox="0 0 100 100">
    <circle cx="100" cy="100" r="50"/>
    <line x1="0" y1="300" x2="0" y2="100"/>
    <rect x="0" y="0" width="100" height="100"/>
    <ellipse cx="100" cy="100" rx="100" ry="50"/>
    <polyline points="0 0,10 10,10 60"/><!--多个线段--<
	<polygon points="0 0,10 10,10 60"/>
	<!--和polyline一样，但是默认闭合-->
</svg>
```

### path

path拥有强大的自由度，可以绘制复杂的线条和图形，支持直线、矩形甚至贝塞尔曲线，通过d属性修改线条

- 直线命令

    | 命令  |                   作用                   |
    | :---: | :--------------------------------------: |
    | M x y | 提起画笔（不画线，仅改变下一次绘制起点） |
    | L x y |           移动画笔，画线式的M            |
    |  H x  |                画一条横线                |
    |  V y  |                画一条竖线                |
    |   Z   |              闭合起点和终点              |

- 曲线命令

  |                         命令                          |                             作用                             |
  | :---------------------------------------------------: | :----------------------------------------------------------: |
  |                      Q x1 y1,x y                      |         绘制二次贝塞尔曲线，x1 y1为终点，x y为控制点         |
  |                         T x y                         |      x、y为终点位置，通过前一个控制点推断出后一个控制点      |
  |                  C x1 y1, x2 y2, x y                  | x、y为终点位置，x1、y1为曲线起始点的控制点，x2、y2为曲线终止的控制点。 |
  |                     S x2 y2, x y                      |                     简化的三次贝塞尔曲线                     |
  | A rx ry x-axis-rotation large-arc-flag sweep-flag x y | rx、ry为两个轴向半径，x-axis-rotation为弧度在x轴的旋转角度，large-arc-flag为0表示劣弧（小角），否则为优弧，x、y为终点，sweep-flag为圆弧的反向（0逆1顺） |

## 填充和轮廓

### 填充

- fill="color"或style="fill:'color'"
- fill-opacity:"0.5"透明度
- fill-rule 用来设置复杂形状的填充规则（哪里是里）。它有两种填充方式：nonzero 和 evenodd。  
  - nonzero：判断一个点是否在图形内，从该点作任意方向的一条射线，然后检测射线与图形路径的交点情况。从0开始计数，路径从左向右（顺时针）穿过射线则计数加1，从右向左（逆时针）穿过射线则计数减1。得出计数结果后，如果结果是0，则认为点在图形外部，否则认为在内部。 
  - evenodd：判断一个点是否在图形内，从该点作任意方向的一条射线，然后检测射线与图形路径的交点的数量。如果结果是奇数则认为点在内部，是偶数则认为点在外部。 

### 轮廓

- stroke="color"或style="stroke:color"
- stroke-width，stroke-opacity 
- stroke-linecap：和canvas的lineCap一样
- stroke-linejoin：和canvas的lineJoin一样
- stroke-miterlimit：和canvas的miterlimit一样
- stroke-dashoffset，stroke-dasharray="5,10,5,20"虚线属性

## 文字

### 标签

```html
<text x="50" y="50">Hello Svg !</text>
<text x="50" y="50" fill="#f00" stroke="#0f0" font-size="50" >
Hello<tspan fill="#f0f" font-weight="bold">小</tspan>Svg</text>
<!--tspan可以类比p和span,但是它的x、y、dx、dy会对标签后面的内容造成影响-->
<path id="pathM" d="M 50 50 100 100 200 50 300 100" fill="none" />
<text>
  <textPath xlink:href="#pathM">Welcome to</textPath>
  <!--通过href指定一个路径让文字顺着路径写-->
</text>
```

### 属性

- x,y绘制起点，
- dx,dy 与x和y属性不同的是，x和y属性是绝对的坐标，而dx和dy属性是相对于当前位置的偏移量。 参数也可以是一个数列。如果设置为了一个数列则会应用到每一个字符上 
- rotate: 把文字旋转一个角度，注意是每个文字逐个旋转而不是容器旋转，参数也可以是一个数列
-  textLength给定了一个计算长度。在文字的长度和textLength属性给定的长度不一致的情况下渲染引擎会精细调整字型的位置。 
- lengthAdjust：决定如何进行长度调整，
  - spacing：只拉伸或压缩间距
  - spacingAndGlyphs：同时拉伸或压缩间距和文字本身
- fill、stroke同样可用

- 大部分CSS文字属性也可以使用（直接写进标签属性）

## defs

### 渐变

```html
<defs>
  <linearGradient id="linear" x1="0" y1="0" x2="100%" y2="100%">
    <!--xy是始终点，决定渐变角度，可以类比ai里的那个渐变控制条-->
    <stop offset="0%" stop-color="rgb(255,255,0)"/>
    <stop offset="20%" stop-color="rgb(0,255,0)"/>
    <stop offset="100%" stop-color="rgb(0,255,255)"/>
  </linearGradient>
  <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
    <!--fx,fy才是渐变中心点-->
    <stop offset="0%" stop-color="rgb(255, 255, 0)" />
    <stop offset="100%" stop-color="rgb(255, 0, 0)" />
  </radialGradient>
  <rect fill="url(#radialGradient)"/>
  <!--如此使用-->
</defs>
```

### 裁剪

定义一条裁剪路径，然后用来裁剪掉元素的部分内容。且任何透明度的效果都是无效的，它只能要么裁剪掉要么不裁剪。 

```html
<defs>
  <clipPath id="clipPath">
    <path d="M10 50 A50 50 0 0 1 100 50 A50 50 0 0 1 190 50 Q210 100 100 200  Q-5 100 10 50 Z" />
  </clipPath>
</defs>
  
<rect x="0" y="0" width="200" height="200" fill="#f00" clip-path="url(#clipPath)"  />
```

### 蒙层

只显示蒙层内的部分，允许设置透明度

```html
<defs>
  <mask id="Mask">
    <path d="M10 50 A50 50 0 0 1 100 50 A50 50 0 0 1 190 50 Q210 100 100 200  Q-5 100 10 50 Z" fill="#fff" fill-opacity="0.5" />
  </mask>
</defs>
  
<rect x="0" y="0" width="200" height="200" fill="#f00" mask="url(#Mask)" />
```

# 动画

### transform

```html
<rect x="0" y="0"  width="100" height="50" fill="#ff770f" transform="translate(200, 100)" transform-origin="50 50"/>
```

- translate(offsetX,offsetY)
- scale(x[,y])
- rotate(deg)
- transform-origin(canterX,centerY)旋转中心点
- skewX(x),skewY(y)倾斜，不能合起来