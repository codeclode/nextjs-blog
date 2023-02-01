---
title: "JS其他"
date: "2023-01-15"
---

# URL

```javascript
var url = new URL('https://developer.mozilla.org/en-US/docs/Web/API/URL/href?name=liaosong#Examples');
consoloe.log(url)
//hash: "#Examples?name=liaosong"
//host: "developer.mozilla.org"
//hostname: "developer.mozilla.org"
//href: "https://developer.mozilla.org/en-US/docs/Web/API/URL/href?name=liaosong#Examples"
//origin: "https://developer.mozilla.org"
//password: ""
//pathname: "/en-US/docs/Web/API/URL/href"
//port: ""
//protocol: "https:"
//search: "?name=liaosong"
//searchParams: URLSearchParams {}可以像set一样使用，但是可以排序以及append和delete等
//username: ""

url.searchParams.get('name')
//'liaosong'
url.toJSON()//等同于toString，返回href
```

# Web worker

### 普通worker

```javascript
//main.js
const worker = new Worker('./worker.js');
worker.postMessage({ type: 'start', payload: { count: 666 } }); // 发送信息给worker
worker.onmessage = function (messageEvent) {
	console.log(messageEvent)
    const { type, payload } = messageEvent.data;
}
worker.terminate();

//worker.js
self.onmessage = (messageEvent) => {//注意，worker本体接送消息使用self代表自己
  console.log(messageEvent);
  const { type, payload } = messageEvent.data;
  switch (type) {
    case 'start':
      // 通过一系列处理之后，把最终的结果发送给主线程
      const result = counter();
      this.postMessage(result);
      break;
  }
};

//收发双方使用poastmessage和onmessage通信
```

### SharedWorker，允许共享worker

```javascript
//mainjs
let worker = new SharedWorker('./sharedWorker.js');
likeBtn.addEventListener('click', function () {
	worker.port.postMessage({ type: 'increase', payload: { count: 666 } });
});
decreaseBtn.addEventListener('click', function () {
	worker.port.postMessage({ type: 'decrease', payload: { count: 666 } });
});//注意，所有的内容都在.port上进行

//worker.js
let val = 666;

self.onconnect = function (e) {
  const port = e.ports[0];
  console.log('shared-worker connect');

  port.postMessage(val);

  port.onmessage = (messageEvent) => {
    const { type, payload } = messageEvent.data;

    switch (type) {
      case 'increase':
        port.postMessage(++val);
        break;
      case 'decrease':
        port.postMessage(--val);
        break;
    }
  };
};
```

### ServerWorker

详见前端优化之PWA

# IndexedDB

- 一个比较大的localStorage
- 使用对象仓库存放键值对数据，主键是独一无二的，并且不能有重复。 
- 遵循同源策略。即可以访问相同域内存储的数据，但无法跨不同域访问数据。 
- 可以在Worker中使用

### 数据库连接

```javascript
const DBOpenRequest = window.indexedDB.open('project', 2);
//使用对应版本查询或者创建数据库，如果已有数据库版本高于给定的 version，中止操作并返回类型为 VersionError 的 DOMError。
//如果已有数据库版本低于给定的 version，触发一个 versionchange 操作。
//如果数据库不存在，创建指定名称的数据库，将版本号设置为给定版本，如果未给定版本号，则设置为 1。
let db;
  db = request.result;
  console.log('数据库打开成功');
};
request.onupgradeneeded = function (event) {
  db = event.target.result;
};//到这里获取了数据库
```

### 数据库模式操作

```javascript
const objectStore = db.createObjectStore('project', { keyPath: 'id' });
//新建表（或者说对象仓库），第二个值为options，包括主键的属性和其是否自增整数
db.createIndex(indexName, keyPath, objectParameters)
//indexName创建的索引名称，可以使用空名称作为索引。keyPath索引使用的键属性，可以使用空创建索引, 也可以传递数组。objectParameters可选参数。常用参数之一是unique，表示该字段值是否唯一，不能重复。
```

### 事务

对于数据仓库的所有操作都是在事务中进行的

