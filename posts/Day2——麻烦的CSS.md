---
title: "麻烦的CSS"
date: "2023-01-10"
---

# @import与link引入

- link可以引入其他内容，@import只能引入样式
- 加载时link被同步加载（参见浏览器渲染），而@import则是在页面加载完毕后被加载。 
- css2.1以后才支持import，link一直被支持
- DOM方法基于文档，@import不能用js改变
- 加载过程：可以认为@import对css头部进行了简单替换，虽然比link后加载，但是由于浏览器多次渲染，不会造成覆盖（其虽然后被加载，却会在加载完毕后置于样式表顶部，最终渲染时自然会被下面的同名样式层叠。）

# CSS属性继承

### 无继承

- display
- 文本相关属性
  - vertical-aligh
  - text-decoration
  - text-shadow
  - white-space
  - unicode-bidi
- 盒模型相关
  - height、width
  - padding、margin、border
- 背景相关属性
- 定位
  - float、clear
  - position、top、left、right、botton、z-index
  - max|min-weight|height
  - clip、overflow
- 轮廓outline
- 页面样式size、 page-break-before、page-break-after 

### 有继承

- 字体相关
  - font-family|weight|size|style|variant|stretch
- 文本属性
  - text-indent
  - text-align
  - line-height
  - word-spacing
  - letter-spacing
  - text-transform
  - direction
  - color
- visibility
- 表格和列表的布局属性（caption-side、border-collapse、table-layout、list-style）
- cursor

# 伪类与伪元素

### 区分方式

伪类和伪元素的根本区别在于：是否创造了新的元素。伪类用于向某些选择器添加特殊的效果，而伪元素用于将特殊效果添加到某些选择器中，也就是说伪元素是对那些不能通过 class 或 id 等选择元素的补充。

### 伪元素

- ::brfore
- ::after
- ::first-letter：首个单词
- ::first-line：首行
- ::selection
- ::mark： 用在li元素或设置了display:list-item的元素上，自定义项目符或者数字的样式。 
- ::placeholder

### 伪类

- 状态性伪类
  - :link未被访问的链接
  - :visited以访问
  - :hover鼠标悬停中
  - :active选择活动的链接（鼠标摁着没松）
  - :focus获得焦点的元素
- 结构性伪类
  - :not(selector)取非
  - :first-child选择作为其父的首个元素，注意要放在子元素上，比如选择div下作为第一个孩子的p，要使用p:first-child
  - :last-child作为父元素的最后一个元素
  - :only-child作为其父的唯一一个孩子的元素
  - :nth-child(n)作为其父的第n个子元素
  - :nth-last-child(n)倒数第n
  - :first-of-type：作为父元素特定类型子元素的第一个，注意和first-child对比，p:first-of-type会选择div下的第一个p，无论p是否作为第一个子元素
  - last|nth|only|(nth-last)-of-type同理
  - :target选择当前锚点对应的元素
  - :empty没有子元素的元素
- :root根元素
- :fullscreen全屏
- :dir()特定文字方向
- :lang()匹配特定语言
- 表单相关
  - :check被选中
  - :disabled
  - :enabled
  - :required必须
  - :optional可选
  - :read-only
  - :read-write
  - :valid
  - :invalid
  - :in-range
  - :out-of-range
  - :indeterminate
  - :default默认值特有类型（比如一组下拉列表的默认选项）

# 选择器与优先级

### 基础选择器

- 通配符*
- ID #
- class .
- 属性[xxx(^$|*~)='xxx']
- 标签 div

### 组合选择器

- 后代（空格）
- 子元素>
- 相邻兄弟+ 选取某个元素紧邻的兄弟元素 
- 通用兄弟~ 匹配选择器后面所有符合选择器的元素 
- 交集 把两个选择器放在一起 .class1.class2
- 并集，就是逗号

### 伪类与伪元素不再赘述

### 权重问题

|     选择器     | 权重  |
| :------------: | :---: |
|   important    | 10000 |
|   行内style    | 1000  |
|       id       |  100  |
| 属性、类或伪类 |  10   |
|  标签或伪元素  |   1   |
|     通配符     |   0   |
| 后代、子选择器 |   0   |
|   兄弟选择器   |   0   |

- 后入原则：相同权重以后来者居上
- [id="x"]的权重依然是10
- 组合选择器本身不创造权重
- 不同属性不交叠，比如虽然定义width：300 important，但max-width：100，那么宽度依然是100

# 盒模型与BFC

### 盒模型

- margin+padding+border+content

- 现代浏览器默认content-box

- 只有老IE使用border-box

- clientWidth=padding+content

- clientLeft就是边框border大小

- offsetWidth = clientWidth+border

- offsetLeft就是距离父级内边距的距离，父级身上的position：absolute/fixed决定 如果父级元素没有就逐层查找 直到body 

