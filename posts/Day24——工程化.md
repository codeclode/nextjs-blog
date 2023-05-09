---
title: "前端工程化"
date: "2023-04-28"
---

# 规范化

## 代码风格

### esLint

- 下载和初始化

  ```shell
  npm i eslint -D
  ./node_modules/.bin/eslint --init#提供选项并生成.eslintrc.js
  ./node_modules/.bin/eslint fileToCheck.js
  eslint --env browser file.js#指定环境
  eslint . --ext .js,.jsx#检查所有js和jsx文件
  ```

- 配置

  ```json
  {
    "env": {//使用的环境全局变量，有很多，也可以是插件里的东西
      "browser": true,
      "node": true,
      "es2021": true//使用es2021语法＋全局变量（如map、set）
    },
    "globals":{
        "var1":"var1",
        "var2":"var2",
        "Promise":off//禁用Promise全局变量
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
      {
        "files": ["*.md"],//使用a-plugin的markdown解析md文件
        "processor": "a-plugin/markdown"
      }
    ],
    "parser": "@typescript-eslint/parser",
      //指定解释器，这里指定使用TS解释器
    "parserOptions": {
      "ecmaVersion": "latest",//仅使用ecma新规则语法，不使用变量，和env不一样
      "sourceType": "module",//默认script,module支持ESM
    	"ecmaFeatures":{//支持其他ecma特性
          globalReturn:true,
          jsx:true,
      }
    },
    "plugins": [
      "@typescript-eslint"//指定使用的插件
    ],
    "rules": {
      //rule:0->"off",1->"warning",2->"error"
      //rule:["off",opt1,opt2]如果rule有其他配置
      "indent": ["error", 2]//2个单词缩进
      //对于plugin的rule，需要插件名/rule设置
    }
  }
  ```

- 跳过检查

  ```javascript
   /* eslint-disable */ 块注释放在文件顶部，跳过整个文件检查
   /* eslint-disable no-alert */ 取消no-alert规则的检查
  
  alert('foo'); // eslint-disable-line no-alert, quotes, semi
  
  // eslint-disable-next-line
  alert('foo');
  ```

- 继承配置

  ```json
  {
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    "extends":"eslint:recommended",
  }
  ```

- 内置rules:http://eslint.cn/docs/rules/

- ts的内置rules:https://typescript-eslint.io/rules/

### prettier

- 安装

  ```shell
  npm i --D prettier
  ```

- 使用

  ```shell
  npx prettier --write . #格式化一切
  npx prettier --check . #仅检查
  ```

- 忽略 .prettierignore

  ```txt
  # Ignore artifacts:
  build
  coverage
  
  # Ignore all HTML files:
  *.html
  ```

  ```javascript
  // prettier-ignore
  matrix(
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  )
  ```

- 集成到eslint

  ```json
  {
    "plugins": ["prettier"],
    "rules": {
      "prettier/prettier": "error"
    }
  }
  ```

- 配置，类型可以是json、js等，以json为例，配置项比较少，就是为了强制规范

  ```json
  {
    printWidth: 80, //单行长度,超出自动折行
    tabWidth: 2, //缩进长度
    useTabs: false, //使用空格代替tab缩进
    semi: true, //句末使用分号
    singleQuote: true, //使用单引号
    quoteProps: 'as-needed', //仅在必需时为对象的key添加引号
    jsxSingleQuote: true, // jsx中使用单引号
    trailingComma: 'all', //多行时尽可能打印尾随逗号
    bracketSpacing: true, //在对象前后添加空格-eg: { foo: bar }
    jsxBracketSameLine: true, //多属性html标签的‘>’折行放置
    arrowParens: 'always', //单参数箭头函数参数周围使用圆括号-eg: (x) => x
    requirePragma: false, //无需顶部注释即可格式化
    insertPragma: false, //在已被preitter格式化的文件顶部加上标注
    htmlWhitespaceSensitivity: 'ignore', //对HTML全局空白不敏感
    vueIndentScriptAndStyle: false, //不对vue中的script及style标签缩进
    endOfLine: 'lf', //结束行形式
    embeddedLanguageFormatting: 'auto', //对引用代码进行格式化
    "overrides": [//对于某些文件覆盖原配置
      {
        "files": "*.test.js",
        "options": {
          "semi": true
        }
      },
      {
        "files": ["*.html", "legacy/**/*.js"],
        "options": {
          "tabWidth": 4
        }
      }
    ]
  }
  ```

