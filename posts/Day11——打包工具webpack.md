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