- scrollWidth=clientWidth+margin

  scrollTop/scrollLeft  滚动条卷走的高度和宽度

### BFC

- 块级格式化上下文
- 可以理解为一个容器，无论子元素如何翻腾都不会跑出这个容器
- 特点
  - 垂直方向上，自上而下排列，和文档流的排列方式一致。
  - 在BFC中上下相邻的两个容器的margin会重叠
  - 计算BFC的高度时，需要计算浮动元素的高度
  - BFC区域不会与浮动的容器发生重叠
  - BFC是独立的容器，容器内部元素不会影响外部元素
- 用处
  - 解决margin重叠（包一层）
  - 解决float高度塌陷
- 创建方式
  - 根元素body本身就是BFC
  - 设置浮动，注意是浮动元素本体是BFC
  - 设置绝对定位absolute、fixed
  - display：grid、flex、inlin-block、table。。。
  - overflow：hidden、auto、scroll
- 浮动问题不想再说了。。。简而言之就是注意clear并没有清除浮动，而是清除了浮动造成的影响。

### 元素层叠次序

背景->负z-index->block层级(文档流)->浮动层级（浮动流）->inline层级->z-index（默认绝对定位）=0->正z-index

值得注意的是，脱离文档流的判断标准是元素原本的位置被后继的东西填充，而不是移动后是否挤占其他元素。

### 重绘与回流

- 尽量重绘而非回流
- 在dom树末端改变样式，比如修改color、visibility等不会造成结构改变的属性
- 避免css表达式calc等
- 避免多层内联样式
- 使用经常改变位置的元素绝对定位脱离文档流
- 使用transform开启硬件加速(transform使浏览器为元素创建⼀个 GPU 图层)。

# 响应式

- html设置viewport，height、width，initial-scale初始缩放比，(max|min)imum-scale最大最小缩放比，user-scalable（no|yes）设置用户缩放权限
- 媒体查询@media screen|print... and (max-width:xxxpx) and  (-webkit-device-pixel-ratio: xxx) 
- 使用百分比布局
- rem根元素字体大小布局
- vw、vh、vmin、vmax布局
- 使用flex、grid

# 图片懒加载条件

```javascript
img.offsetTop < window.innerHeight + document.body.scrollTop;
//如果可是窗口不是window
element.offsetTop - document.documentElement.scrollTop < document.documentElement.clientHeight
//更好用的其实是getBoundingClientRect,获取到视窗的举例
element.getBoundingClientRect().top < clientHeight
```

# C3新特性

### 新的选择器和伪类

其实，咱们现在用的好多选择器、伪元素、伪类（selection、placeholder）都是C3的

### 新的样式

- border-radius
- box-shadow
- filter、backdrop-filter
- background-clip|origin|sizze

- 。。。

### 渐变

### 文本

- text-overflow

- word-wrap、word-break、text-wrap

- text-shadow。。。

- ```css
  <style>
      @font-face{
          font-family: myFirstFont;
          src: url(sansation_light.woff);
      }
  	/*网络字体*/
      div{
          font-family:myFirstFont;
      }
  </style>
  ```

### transform、transition、animation

### 多媒体查询

### flex、grid、column-list

### 盒模型

- resize：none | both | horizontal | vertical | inherit，用户是否可以调整大小
- box-sizing
- outline

# 浮动

1. 一个元素浮动后会脱离标准流，不占位，浮动流排版只有水平排版方式，只能设置某个元素左对齐或者右对齐，没有居中对齐。
2. 在浮动流布局中不再区分块级元素/行内元素/行内块级元素，他们都水平排版，而且都可以设置宽高，和行内块级元素很像（水平排版，可设置宽高）
3. 浮动元素会脱离标准流，后面的元素会上浮顶替前面元素空出的位置，前面一个元素左浮盖住后面一个元素，浮动元素浮动之后的位置,由浮动元素浮动之前在标准流中的位置来确定
4. 浮动元素具有贴靠现象，如果父元素的宽度足以显示所有的浮动元素，那么浮动的元素会并排显示，若宽度不足，会从最后一个元素开始往前贴靠，如果都空间不足，就会换行贴靠在父元素的左边或者右边，呈现竖直排列。
5. 浮动元素具有字围现象，浮动元素不会挡住没有浮动元素中的文字（和元素层叠次序联想一下）, 没有浮动的文字会自动给浮动的元素让位置,实现文字环绕图片的效果

### 如何清除

- 后边的元素或者::after设置clear，这样做并不是清除浮动，而是让这个被设置了的元素“看见”浮动，从而向下排列。从而达到防止高度塌陷的问题。
- 利用overflow（只要不是visible）创建一个BFC（ BFC在计算高度的时候，内部浮动元素的高度也要计算在内。 ）