### babel

- babel和代码规范没关系，是用来转译js的

- 配置.babelrc

- babel负责把ES6+语法向下转化，而polyfill则负责手动实现没有的API（一个负责语法，一个负责新API）

  ```json
  {
    "env":"production|development"
    "presets": [
      [
        "@babel/preset-env",//@babel/preset-react,@babel/preset-typescript
        {
          "useBuiltIns": "entry",
          "corejs": "3.22",
      	"targets": 'chrome 30',
        }
      ]
    ],
    plugins:[
      "xxx"
    ],  
    // 下面指的是在生成的文件中，不产生注释
    "comments": false,
  }
  /*先应用 plugin，再应用 preset
  plugin 从前到后，preset 从后到前*/
  /*plugin 是单个转换功能的实现，当 plugin 比较多或者 plugin 的 options 比较多的时候就会导致使用成本升高。这时候可以封装成一个 preset，用户可以通过 preset 来批量引入 plugin 并进行一些配置。preset 就是对 babel 配置的一层封装。*/
  ```

## Git提交规范

- 使用commitizen的git cz代替commit，生成符合规范的提交说明

- 如果要使用Angular的提交规范，下载cz-conventional-changelog使得commitizen按照此规范生成

- ```shell
  npm i -g commitizen cz-conventional-changelog
  ```

- 修改配置目录的.czrc文件中的path字段为"cz-conventional-changelog"

- 当然也可以在局部部署使用

- commitlint：局部使用，通过它来检验提交是否符合规范

- ```shell
  npm i -D @commitlint/cli @commitlint/config-conventional
  ```

- 配置.commitlintrc.js文件

- ```javascript
  module.exports = {
  	extends: [
  		"@commitlint/config-conventional"
  	],
  	rules: {}
  };
  ```

- 使用husky+lint-staged对新加入暂存区代码进行一下检查，并且规范提交信息 

- ```shell
  npx husky-init
  npm i
  npx husky add .husky/pre-commit 'npx lint-staged'
  #提交前执行
  npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
  #提交后执行
  npx mrm@2 lint-staged --save-dev
  ```

- ```json
  {
    "lint-staged": {
      "*.js": ["eslint --fix"] // 在提交前用 eslint 修复所有 js 文件
    }
  }//package.json文件
  ```

# 自动化

## 执行检验

### Jest

- ```shell
  npm i jest -D
  ```

- ```javascript
  //语法
  function add(a,b){
      return a+b;
  }
  test("测试名",()=>{
      expect(foo(3,3)).toBe(6)
  })
  ```

- ```shell
  npx jest#命令行输入
  ```

- 配置jest

  - ```shell
    npx jest --init
    #会问一些问题
    ```

  - 生成jest.config.js文件，里边有很详细的配置项注释

- 测试覆盖率，如果使用--coverage参数会生成覆盖率coverage文件夹，点击里面的index.html可以看到此次测试对原来的`功能代码`的占比。 

- 如果希望使用esm语法，需要下载babel和babel-jest

- jest匹配器

  - toBe：就是===
  - toEqual：不检查引用而是检查内容是否相等
  - toBeNull|toBeUndefined|toBeDefined
  - toBeTruthy|toBeFalsy
  - .not取反,except(xxx).not.toBe(xxx)
  - toBeGreaterThan|toBeLessThan+(OrEqual)
  - toBeCloseTo浮点数是否接近
  - toMatch匹配字符串或正则
  - toContain，是否包含,[1,2,3].toContain(3)
  - toThrow()是否抛出异常

- 自动测试：npx jest --watchAll

- 钩子函数：对于某些已经封装好的内容，我们希望执行前后测试

