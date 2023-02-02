---
title: "webpack"
date: "2023-01-19"
---

# 三大概念

### module

> 离散功能块，为某个功能提供可靠的封装

### chunk

> 此术语在内部用来管理捆绑过程， 输出束（bundle）由块组成，其中有几种类型（例如 entry 和 child ）。通常，chunk直接与 输出束 (bundle）相对应，但是，有些配置不会产生一对一的关系。 

### bundle

> 由许多模块生成，包含已经经过加载和编译过程的源文件的最终版本。 

可以认为，module为输入，bundle为输出，chunk是中间产物，可以认为是如果一个js引入了其他依赖，则将所有的依赖捆绑到这个 js 里，构建成了一个叫 Chunk。 

# 开始

```shell
npm init
npm i --save-dev webpack webpack-cli
```

### 工作目录

```javascript
//webpack.config.js
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/js/index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist')
  }
}

//package.json
  "scripts": {
    "build": "webpack --config ./build/webpack.config.js",
    ...
},
```

### html-webpack-plugin

```shell
npm i --save-dev html-webpack-plugin
```

```javascript
//webpack.config.js
module.exports = {
    ...
    // 新增 plugins 属性
    plugins: [
        new HtmlWebpackPlugin({
          title: '首页'
        })
    ]
}
```

### 指定文件名和多页面

```javascript
module.exports = {
    // entry: path.resolve(__dirname, '../src/js/index.js'),
    entry: {
        main: path.resolve(__dirname,'../src/js/index.js'),
		header:path.resolve(__dirname,'../src/js/header.js'),
        footer: path.resolve(__dirname, '../src/js/footer.js'),
    },
    output: {
        filename: '[name].[fullhash].js',
        path: path.resolve(__dirname, '../dist'),
        clean:true//w5的自动清理老文件
    },
    plugins: [
    // 配置多个 HtmlWebpackPlugin，有多少个页面就配置多少个
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/html/index.html'),
      filename: 'index.html',
      chunks: ['main'] // 与入口文件对应的模块名（entry 配置），这里可以理解为引入 main.js
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/html/header.html'),
      filename: 'header.html',
      chunks: ['header'] // 添加 chunks
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/html/footer.html'),
      filename: 'footer.html',
      chunks: ['footer']
    }),
}
```

### server

```shell
npm i -D webpack-dev-server
```

```javascript
//webpack.config.js
module.exports = {
    ...
      devServer: {
        port: 3000,
        hot: true,
		compress:true
        contentBase: '../dist' // 如果出错，请将 contentBase 替换为 static(w4是contentBase,w5就是static)
      },
}

//package.json
    "scripts": {
        "dev": "webpack server --config build/webpack.config.js --open",
        ...
    },
```

# 多环境

```shell
npm i -D webpack-merge
```

需要写两个配置文件，webpack.dev.js和webpack.prod.js，分别对应开发和生产

```javascript
//开发
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  devServer: {
    port: 3000,
    hot: true,
    contentBase: path.resolve(__dirname, '../dist')
  },
})

//生产
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  
})
//merge的意思是，把config文件里的东西和下边写的额外配置合并
//同时修改package.json
"scripts": {
    "dev": "webpack server --config build/webpack.dev.js --mode development",
    "build": "webpack --config ./build/webpack.prod.js --mode production",
    ...
}
    //如果不在脚本里添加mode，也可以写在配置文件里 mode: 'development',
```

# CSS和静态资源

### css

```shell
npm i -D css-loader style-loader sass-loader post-loader postcss-preset-env
```

```javascript
module.exports = {
    ...
    module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader', 'css-loader','sass-loader','post-loader'
        ]
      }
    ]
  }
}
//这样可以让css被js引用从而有效

//需要css兼容那么要配置postcss.config.js
module.exports = {
  plugins: [require('postcss-preset-env')]
}
//以及浏览器兼容.browserslistric
# 换行相当于 and
last 2 versions # 回退两个浏览器版本
> 0.5% # 全球超过0.5%人使用的浏览器，可以通过 caniuse.com 查看不同浏览器不同版本占有率
IE 10 # 兼容IE 10
```

```shell
npm i -D mini-css-extract-plugin css-minimizer-webpack-plugin
```

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    ...
    plugins: [
        ...
        new MiniCssExtractPlugin()
    ],
    module: {
    rules: [
          {
            test: /\.css$/i,
            use: [
              //'style-loader', 'css-loader'
              MiniCssExtractPlugin.loader, 'css-loader'
            ]
          }
      ]
    }
}
//这样可以单独打包css文件而不是js引用
```

```javascript
//webpack.prod.js
const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
})
//这样可以压缩css代码
```

#### 最后整理一下目录

```javascript
module.exports = {
    ...
    output: {
        filename: 'js/[name].[fullhash].js',
        ...
    },
    plugins: [
        ...
        new MiniCssExtractPlugin({
          filename: 'css/[name].[fullhash].css'
        })
    ],
    ...
}
//css 在css文件夹，js在js文件夹
```

### 静态资源

#### w4

在 webpack5 之前，可能需要使用 raw-loader、file-loader、url-loader 来加载资源。

1. raw-loader：将文件作为字符串导入
2. file-loader：处理文件的路径并输出文件到输出目录
3. url-loader：有条件将文件转化为 base64 URL，如果文件大于 limit 值，通常交给 file-loader 处理。

#### w5

webpack5 使用了“资源模块”来代替以上 loader。 官方是这样解释“资源模块”的。 

> 资源模块(asset **module**)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。 

- asset/resource： 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
- asset/inline： 导出一个资源的 data URI。之前通过使用 url-loader 实现。
- asset/source： 导出资源的源代码。之前通过使用 raw-loader 实现。
- asset： 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。

使用流程：首先建立assets文件夹，在这里搞张图片，然后在js里导入他。

```javascript
module: {
    rules: [
      ...
      {
        test: /\.(jpe?g|png|svg|gif)/i,
        type: 'asset/resource',
        generator: {
			filename: 'img/[hash][ext][query]' // 局部指定输出位置
		}
      }
    ]
}
```

如果需要使用一张图片，需要

```javascript
import img from '../assets/img/simao.jpg'
document.querySelector('.img').setAttribute('src', img)
```

对于asset/inline，如果指定type是东西，会将所有符合规则的资源都变为 base64 字符串，也即是比较大的图片也会转化为 base64 

对于asset，则是根据资源大小决定是否转化为base64

```javascript
{
    test: /\.(jpe?g|png|svg|gif)/i,
	type: 'asset',
	generator: {
		filename: 'img/[hash][ext][query]' // 局部指定输出位置
	},
	parser: {
		dataUrlCondition: {
			maxSize: 8 * 1024 // 限制于 8kb
		}
	}
}
```

asset/source，可以理解为“把目标文件的内容输出到 js 变量中”。 比如指定.txt的内容type为source，那么就可以在js里导入此文件的内容

# 别名配置

```javascript
module.exports = {
    resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          // 下面可以继续新增别名
        }
    }
}
```

那么就可以使用@来代表src路径

# hash

|   占位符    |        解释        |
| :---------: | :----------------: |
|     ext     |      文件后缀      |
|    name     |       文件名       |
|    path     |      相对路径      |
|   folder    |   文件所在文件夹   |
|    hash     |     生成的hash     |
|  chunkhash  |         -          |
| contenthash | 根据内容生产的hash |

# sourceMap

devtools选定是否生产sourceMap等来方便对源代码进行监测

|           devtool            | build | rebuild | 代码内容 | sourcemap  |  错误定位  |
| :--------------------------: | :---: | :-----: | :------: | :--------: | :--------: |
|              无              |   5   |    5    |    无    |     无     |     无     |
|             eval             |   4   |    5    |  编译后  |     无     | 定位到文件 |
|          source-map          |   1   |    1    |  源代码  |     有     | 定位到行列 |
|       eval-source-map        |   1   |    3    |  编译后  | 有data-url |  定位到行  |
|    eval-cheap-source-map     |   3   |    4    |  编译后  | 有data-url |  定位到行  |
| eval-cheap-module-source-map |   2   |    4    |  源代码  | 有data-url |     行     |
|      inline-source-map       |   1   |    1    |  源代码  | 有data-url |    行列    |
|      hidden-source-map       |   1   |    1    |  源代码  |     有     |     无     |
|     nosource-source-map      |   1   |    1    |  源代码  |     无     |    文件    |

# Loader和Plugin

loader从字面的意思理解，是 加载 的意思。 由于webpack 本身只能打包commonjs规范的js文件，所以，针对css，图片等格式的文件没法打包，就需要引入第三方的模块进行打包。loader虽然是扩展了 webpack ，但是它只专注于转化文件（transform）这一个领域，完成压缩，打包，语言翻译。他的作用只是打包。运行在打包文件之前（loader为在模块加载时的预处理文件） 

plugin完成的是loader不能完成的功能，是为了扩展webpack的功能，但是 plugin 是作用于webpack本身上的。而且plugin不仅只局限在打包，资源的加载上，它的功能要更加丰富。从打包优化和压缩，到重新定义环境变量，功能强大到可以用来处理各种各样的任务。在整个编译周期都起作用。 

# 优化

### 持久化缓存

```javascript
cache:{"type":"filesystem"}//使用文件而非内存进行缓存
```

### 选择合理的sourcemap

- 建议在开发环境使用eval-cheap-module-source-map，内联sourcemap，减少构建时间。
- 建议在生产环境使用source-map，生成专门的.map.js文件，一般来讲根据具体需求删除或者移动sourcemap文件，增加代码被反编译的难度

### 优化监视

```javascript
watchOptions:{"ignored":"/node_modules/"}
//不监视node_modules
```

### 开发时使用style-loader

主要是 MiniCssExtractPlugin对于热更新HMR支持的不是很好 

### resolve优化

- resolve:{extensions:  ['.js', '.json', '.wasm']}, 如此使用，使用以js、json、wasm扩展名文件时可以不加扩展名，会自动从左到右查找
- resolve: {     modules: [**resolve**('src'), 'node_modules'],  }, 告知解析模块时要查找的目录

### externals

externals，在html里面配好CDN引用，然后定义  externals: {    jquery: 'jQuery',  }, 就可以直接使用

### 指定目录和noParse

```javascript
  module: { 
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/i,
        include: resolve('src'),
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ]
      },
      // ...
    ]
  }
