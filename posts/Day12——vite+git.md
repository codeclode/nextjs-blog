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
- vite-plugin-esbuild使用esbuild打包而非rollup

### 选项

```typescript
type config={
    build:{
        target:string[]//需要兼容的浏览器版本
        outDir:string//结果路径
        assetsDir:string//静态资源打包路径
        assetsInlineLimit:number//xxkb为界限使用base64
        sourcemap:boolean | 'inline' | 'hidden'//'hidden' 的工作原理与 true 相似，只是 bundle 文件中相应的注释将不被保留。
        lib:{
            entry: string | string[] | {
                [entryAlias: string]: string 
            }, 
            name?: string, 
            formats?: ('es' | 'cjs' | 'umd' | 'iife')[],
            fileName?: string | ((format: ModuleFormat, entryName: string) => string)
        }
    }
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
    appType:'spa' | 'mpa' | 'custom'//应用类型,mpa是使用了html中间件的多页面应用
	server: {
        hmr:true,
   	    host: true, // 监听所有地址，
   	    proxy: {
		    'api':{
                target: 'http://jsonplaceholder.typicode.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/api/, '')
            }    
	    },
        watch: {
            ignored: ['!**/node_modules/your-package-name/**'],
        },
        cors:true//运行所有访问源,这个东西和Access-controle-allow-origin一样
    }
}
```

# rollup

Rollup对于代码的Tree-shaking和ES6模块有着算法优势上的支持，项目只需要打包出一个简单的bundle包，并是基于ES6模块开发的，使用Rollup，rollup并不支持类似 HRM 特性，仅仅是ESM的打包器。rollup的目的是让ESM一统天下，减少webpack为了兼容cjs搞得无用垫片。

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
git merge <slave>
#merge会形成树形的结构，小分支直接和主干最后一个commit合并为新的结点,在主分支下merge slave
git rebase <master>
#rebase则会把小分支嫁接到分支前面那个点上，相当于断开主干的新结点，用小分支链接，最后把断掉的那一段主干利用小分支的更改刷新成新主干，然后接到小分支连接后的主干上。注意，在辅分支下rebase master,此时主干头节点不变，但分支头节点变成了主干的尾部结点
git push origin -d <branch-name>
#删除远程分支
git cherry-pick <hash>
#指定一个后边的提交，复制这个提交用来改变当前分支走向，只不过从原来的HEAD结点的下一个提交变成了hash的副本结点，并且hash副本结点变成了最新提交，这样可以实现摘除一些错误的commit且不像reset把错误版本记录在案
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
git stash apply stash@{ID}
#恢复改动,但此次改动仍然在栈中
git stash pop
#弹栈恢复改动
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

|               指令                |                                    meaning                                    |
| :-------------------------------: | :---------------------------------------------------------------------------: |
|          git clone 地址           |                                     克隆                                      |
|           git remote -v           |                   查看所有远程仓库，不带参数`-v`只显示名称                    |
|     git remote show [remote]      |                            显示某个远程仓库的信息                             |
|    git remote add [name] [url]    |                         增加一个新的远程仓库，并命名                          |
|   git remote rename [old] [new]   |                               修改远程仓库名称                                |
|  **git pull [remote] [branch]**   |                     取回远程仓库的变化，并与本地版本合并                      |
|           **git pull**            |                                       -                                       |
|        git fetch [remote]         |                获取远程仓库的所有变动到本地仓库，不会自动合并                 |
|          **git push** -u          | 推送当前分支参数–u,表示与远程分支建立关联，第一次执行的时候用，后面就不需要了 |
| git push [remote] [branch]\|-all? |          推送本地当前分支到远程仓库的指定分支,-all的话会推送所有分支          |

# 相对安全的Git操作

## 背景

- 因为我在以前一直是一个人干整个组的活，所以永远在master上动代码，git的分支操作完全没有，导致上星期拉代码和提交时搞出了哄堂大笑的操作，因此今天我决定在GitHub上搞个演练场搅和一下git的分支。
- 但是其实本人并不是完全不知道git的分支和远端操作，只是对某些操作和规范处于含糊的状态，也就是这些含糊的状态导致“我和mt面对git命令行，互相不知道对方在干啥”（简称对牛弹琴，我是牛）的情况。
- 为了防止真的因为我的原因导致超级问题，我决定写一下文字备忘，至少有一个相对安全的操作流程。

## 准备工作

- ~~一台能联网的电脑~~
- 一个能稳定登录GitHub的加速器
- 本地的git
- 在GitHub上 new 一个名字叫做git-playground的仓库

## 指令

- git add .
- git commit -m "commit"
- git pull
- git merge
- git push origin 本地:远程
- git branch
- git checkout

## 还算安全的操作

- git clone "https://github.com/xxx/git-playground.git"
- 现在的状态是，本地的任何东西都和远程一样，但是请注意不要混淆本地分支和远程分支，本地分支仅有main
- 现在我们在本地进行改动，commit后push，啥问题没有。
- 现在我们在GitHub网页里新建一个分支test并且修改文件。
- 那么现在我们要如何处理呢，我的策略是首先进行git fetch，然后看一眼branch -r，就看见一个test的分支，为了符合git规范（本地和远程对应），首先跳到这个远程test分支上，然后基于这个分支checkout -b test新建对应的本地分支。
- 当然，在这个分支上的修改，第一次push要push -u origin test:test

## 优化一下

- 刚才的操作，是取缔了像git pull这种fetch+merge一系列自动化操作保证不会出现问题的操作，所以会比较麻烦。

- git branch -u origin/xxx，不push，先绑定好

- 拉代码的时候，不使用fetch而是pull，本地直接和远程合并（我不是很喜欢这样😢）

- 对于远程的新分支，可以git checkout -b newBranch origin/newBranch自动拉取绑定。

- 或者自定义指令，这个指令意思是自动推到远程同名分支上

  ```bash
  git config --global alias.pa "push -u origin HEAD"
  ```

## 问题

> 我一定要在第一次git push -u（或者git branch -u）吗

不一定哦，优化一下那里写了

> 如果我的本地分支和远程分支名称不一致，如何查看关联

```bash
git branch -vv
```

> git checkout origin/xxx

这个指令不会真的切到远程，而是建立一个指向远程分支的HEAD（分离HEAD状态）

>  The upstream branch of your current branch does not match the name of your current branch. 

解决办法有2个
1. 要不采取上面给出的建议，执行 git push origin :dev即可，这是创建了一个新远程分支
2. 可以重新指定与远程同名的分支（推荐这种方式，执行之后以后就可以git push了）
git push -u origin test

## 总结建议

周五临下班因为onesId的问题和mt处理了快10分钟，急死我了，希望工程性能（应该是这个吧，舍友在这个组）搞一个mit|mGit命令行工具🥰

一个测试的网站，缺点是不能模拟远程新建分支：https://learngitbranching.js.org/?locale=zh_CN&NODEMO=

对于各种分支合纵连横的超级大项目，可以下一个sourcetree进行分支可视化（感觉GitLens不如sourcetree。。。直观）

🤮🤮🤮🤮🤮🤮🤮🤮🤮🤮🤮🤮🤮🤮🤮