```javascript
const transaction = db.transaction('project', "readwrite");
const objectStore = transaction.objectStore('project');
const objectStoreRequest = objectStore.add(newItem);
//db.transaction('project',"readwrite").objectStore('project').add(newItem);
const objectStoreRequest = db.transaction('project',"readwrite").objectStore('project') .delete(id);

//查
const store = db.transaction([dbName], 'readwrite').objectStore(dbName);
const request = store.index(name).getAll(value);
// 返回对象存储中与指定参数匹配的所有对象，如果没有给出参数，则返回存储中的所有对象。
//get(key)通过主键查询
request.onsuccess = function(event){
    consoloe.log(event.result)
}

const objectStore = db.transaction(dbName).objectStore(dbName);
const keyRangeValue = IDBKeyRange.bound(4, 10,true,false);//(4,10]
//bound()、only()、lowerBound()、upperBound()
objectStore.openCursor(keyRangeValue).onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
        cursor.continue();
    } else {
        // 完成遍历
    }
}

//修改数据
const transaction = db.transaction('project', "readwrite");
const objectStore = transaction.objectStore(project);
// 获取存储的对应键的存储对象
const objectStoreRequest = objectStore.get(id);
// 获取成功后替换当前数据
objectStoreRequest.onsuccess = function(event) {
  // 当前数据
  const myRecord = objectStoreRequest.result;
  // 遍历替换
  for (const key in updateData) {
    if (typeof myRecord[key] != 'undefined') {
      myRecord[key] = data[key];
    }
  }
  // 更新数据库存储数据             
  objectStore.put(myRecord);
};
```

# 设计模式

### 单例

- 基于对象数据类型，把描述当前事务的属性和方法统一放在一起分组管理，能够减少全局变量污染，这种设计模式就是“单例设计模式”

- var obj = {xxx:XXX}，obj看作命名空间，把描述当前事务的属性和方法，放到空间中进行分组管理 

- 单例设计模式也是最基础的模块化思想 

- ```javascript
  var utils=(function(){
      function func1(){}
      function func2(){}
      return {
          func1:func1,
          func2:func2
      };
  })();
  
  var searchModule=(function(){
      function queryData(){}
      function bindHTML(){
          //=>需要调取utils模块（命名空间中的方法）
          utils.func1();
      }
      return {
          init:function(){
          }
      };
  })();
  ```

### 工厂

- 工厂设计模式，是在需要创建很多“相似实例”的情境下，让我们告别手动创建，而实现工业化批量生产

- 其实就是类似构造函数和类的东西

- ```javascript
  function createPerson(name,parent){
  	var person={};
  	person.name=name;
  	if(typeof parent!=="undefined"){
  		person.parent=parent;
  	}
  	return person;
  }
  var person1=createPerson('小白');
  var person2=createPerson('小绿');
  var person3=createPerson('小红',person1);
  ```

# 再看等号问题

### 表格，1true，0false

|         x         |      y      |  ==  | ===  |  is  |
| :---------------: | :---------: | :--: | :--: | :--: |
|        +0         |     -0      |  1   |  1   |  0   |
|         0         |    false    |  1   |  1   |  0   |
|        ""         |    false    |  1   |  0   |  0   |
|        ""         |      0      |  1   |  0   |  0   |
|        '0'        |      0      |  1   |  0   |  0   |
|       '17'        |     17      |  1   |  0   |  0   |
|       [1,2]       |    '1,2'    |  1   |  0   |  0   |
| new String('foo') |    'foo'    |  1   |  0   |  0   |
|       null        |  undefined  |  1   |  0   |  0   |
|       null        |    false    |  0   |  0   |  0   |
|     undefined     |    false    |  0   |  0   |  0   |
|    {foo:"bar"}    | {foo:"bar"} |  0   |  0   |  0   |
|         0         |    null     |  0   |  0   |  0   |
|         0         |     NaN     |  0   |  0   |  0   |
|       'foo'       |     NaN     |  0   |  0   |  0   |
|        NaN        |     NaN     |  0   |  0   |  1   |

### 对于==和类型转换

- null和undefined
  - null == undefined 为true
  - 他们不等于任何东西
- NaN不等于任何值，甚至他自己
- 除了字符串和对象转字符串，只要数据类型不同就都转为数字
- 数组：Number(\[\])->0,Number([0])->0,Number([2])->2,Number([1,2])->NaN
- 字符串：''->0,"1"->0,'1a'->NaN
- Number(undefined)->NaN,Number(null)->0
- Boolean([])->true,Boolean(null|undefined)->false

