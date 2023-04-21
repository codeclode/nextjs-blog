---
title: "vite+git"
date: "2023-01-20"
---

# 优秀之处

- dev模式下使用esbuild预构建，esbuild使用go编写，速度快

- build用的是rollup

- Vite不会遍历整个应用程序，只是转换当时正在使用的文件/模块（屏幕上没有就不构建）。 

- Vite 以原生 ESM 方式提供源码（压根就没有打包）。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。 

  ```html
  <script type="module" src="xxx">
  	import xxx from 'xxx'
  </script>
  ```

- 支持了动态模块热替换，vite的HMR 是在原生 ESM 上执行的。  当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活（大多数时候只是模块本身），使得无论应用大小如何，HMR 始终能保持快速更新。 

- 同时利用 HTTP 头来加速整个页面的重新加载 ，使用强缓存

# 使用

### 开始

```shel
npm i vite@latest
npm create vite@latest projectname --template xxx
或者
npm create vite@latest
//接下来按照指引操作
```

### Vue支持

- vue3：@vitejs/plugin-vue
- vue3 JSX :@vitejs/plugin-vue-jsx
- vue2.7 :@vitejs/vite-plugin-vue2

### JSX

 如果不是在 React 或 Vue 中使用 JSX，自定义的 jsxFactory 和 jsxFragment 可以使用 esbuild 选项进行配置。例如对 Preact： 

```javascript
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})

```

### CSS

Vite 也同时提供了对 `.scss`, `.sass`, `.less`, `.styl` 和 `.stylus` 文件的内置支持。没有必要为它们安装特定的 Vite 插件，但必须安装相应的预处理器依赖： 

```shel
# .scss and .sass
npm add -D sass

# .less
npm add -D less

# .styl and .stylus
npm add -D stylus
```

### 静态资源

 导入一个静态资源会返回解析后的 URL： 

```javascript
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

json则是直接导入一个对象，甚至可以解构导入

当然，如果某些资源不被源码引用，或要保持文件名，那么应该放在public中，无需引入，直接通过/根路径就可以访问

### 命令行

- 开启服务器vite
- 构建vite build
- 预构建依赖vite optimize
- vite preview 预览构建产物

### 环境变量

- 通过import.meta.env.xxx获取

- 几个内置的

  - MODE 应用运行的模式
  - BASE_URL部署应用时的基本url
  - PROD是否为生产环境
  - DEV是否为生产模式
  - SSR是否运行在server上

- .env

  - ```javascript
    .env                # 所有情况下都会加载
    .env.local          # 所有情况下都会加载，但会被 git 忽略
    .env.[mode]         # 只在指定模式下加载
    .env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
    ```

# 配置

配置文件是vite.config.js

```javascript
/** @type {import('vite').UserConfig} 用来提示*/
export default {
  // ...
}
//或
import { defineConfig } from 'vite'

export default defineConfig({//这样也可以有提示
  // ...
})
```

### 几个常用插件

- vite-plugin-compression（压缩成gzip格式，配合nginx） 
- unplugin-auto-import自动导入
- unplugin-vue-components导入vue组件 

### 选项

```typescript
type config={
    root:string;//项目根目录
    base:string;//开发或生产环境服务的公共基础路径。默认是/
    mode:string;//指定环境development、production
    define:Record<string,string>//定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换。
    plugins:(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[];//使用插件
	publicDir:string|false//默认public，静态资源服务的文件夹，如果是 false 可以关闭此项功能。
	cacheDir:string//见名之意
    resolve:{
        alias//参考webpack的别名属性alias
        dedupe:string[]//使用此选项强制 Vite 始终将列出的依赖项解析为同一副本（从项目根目录）。
        extensions:string[]//导入时可以忽略的拓展名
    }
	css:{
        modules:CSSModulesOption//css模块化的行为
        postcss:string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })//内联的 PostCSS 配置或者一个（默认基于项目根目录的）自定义的 PostCSS 配置路径。
        devSourcemap:boolean//在开发过程中是否启用 sourcemap。
    }
    json:{
        namedExports:boolean//默认true，是否支持json按名导入
        stringify:boolean//若设置为 true，导入的 JSON 会被转换为 export default JSON.parse("...")，这样会比转译成对象字面量性能更好，尤其是当 JSON 文件较大的时候。会禁用按名导入。
    }
	assetsInclude:string | RegExp | (string | RegExp)[]//指定额外的 picomatch 模式 作为静态资源处理.
	assetsDir:"assets"//默认asstes,指定生成静态资源的存放目录。
	logLevel:'info' | 'warn' | 'error' | 'silent'//控制台输出级别
	envDir//如其名
    envPrefix:string|string[]//以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中。默认VITE_
	server: {
   	 host: true, // 监听所有地址
   	 proxy: {
		'api':{
            target: 'http://jsonplaceholder.typicode.com',
    	    changeOrigin: true,
    	    rewrite: (path) => path.replace(/api/, '')
        }
	}
}
```

# rollup

Rollup对于代码的Tree-shaking和ES6模块有着算法优势上的支持，项目只需要打包出一个简单的bundle包，并是基于ES6模块开发的，使用Rollup，rollup并不支持类似 HRM 特性，仅仅是ESM的打包器。

# 补一下git

[在线练习](https://learngitbranching.js.org/?locale=zh_CN&NODEMO=)

### 四个工作区

- workspace：工作区，目前你的改动都在这里，开发也是在这里
- Index|stage：暂存区，进行add后就会存入暂存区
- Repository：本地仓库，commit之后暂存区内容入仓
- Remote|origin，远程仓，本地仓库push后推到远程

### 基本操作

```shell
git add xxx
#添加xxx文件到暂存区，可以加多个文件
git add . 
#所有更改的文件都添加到暂存区