- ```javascript
  import Counter from "./index";
  
  let counter = null;
  
  beforeEach(() => {
    counter = new Counter();
  });//在每个测试用例执行之前执行里面的回调函数，如果你需要在测试开始之前对很多个测试做一些重复的工作，比如要初始化状态，你就可以使用它。
  //(before|after)(Each|All),all只执行一次
  test("测试 counter 的 add 方法", () => {
    expect(counter.number).toBe(0);
    counter.add();
    expect(counter.number).toBe(1);
  });
  
  test("测试 counter 的 minus 方法", () => {
    expect(counter.number).toBe(0);
    counter.minus();
    expect(counter.number).toBe(-1);
  });
  ```

- ```javascript
  describe("测试分组2", () => {
    beforeAll(() => {
      console.log("测试分组2 - beforeAll");
    });
    afterAll(() => {
      console.log("测试分组2 - afterAll");
    });
    test("测试", () => {
      console.log("测试分组2 测试");
      expect(1 + 1).toBe(2);
    });
  });
  //describe分组测试，此时钩子只在分组中有效
  ```

### Mock

- 代码入侵，本地写死数据或者请求json

- 接口生成假数据

- 本地搞一个node服务器

- Mock请求拦截

  - ```shell
    npm i mockjs
    ```

  - ```javascript
    var Mock = require('mockjs')
    var data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'list|1-10': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1
        }]
    })
    ```

- 智能mock工具

## CICD

CI->持续集成，负责拉取代码库中的代码后，执行用户预置定义好的操作脚本，通过一系列编译操作构建出一个制品，并将制品推送至到制品库里面。 CD->持续部署和交付，持续交付是将制品库的制品拿出后，部署在测试环境 / 交付给客户提前测试。持续部署 则是将制品部署在生产环境。 

### docker

- 三个概念——镜像，容器，仓库，仓库存镜像，容器是镜像的实例

- 镜像操作

  ```shell
  docker pull imageName#拉取到本地
  docker images #查看本地镜像-a显示历史镜像，-q仅显示id
  docker search #查询镜像 --limit 5 只查看5个
  docker rmi id#删除 -f id1,id2可以删除多个
  ```

- 容器操作

  ```shell
  docker run [options] imageId 
  #-d守卫进程打开，-i交互模式运行，-t分配一个容器终端
  docker ps#-a显示所有，-q只显示活着的编号
  #run进入后
  exit#退出顺手关闭容器
  ctrl+p+q#不关容器退出
  docker start id|name#启动已经停止的容器
  #-p hostPort:containerPort映射端口
  docker restart id|name
  docker stop id|name,docker kill id|name
  #停止或强行停止容器
  docker rm id#删除，-f可以删除多个
  docker exec -it id shell(比如/bin/bash)
  #开启新终端，进入容器指定的命令行，exit不会停止容器
  docker attach id
  #使用原终端，exit会停止容器
  docker run -it --privileged=true -v /宿主机目录:/容器目录:rw image
  #以可读可写的方式映射容器目录到宿主机目录
  ```

- docker文件

  - 编写dockerfile
  - docker build构建新镜像
  - docker run image

### github action

- 这里的CI可以理解为对于分支上的修改经过自动验证以后自动合并到master上
- 在项目.github/workflows中配置ci.yml文件
- on:[触发时机(push,pull_request)]
- jobs:需要执行的流程，比如合并分支，构建发布等等。

# 模块化

## npm发包

```shell
#nrm use npm 切换到官方源
npm login
#输入用户名密码
npm publish
#就可以了！大部分配置在package.json里
```

## monorepo

- 对应multiRepo，即每个项目都对应着一个单独的代码仓库每个项目进行分散管理，这种管理会导致复用问题——一个更新导致所有依赖于它的都需要重新下载

- monorepo就是所有的包放到一个大型仓库里，压缩项目体积（提取公共包）并且减少开发的冗余，缺点就是所有鸡蛋放到一个篮子里。

- leran，就是monorepo的一个工具

  - 两种模式——固定模式，统一版本管理，一个更新全部更新
  - 独立模式，version:"independent"，每个子包独立版本

- ```shell
  lerna create app
  lerna create ui#创建子包
  lerna bootstrap#分析依赖，尽量提升到公共node_modules
  ```

# 组件化

不写，个人习惯问题