```

### 多线程

> 在小型项目中，开启多进程打包反而会增加时间成本，因为启动进程和进程间通信都会有一定开销。 

```shell
npm i -D  thread-loader
```

```javascript
const config = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'thread-loader', // 开启多进程打包
            options: {
              worker: 3,
            }
          },
        ]
      },
    ]
  }
};
```

### 代码压缩

```javascript
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssWebpackPlugin = require('purgecss-webpack-plugin')

const config = {
  optimization: {
    minimize: true, // 开启最小化
    minimizer: [
		new TerserPlugin({})//JS压缩
 		new OptimizeCssAssetsPlugin({}),//CSS压缩
    ]
  },
	plugins:[ // 配置插件
    new PurgecssPlugin({
		paths: glob.sync(`${PATHS.src}/**/*`, {nodir: true})//清楚无用CSS
    }),
  ]
}
```

### 树摇

- webpack 默认支持，需要在 .bablerc 里面设置 model：false，即可在生产环境下默认开启

```javascript
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        module: false,
        useBuiltIns: "entry",
        corejs: "3.9.1",
        targets: {
          chrome: "58",
          ie: "11",
        },
      },
    ],
  ],
  plugins: [    
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ]
};
```

### 代码分割，就是多个打包入口

    entry: {
        index:'./src/js/index.js',
        test:'./src/js/test.js'
    },
### 懒加载、预加载、预获取

属于代码层而非配置层优化

### SplitChunks插件

提取或分离代码的插件，主要作用是提取公共代码，减少代码被重复打包，拆分过大的js文件，合并零散的js文件 

# 基本原理

### 三个阶段

- 初始化
  - 读取参数
  - 创建编译器对象
  - 初始化编译环境，注册插件、模块等
  - 开始编译
  - 确定入口文件
- 构建
  -  根据 `entry` 对应的 `dependence` 创建 `module` 对象，调用 `loader` 将模块转译为标准 JS 内容，调用 JS 解释器将内容转换为 AST 对象，从中找出该模块依赖的模块，再 递归 本步骤直到所有入口依赖的文件都经过了本步骤处理 
  - 上一步递归处理所有能触达到的模块后，得到了每个模块被翻译后的内容以及它们之间的依赖关系图
- 生成阶段
  -  根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 `Chunk`，再把每个 `Chunk` 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会 
  - 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统 

### 初始化

1. 将 `process.args + webpack.config.js` 合并成用户配置
2. 调用 `validateSchema` 校验配置
3. 调用 `getNormalizedWebpackOptions + applyWebpackOptionsBaseDefaults` 合并出最终配置
4. 创建 `compiler` 对象
5. 遍历用户定义的 `plugins` 集合，执行插件的 `apply` 方法
6. 调用 `new WebpackOptionsApply().process` ，加载各种内置插件

### 构建

 **module => ast => dependences => module** 

- 调用 `handleModuleCreate` ，根据文件类型构建 `module` 子类
- 调用 loader-runner仓库的 `runLoaders` 转译 `module` 内容，通常是从各类资源类型转译为 JavaScript 文本
- 调用acorn将 JS 文本解析为AST
- 遍历 AST，触发各种钩子 
  - 在 `HarmonyExportDependencyParserPlugin` 插件监听 `exportImportSpecifier` 钩子，解读 JS 文本对应的资源依赖
  - 调用 `module` 对象的 `addDependency` 将依赖对象加入到 `module` 依赖列表中

- AST 遍历完毕后，调用 `module.handleParseResult` 处理模块依赖

- 对于 `module` 新增的依赖，调用 `handleModuleCreate` ，控制流回到第一步

- 所有依赖都解析完毕后，构建阶段结束

### 生成

构建阶段围绕 `module` 展开，生成阶段则围绕 `chunks` 展开。经过构建阶段之后，webpack 得到足够的模块内容与模块关系信息，接下来开始生成最终资源了。 

1. 构建本次编译的 `ChunkGraph` 对象；
2. 遍历 `compilation.modules` 集合，将 `module` 按 `entry/动态引入` 的规则分配给不同的 `Chunk` 对象；
3. `compilation.modules` 集合遍历完毕后，得到完整的 `chunks` 集合对象，调用 `createXxxAssets` 方法
4. `createXxxAssets` 遍历 `module/chunk` ，调用 `compilation.emitAssets` 方法将资 `assets` 信息记录到 `compilation.assets` 对象中
5. 触发 `seal` 回调，控制流回到 `compiler` 对象

这一步的关键逻辑是将 `module` 按规则组织成 `chunks` ，webpack 内置的 `chunk` 封装规则比较简单：

- `entry` 及 entry 触达到的模块，组合成一个 `chunk`
- 使用动态引入语句引入的模块，各自组合成一个 `chunk`

经过构建阶段后，`compilation` 会获知资源模块的内容与依赖关系，也就知道“输入”是什么；而经过 `seal` 阶段处理后， `compilation` 则获知资源输出的图谱，也就是知道怎么“输出”：哪些模块跟那些模块“绑定”在一起输出到哪里。

### devServer

其实就是借助Express开启一个服务器，然后设置两个路由出口：

1. 静态资源出口：可以通过devServer的字段contentBase或statis设置静态资源目录
2. webpack output的出口：默认是`/`，可以通过devServer的字段`publicPath`设置

webpack output其实就是Express的一个router对象，webpack根据入口文件观察相关的文件，并在它们发生变化的时候，重新编译打包，并输出到router对象上，这样我们就可以访问该router拿到最新的资源，不过这个资源是放在内存上的，并不是文件系统上。

### HMR为什么快

- webpack-dev-server会创建两个服务：提供静态资源的服务（express）和Socket（net.Socket）
- Express Server负责直接提供静态资源服务（打包后的资源直接被浏览器请求和解析）
- Socket Server是一个socket长连接，服务器可以直接发送文件到客户端
- 当服务期间听到对应模块发上变化时，会生成两个文件.json（manifest文件）和.js文件（update chunk）客户端基于hmr runtime来进行更新。
- HMR的核心就是客户端从服务端拉取更新后的资源,更准确的说法就是 HMR卡去的不是整个资源文件,而是 chunk diff,即 chunk 需要更新的部分 

### 自定义的loader和plugin

#### loader

在根配置下写名loader查找路径

```javascript
resolveLoader: {
  modules: ['node_modules', './src/loaders']
},
```

```javascript
module.exports = function (source) {
    const options = this.getOptions();
    return source.replace('xiong ling', options.name);
    //这就是一个简易的loader，他的作用是替换xiong ling为loader使用处options的name字符串
    //当然，如果有异步操作，不要return，而是调用this.callback(null,result)
}
```

#### plugin

- 一个 JavaScript 命名函数或 JavaScript 类(所以我们的插件都是new出来的)。
- 在插件函数的 prototype 上定义一个 `apply` 方法。
- 在`apply`中可以绑定一个webpack的时间钩子，然后再钩子中执行我们的需求

这个 `apply` 方法在安装插件时，会被 webpack compiler 调用一次。`apply` 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。

```javascript
class FileList {
    static defaultOptions = {
        outputFile: 'assets.md',
    };

    constructor(options = {}) {
        // 可以接收自定义的options，如文件名等，进行合并
        this.options = { ...FileList.defaultOptions, ...options };
    }
    apply(compiler) {
      // 在 emit 钩子里执行，他是异步钩子，所以我们需要使用tapAsync来注册，并且必须调用cb函数
        compiler.hooks.emit.tapAsync('FileList', (compilation, cb) => {
            const fileListName = this.options.outputFile;
            // compilation.assets有我们所有的资源文件
            let len = Object.keys(compilation.assets).length;
            // 
            let content = `# 一共有${len}个文件\n\n`;
            // 遍历资源文件，获取name进行拼接
            for (let filename in compilation.assets) {
                content += `- ${filename}\n`
            }
             // 在compilation.assets这资源对象中新添加一个名为fileListName的文件
            compilation.assets[fileListName] = {
                // 文件内容
                source: function () {
                    return content;
                },
                // 文件的长度
                size: function () {
                    return content.length;
                }
            }
            cb()
        })
    }
}

module.exports = FileList;
```