git commit
#提交暂存的更改，会新开编辑器进行编辑
git commit -m "you message"
# 提交暂存的更改，并记录下备注
git commit -am
# 等同于 git add . && git commit -m

git pull <远程主机名> <远程分支名>:<本地分支名>
# 从远程仓库拉取代码并合并到本地，可简写为 git pull 等同于 git fetch && git merge
git pull --rebase <远程主机名> <远程分支名>:<本地分支名>
#等同于 git fetch && git reabse

git fetch <远程主机名> <分支名>|--all
## 获取远程仓库特定分支的更新，但是不会合并

git merge 
#会让2个分支的提交按照提交时间进行排序，并且会把最新的2个commit合并成一个commit。最后的分支树呈现非线性的结构
git reabse 
#将dev的当前提交复制到master的最新提交之后，会形成一个线性的分支树
```

### 文件状态

```shell
git status
git reflog
git log
```

- changes not staged for commit
  - 工作区有内容，但是缓存区没有
- changes to be committed
  - 文件放在缓存区了 
- nothing to commit
  - 可以扔远端了

### 配置

```shell
git config --list
#列出当前配置
git config --local --list
#列出Repository配置
git config --global --list
#全局配置
git config --system --list
#系统配置
git config --global user.name "your name"
#用户名配置
git config --global user.email "youremail@github.com"
#用户邮箱
```

### 分支管理

```shell
git branch
#查看本地分支
git branch <branch-name>
#新建一个分支但不切换
git branch -r
#查看远程分支
git branch -a
#查看所有分支
git branch --merged
#查看已合并分支
git branch --no-merged
#查看未合并分支
git branch -v
#常看各个分支最后一个提交对象的信息
git branch -m <oldbranck-name> <newbranch-name>
#重命名分支
git branch -d dev
#删除dev分支
git checkout <branch-name>
#切换到其他分支
git checkout -b <branch-name>
#从当前分支创建并切换到新建分支
git checkout -b remote/hotfix	
#拉取远端分支
git checkout -b temp origin/user1 
#拉取远端的user1分支作为本地的temp分支
git merge
#merge会形成树形的结构，小分支直接和主干最后一个commit合并为新的结点
git rebase
#rebase则会把小分支嫁接到分支前面那个点上，相当于断开主干的新结点，用小分支链接，最后把断掉的那一段主干利用小分支的更改刷新成新主干，然后接到小分支连接后的主干上。
git push origin -d <branch-name>
#删除远程分支
git cherry-pick <hash>
#指定一个后边的提交，复制这个提交用来从当前开启一个新分支
```

### 撤销

```shell
git reflog
#查看所有可用的历史版本记录（实际是HEAD变更记录），包含被回退的记录
git restore --staged [filename]
#撤销暂存区
git checkout .|[filename]
#撤销工作区修改
git reset HEAD
#暂存区文件撤销，不会覆盖工作区
git reset --(soft|mixed|hard)<HEAD~(num)>
git revert [commit]
#撤销一个提交，会用一个新的提交（原提交的逆向操作）来完成撤销操作，如果已push则重新push即可
#可以理解为创建了一个状态副本并commit成这个状态
```

**HEAD 说明：**

- HEAD表示当前版本
- HEAD^上一个版本
- HEAD^^上上一个版本
- HEAD^^^上上上一个版本

可以使用~数字表示

- HEAD~0表示当前版本
- HEAD~1上一个版本
- HEAD~2上上一个版本
- HEAD~3上上上一个版本
- 以此类推...

三个参数

- --hard 回退全部，包括HEAD，index，working space
- --mixed回退部分,包括HEAD，index
- --soft只回退HEAD

### 文件暂存

```shell
git stash save -a "message"
#添加改动到stash
git stash drop <stash@{ID}>
#删除缓存
git stash list
#常看stash列表
git stash clear
#删除全部缓存
git stash pop <stash@{ID}>
#恢复改动
git stash show
#展现最新保存的stash和当前⽬录的差异
```

### 差异

```shell
git diff
#比较工作区和缓存区
git diff --cached
#比较缓存区与本地库最近一次commit内容
git diff HEAD
#比较工作区和本地最近一次commit内容
git diff <commit ID><commit ID>
#比较两个commit的差异
```

### 基本流程

```shell
git init
#初始化本地
git remote add origin 
#链接本地仓库与远端仓库
ssh-keygen -t rsa -C "这里换上你的邮箱"
#生产ssh密钥
cd ~/.ssh
#里面有一个文件名为id_rsa.pub,把里面的内容复制到git库的我的SSHKEYs中
git remote -v
#查看远端仓库信息
git remote rename old new
#重命名
git add .
git commit -m "some message"
git push <远程主机名> <本地分支名>:<远程分支名>
git branch
git checkout 
#git checkout -b删除
```

### 远程操作

|               指令                |                           meaning                            |
| :-------------------------------: | :----------------------------------------------------------: |
|          git clone 地址           |                             克隆                             |
|           git remote -v           |           查看所有远程仓库，不带参数`-v`只显示名称           |
|     git remote show [remote]      |                    显示某个远程仓库的信息                    |
|    git remote add [name] [url]    |                 增加一个新的远程仓库，并命名                 |
|   git remote rename [old] [new]   |                       修改远程仓库名称                       |
|  **git pull [remote] [branch]**   |             取回远程仓库的变化，并与本地版本合并             |
|           **git pull**            |                              -                               |
|        git fetch [remote]         |        获取远程仓库的所有变动到本地仓库，不会自动合并        |
|          **git push** -u          | 推送当前分支参数–u,表示与远程分支建立关联，第一次执行的时候用，后面就不需要了 |
| git push [remote] [branch]\|-all? | 推送本地当前分支到远程仓库的指定分支,-all的话会推送所有分支  |