# 数据类型检测的方法

### typeof 

- 只能返回基本的类型，面向对象的继承没发辨别，都返回object
-  NaN / Infinity都是数字类型的，检测结果都是“number”; 
-  typeof null 的结果“object”; 

### instance of

- 定义某个实例是否属于这个类
- 根据原型链判断
- 返回true和false
- 要求检测的实例必须是对象数据类型的 
- 所有对象都是 Object 的实例，检测结果都是 TRUE ，所以无法基于这个结果判断是否为普通对象 

### constructor

- arr.construcuor===Array
- 实例.constructor 一般都等于 类.prototype.constructor也就是当前类本身（前提是你的 constructor 并没有被破坏）
- 能检测基本数据类型
- 不给当前类的原型进行重定向，会造成检测的结果不准确
- 非常容易被修改 

### Object.prototype.toString.call()

- 专门用来检测数据类型的方法，基本上不存在局限性的数据类型检测方式

- 基于他可以有效的检测任何数据类型的值

- ```javascript
  let class2type = {};
  let toString = class2type.toString; //=>Object.prototype.toString
  
  console.log(toString.call(10)); //=>"[object Number]"
  console.log(toString.call(NaN)); //=>"[object Number]"
  console.log(toString.call("xxx")); //=>"[object String]"
  console.log(toString.call(true)); //=>"[object Boolean]"
  console.log(toString.call(null)); //=>"[object Null]"
  console.log(toString.call(undefined)); //=>"[object Undefined]"
  console.log(toString.call(Symbol())); //=>"[object Symbol]"
  console.log(toString.call(BigInt(10))); //=>"[object BigInt]"
  console.log(toString.call({xxx:'xxx'})); //=>"[object Object]"
  console.log(toString.call([10,20])); //=>"[object Array]"
  console.log(toString.call(/^\d+$/)); //=>"[object RegExp]"
  console.log(toString.call(function(){})); //=>"[object Function]" 
  ```

- 只能检测内置类，不能检测自定义类

- 只要是自定义类返回的都是‘[Object Object]’

# 正则表达式

### 数量

- \* 0,1,n
- \+ 1,n
- ? 0,1
- {n} n
- {n,} n+i
- {n,m} n~m

### 字符

- \[ABC\]匹配中括号中的任意字符
- \[^ABC\]除了中括号内字符的字符
- \[A-Z0-9\]
- \.匹配除了换行之外的任意单个
- \[\s\]匹配一切
- \w匹配字母数字下划线

### 定位

- ^ 开始
- $ 结束
- \b 单词边界

### 括号

- exp1(?=exp2)：exp2前的exp1
-  (?<=exp2)exp1：查找 exp2 后面的 exp1 
- exp1(?!exp2)：查找后面不是 exp2 的 exp1 
-  (?<!exp2)exp1：查找前面不是 exp2 的 exp1 

### 反向捕获

- \1 代表前面括号中捕获到的对象再一次出现

### 修饰符

- i不区分大小写
- g全局匹配
- m 多行匹配 ，使边界字符 ^ 和 $ 匹配每一行的开头和结尾。
- s .可以匹配算上换行符的一切

# 文件上传

```html
<input id="uploadFile" type="file" accept="image/*" />
```

```javascript
upload(){
  const uploadFileEle=document.getElementById("uploadFile")
  if (!uploadFileEle.files.length) return;
  // 获取文件
  const file = uploadFileEle.files[0];
  // 创建上传数据
  const formData = new FormData();
  formData.append("file", file);
  // 上传文件
  // 接下来和其他请求一样发送即可（post）xhr.send(formdata)
}

//拖拽
document.getElementById("img-container").ondrop = function(event){
    event.preventDefault();
    // 数据在event的dataTransfer对象里
    let file = event.dataTransfer.files[0];

    // 或者是添加到一个FormData
    let formData = new FormData();
    formData.append("fileContent", file);
    console.log(formData)
}
document.getElementById("img-container").ondragover = function(event){
    event.preventDefault();//一定要做，不然会默认下载
}
```

## 大文件切片

对于大文件，合理切片加快速度并且防止系统崩溃造成全部重传问题。

### 前端

