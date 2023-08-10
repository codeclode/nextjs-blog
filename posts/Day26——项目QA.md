---
title: "前端工程化"
date: "2023-08-05"
---

# 嘉晚饭

> 项目难点

- navieUI的表格自带分页不能设置total属性，导致如果希望分页，只能一次性获取所有数据，因此采用了类似虚拟列表的方案，不是本页的数据使用空对象填补。
- 保证一个顶点只能被一个骑手接取，使用ws传输订单状态，同时在骑手接单时检查订单是否被接取。

# 低代码

> 如何实现

- 实现了一个RenderNode类，带有styles、events、tags等属性，正好对应给定的结点类型
- 根Node存储在redux中，同时对外暴露了appendChild(root,xxx)、setStyle等方法供其他模块使用

> 拖拽

- React-dnd
- 使用json文件存储可拖拽的html或ant标签
- useDrag的type就是对应元素的标签名，useDrop的accept则是所有标签名组成的数组
- drop时判断当前拖拽的位置和type决定放置位置

> 放在哪

- 选中父元素以后拖拽子元素
- 判断鼠标位置，然后通过对比鼠标的clientX|Y和元素的getBoundingClientRect的x|y来判断方位关系。

# Chart Generator

> 导出

- 通用步骤:XML序列化和下载按钮

  ```javascript
  const serializer = new XMLSerializer();
  const serializedElement = serializer.serializeToString(svg);
  ```

  ```javascript
  const a = document.createElement("a");
  a.href = url;
  a.download = "output.svg";
  document.body.appendChild(a);
  a.click();
  ```

- svg导出

  - ```javascript
    const blob = new Blob([serializedElement], { type: "image/svg" });
    const url = URL.createObjectURL(blob);//转换为blob对象并得到dataUrl
    //按钮导出代码
    URL.revokeObjectURL(url);//释放内存
    ```

- png导出

  ```javascript
  const src = `data:image/svg+xml;chartset=utf-8,${encodeURIComponent(
      serializedElement
  )}`; //拼接得到src
  let { width, height } = svg.getBoundingClientRect();//得到svg的尺寸
  const img = new Image(width, height);
  img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");//把svg放到canvas里，基于可以转换为png
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        let url = canvas.toDataURL("png", 1);
        //按钮导出代码
      }
  };
  img.src = src;
  ```

> 双向绑定

- 控件就是选中的图表，需要给它包一层框表示以选中
- 控件类采用单例模式，只能同时选中一个（或一组）图表
- transform-origin有一个问题，控件的框和选中的图表需要一个间隙（不然很难看），这就导致我在实现控件控制图表旋转时在非 center center 的情况下图表和控件的旋转中心不一致导致问题，因此不能使用left、bottom等来控制控件的旋转中心，而是要进行一定量的偏移以使其和图表origin重合

> 中心计算

- 比较复杂，需要特定的数学公式

> 缩放控件

- MutationObserver，因为使用了D3的缩放工具，出现了一个问题：图表使用滚轮缩放时React无法鉴定，采用MutationObserver监听scale属性变化并重新渲染控件。

- 缩放控件允许控件点击缩放，使用脚本模拟鼠标缩放

  ```javascript
  let scrollEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      clientX: x + width / 2,//位置在图表中心
      clientY: y + height / 2,
      deltaX: 0,
      deltaY: isIn ? -120 : 120,
  });
  svgRef.current.dispatchEvent(scrollEvent);
  ```

> 颜色选择器封装

- 想实现hsl颜色选择器，浏览器的input暂无此功能
- 同时渐变也没有
- 实现方案：类似微积分思想，canvas为渐变色的圆，通过用D3不断的新建H从0-360为渐变的stop，当鼠标点击时，把鼠标坐标映射到canvas坐标并getImageData得到RGB颜色，再利用D3转换回H
- 渐变色：利用svg即可，导出时导出的是通过D3处理得到的映射函数

> NoSSR
```javascript
import dynamic from "next/dynamic";

const NoSsr: React.FC = ({ children }) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});
```