```html
<input type="file" id="input">
<!--form的enctype属性定义content-Type-->
<!--form中enctype="multipart/form-data"的意思，是设置表单的MIME编码。默认情况，这个编码格式是application/x-www-form-urlencoded，不能用于文件上传；multipart/form-data，才能完整的传递文件数据。enctype="multipart/form-data"是上传二进制数据; form里面的input的值以2进制的方式传过去。-->
<button id="upload">上传</button>
<div style="width: 300px" id="progress"></div>
```

```javascript
let input = document.getElementById('input')
let upload = document.getElementById('upload')
let files = {}//创建一个文件对象
let chunkList = []//存放切片的数组
// 读取文件
input.addEventListener('change', (e) => {
  files = e.target.files[0]
  console.log(files);
    
    //创建切片
    //上传切片
})
function createChunk(file, size = 2 * 1024 * 1024) {//size:切片大小
  const chunkList = []
  let cur = 0
  while (cur < file.size) {
    chunkList.push({
      file: file.slice(cur, cur + size)//使用slice()进行切片
    })
    cur += size
  }
  return chunkList
}

async function uploadFile(list) {
  const requestList = list.map(({file,fileName,index,chunkName}) => {
    const formData = new FormData() // 创建表单类型数据
    formData.append('file', file)//该文件
    formData.append('fileName', fileName)//文件名
    formData.append('chunkName', chunkName)//切片名
    return {formData,index}
  })
  .map(({formData,index}) =>axiosRequest({
    method: 'post',
    url: 'http://localhost:3000/upload',//请求接口，要与后端一一一对应
    data: formData
  })
  .then(res => {
    console.log(res);
    //显示每个切片上传进度
    let p = document.createElement('p')
    p.innerHTML = `${list[index].chunkName}--${res.data.message}`
    document.getElementById('progress').appendChild(p)
  }))
  await Promise.all(requestList)//保证所有的切片都已经传输完毕
}
//请求函数
function axiosRequest({method = "post",url,data}) {
    return new Promise((resolve, reject) => {
        const config = {//设置请求头
            headers: 'Content-Type:application/x-www-form-urlencoded',
        }
        //默认是post请求，可更改
        axios[method](url,data,config).then((res) => {
            resolve(res)
        })
    })
}
upload.addEventListener('click', () => {
    const uploadList = chunkList.map(({file}, index) => ({
        file,
        size: file.size,
        percent: 0,
        chunkName: `${files.name}-${index}`,
        fileName: files.name,
        index
    }))
    //发请求，调用函数
    uploadFile(uploadList)
})
```

### 后端

```javascript
const multipart = new multiparty.Form() // 解析FormData对象
multipart.parse(req, async (err, fields, files) => {
  if (err) { //解析失败
    return
  }
  console.log('fields=', fields);
  console.log('files=', files);
            
  const [file] = files.file
  const [fileName] = fields.fileName
  const [chunkName] = fields.chunkName
            
  const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`)
  //在qiepian文件夹创建一个新的文件夹，存放接收到的所有切片
  if (!fse.existsSync(chunkDir)) { //文件夹不存在，新建该文件夹
    await fse.mkdirs(chunkDir)
  }
  // 把切片移动进chunkDir
  await fse.move(file.path, `${chunkDir}/${chunkName}`)
  res.end(JSON.stringify({ //向前端输出
    code: 0,
    message: '切片上传成功'
  }))
})
```

前端发现所有切片上传成功以后要求后端合并

```javascript
async function mergeFileChunk(filePath, fileName, size) {
  const chunkDir = path.resolve(UPLOAD_DIR, `${fileName}-chunks`)
  let chunkPaths = await fse.readdir(chunkDir)
  chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1])
  const arr = chunkPaths.map((chunkPath, index) => {
    return pipeStream(
    path.resolve(chunkDir, chunkPath),
    // 在指定的位置创建可写流
    fse.createWriteStream(filePath, {
      start: index * size,
      end: (index + 1) * size
    }))
  })
  await Promise.all(arr)//保证所有的切片都被读取
}
// 将切片转换成流进行合并
function pipeStream(path, writeStream) {
  return new Promise(resolve => {
    // 创建可读流，读取所有切片
    const readStream = fse.createReadStream(path)
    readStream.on('end', () => {
      fse.unlinkSync(path)// 读取完毕后，删除已经读取过的切片路径
      resolve()
    })
    readStream.pipe(writeStream)//将可读流流入可写流
  })
}
```

