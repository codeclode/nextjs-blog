---
title: "Vue-Router"
date: "2023-01-24"
---

# Vue-Router

## 开始使用

两个标签

```html
<router-link to="/">Go to Home</router-link>
<router-link to="/about">Go to About</router-link>
<router-link :to="{ name: 'user', params: { username: 'erina' }}">User</router-link>
<!--通过传递 `to` 来指定链接 -->
<router-view></router-view>
<!-- 路由匹配到的组件将渲染在这里 -->
```

创建router对象并挂载

```javascript
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes:routes, 
})
app.use(router)
```

## 动态路由以及匹配

```java
routes:[{
    path:"/user/:id?",component:User
}]
//对应的组件通过this.$router.params.id获取甚至监听id变量
//?代表可选
const routes = [
  // /:orderId -> 仅匹配数字
  { path: '/:orderId(\\d+)' },  
  // /:chapters+ ->  匹配 /one, /one/two, /one/two/threes等
  // /:chapters* -> 匹配/,/one,/one/two等
  { path: '/:chapters+' },
  // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
  { path: '/:pathMatch(.*)*', component: NotFound },
  // 将匹配以 `/user-` 开头的所有内容，并将其放在 `$route.params.afterUser` 下
  { path: '/user-:afterUser(.*)', component: UserGeneric },
  
]
//默认不区分大小写，除非定义sensitive:true,默认尾斜线任意，除非定义strict:true
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 将匹配 /users/posva 而非
    // - /users/posva/ 当 strict: true
    // - /Users/posva 当 sensitive: true
    { path: '/users/:id', sensitive: true },
    // 将匹配 /users, /Users, 以及 /users/42 而非 /users/ 或 /users/42/
    { path: '/users/:id?' },
  ]
  strict: true, // applies to all routes
})
```

## 路由嵌套和命名

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    name:"user",
    //这样写就可以在to属性里直接写name:'user'而非一个url路径
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
//根组件和user组件都有一个router-view
```

## 编程式导航

```javascript
const router = this.$router|useRouter()
// 字符串路径
router.push('/users/eduardo')
// 带有路径的对象
router.push({ path: '/users/eduardo',replace:true })
// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })
// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })
// 带 hash，结果是 /about#team
router.replace({ path: '/about', hash: '#team' })
//注意，params和path不能一起使用，会让params失败
router.go(-1)
router.go(1)//类似window.history.go(n)
```

## 命名视图

```html
<router-view class="view left-sidebar" name="LeftSidebar"/>
<router-view class="view main-content"/>
<router-view class="right-sidebar"name="RightSidebar"/>
```

```javascript
const routes=[{
  path: '/',
  components: {
    default: Home,
    // LeftSidebar: LeftSidebar 的缩写
    LeftSidebar,
    // 它们与 `<router-view>` 上的 `name` 属性匹配
    RightSidebar,
  },
  children: [{
    path: 'emails',
    component: UserEmailsSubscriptions
  }, {
    path: 'profile',
    components: {
      default: UserProfile,
      helper: UserProfilePreview
    }
  }]
}]
//这个意思就是，url依然只有一个，是不过router-view可以根据url识别现实不同内容
```

## 重定向和别名

```javascript
const routes = [{path:'/home',redirect:'/'}]
//或者redirect: { name: 'homepage' }
//甚至是方法
/*redirect: to => {
      return {path:'/search',query{q:to.params.searchText}}
    },*/
//相对位置
// 将总是把/users/123/posts重定向到/users/123/profile。
{
    path: '/users/:id/posts',
    redirect: to => {return 'profile'}
}
```

```javascript
//别名alias，访问/不会重定向，但实际上访问的仍然是/home
const routes = [
  {
    path: '/users',
    component: UsersLayout,
    children: [
      // 为这 3 个 URL 呈现 UserList
      // - /users
      // - /users/list
      // - /people
      { path: '', component: UserList, alias: ['/people', 'list'] },
    ],
  },
]
```

## 参数传递props

```javascript
//不适用动态路由而是参数传递
const User = {
  // 请确保添加一个与路由参数完全相同的 prop 名
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const routes = [{ path: '/user/:id', component: User, props: true }]//这是布尔模式，直接把params变成props

const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]//如果是命名视图，必须为每个命名视图定义 props 配置

//对象模式
const routes = [
  {
    path: '/promotion/from-newsletter',
    component: Promotion,
    props: { newsletterPopup: false }//原样设置props
    //props是静态写死在这里的
  }
]
//函数模式
const routes = [
  {
    path: '/search',
    component: SearchUser,
    props: route => ({ query: route.query.q })
  }
]
///search?q=vue 将传递 {query: 'vue'} 作为 props 传给 SearchUser 组件。
```

## 两种历史记录模式

### hash

```javascript
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

在内部传递的实际 URL 之前使用了一个哈希字符（#）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。 

### history模式

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

问题是刷新可能出现问题，需要在服务器里进行特殊配置

## 路由守卫

beforeEach 前置守卫->beforeEnter 独享守卫->beforeRouteEnter 组件守卫->beforeResolve 解析守卫->afterEach 路由后置守卫 

### 全局

```javascript
const router = createRouter({ ... })

router.beforeEach((to, from , next) => {
  // 返回 false 以取消导航
  //to和from在api模块细说
  return false
  //return { name: 'Login' }重定向到登录页
  //return '/login'重定向到登录页
})//导航之前

router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
//解析守卫,在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被正确调用。这类似React-router的loader

router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})//导航以后，一般用来分析等作用
```

### 独享

```javascript
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },//也可以是一个函数数组
  },
]
```

### 组件内

```javascript
const UserDetails = {
  template: `...`,
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` 
    // 因为当守卫执行时，组件实例还没被创建
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
```

## 元信息

```javascript
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // 只有经过身份验证的用户才能创建帖子
        meta: { requiresAuth: true }
      },
      {
        path: ':id',
        component: PostsDetail
        // 任何人都可以阅读文章
        meta: { requiresAuth: false }
      }
    ]
  }
]
//在路由守卫的to\from.meta.requiresAuth获取
```

## 组合式API

```javascript
const router = useRouter()
const route = useRoute()
//routet就是this.$router,route就是this.$route

//只有了俩守卫
onBeforeRouteLeave(cb)
onBeforeRouteUpdate(cb)
```

## link的扩展

```vue
<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ isActive, href, navigate }"//把routerlink里边作用域里的东西提出来
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'AppLink',
  inheritAttrs: false,
  props: {
    ...RouterLink.props,
    inactiveClass: String,
  },

  computed: {
    isExternalLink() {
      return typeof this.to === 'string' && this.to.startsWith('http')
    },
  },
}
</script>
```

```javascript
import { RouterLink, useLink } from 'vue-router'
//组合式API useLink
export default {
  name: 'AppLink',
  props: {
    ...RouterLink.props,
    inactiveClass: String,
  },
  setup(props) {
    // `props` 包含 `to` 和任何其他可以传递给 <router-link> 的 prop
    const { navigate, href, route, isActive, isExactActive } = useLink(props)
    return { isExternalLink }
  },
}
```

## 检测导航故障

```javascript
import { NavigationFailureType, isNavigationFailure } from 'vue-router'
// 试图离开未保存的编辑文本界面
const failure = await router.push('/articles/2')

if (isNavigationFailure(failure,//如果是aborted类型错误
                        NavigationFailureType.aborted)) {
  // 给用户显示一个小通知
  showToast('You have unsaved changes, discard and leave anyway?')
}
else if(failure){
    //其他错误
}else if (router.currentRoute.value.redirectedFrom) {
  //检测重定向
  // redirectedFrom 是解析出的路由地址，就像导航守卫中的 to和 from
}else{
    //没有错误
}
```

## 动态增删改查路由

- router.hasRouter()检测路由是否存在

- router.getRouters()获取一个包含所有路由记录的数组。 

- const removethis = router.addRoute({...})

- 如果是导航守卫环境，router.addRoute(generateRoute(to))

- 切换： 通过添加一个名称冲突的路由。如果添加与现有途径名称相同的途径，会先删除路由，再添加路由 

- 删除：上面的removethis()。如果路由有名字，也可以router.removeRoute('name')

- 
  嵌套：router.addRoute('admin', { path: 'settings', component: AdminSettings })
  

## API

### 内部类

#### Router

- currentRouter 当前路由地址。只读的
- options，创建 Router 时传递的原始配置对象。只读 
- addRouter(name,route:RouteRecordRaw)\\removeRouter(name)
- afterEach((to,from,failure)=>{xxx})
- back()\\forward()\\go(n)类似history
- beforeEach()\\beforeREsolve()：守卫
- getRoutes()：获取所有路由记录的完整列表。 
- hasRouter(name):boolean 确认是否存在指定名称的路由。 
- isReady():Promise\<void\> 当路由器完成初始化导航时，返回一个 Promise，这意味着它已经解析了所有与初始路由相关的异步输入钩子和异步组件。 
- onError(handler: (error: any, to: RouteLocationNormalized, from: RouteLocationNormalized) => any): () => void,router的错误处理程序
- push(to:RouteLocationRaw)|replace(to:RouteLocationRaw)
- resolve(to: RouteLocationRaw): RouteLocation & {href: string}解析

#### RouteRecodeRaw

```typescript
class RouteRecodeRaw = {
    path:string,//路径
    redirect:RouteLocationRaw |(to:RouteLocationNormalized) => RouteLocationRaw,//重定向位置
    children:Array<RouteRecodeRaw>,
    alias:string|string[],//别名
    name:string,
    beforeEnter:NavigationGuard | NavigationGuard[],
    strict:boolean,
    sensitive:boolean,
    meta:Meta,//自己定义的类型
    props:boolean | Record<string, any> | (to: RouteLocationNormalized) => Record<string, any>,
    component|components://重定向就没有componet属性,只有1个router-view就是没有s
}
```

#### RouteLocationRaw

- 一个字符串'/users/profile#content'
- 一个可以标识出唯一路由及其参数的对象

#### RouteRecordNormalized

我们的RouteRecodeRaw经过转换后得到的东西

#### RouteLocationNormalized

路由守卫中to和from以及$route|useRoute() 的类型

- fullPath
- hash
- query
- matched 与给定路由地址匹配的RouteRecordNormalized数组。 
- meta
- name
- params
- path
- redirectedFrom从哪重定向过来的，没有就是undefined

#### RouterOptions

```javascript
createRouter({
  history: createWebHistory(),
  linkActiveClass?:string,//用于激活的 RouterLink 的默认类。如果什么都没提供，则会使用 router-link-active。
  linkExactActiveClass?: string,//用于精准激活的 RouterLink 的默认类。如果什么都没提供，则会使用 router-link-exact-active。
  parseQuery?:(searchQuery: string) => Record<string, (string | null)[] | string | null>,//自定义解析query
  routes: RouteRecordRaw[],
  scrollBehavior,
  stringifyQuery
})
```

### 定义的api

- createRouter({RouterOptions})

- createWebHistory(base:string)base定义路由从哪一个路径开始生效
  比如网站为example.com,base='/folder/',那么从example.com/folder/开始编写路由

- createWebHashHistory(base:string)

- createMemoryHistory(base:string)

- router-link相关

  - props
    - to
    - replace:boolean，使用replace进行导航而不是push
    - active-class,默认全局的options的linkActiveClass
    - custom:boolean,  router-link是否应该将其内容包裹在 a 元素中。  默认情况下，routerlink会将其内容包裹在 a 元素中，即使使用 v-slot 也是如此。传递 custom=true，可以去除这种行为。 
    - exact-active-class
  - v-slot:作用域插槽，暴露href、router、navigate、isActive, isExactActive来方便扩展link

- router-view

  - name：命名视图

  - slot：如果希望配置过度和空状态，route参数是RouteLocationNormalized对象 

    ```html
  <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <keep-alive>
          <suspense>
            <template #default>
              <component
                :is="Component"
                :key="route.meta.usePathKey ? route.path : undefined"
              />
            </template>
            <template #fallback> Loading... </template>
          </suspense>
        </keep-alive>
      </transition>
    </router-view>
    ```


# 原理

通过Vue.mixin()方法，全局注册一个混合，影响注册之后所有创建的每个Vue实例，该混合在beforeCreate钩子中通过Vue.util.defineReactive()定义了响应式的\_route属性。所谓响应式属性，即当_route值改变时，会自动调用Vue实例的render()方法，更新视图。

## 哈希模式

```javascript
HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
        pushHash(route.fullPath);
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
    }, onAbort);
};
function pushHash (path) {    
  window.location.hash = path
}//哈希改变不会向服务器请求
History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

    var route = this.router.match(location, this.current);
    this.confirmTransition(route, function () {
        this$1.updateRoute(route);
        ...
    });
};

History.prototype.updateRoute = function updateRoute (route) {
    var prev = this.current;
    this.current = route;
    this.cb && this.cb(route);
    this.router.afterHooks.forEach(function (hook) {
        hook && hook(route, prev);
    });
};
```

**push调用->pushHash->匹配对应路由->更新路由->_route属性更改->触发render()**

```javascript
setupListeners () {
  window.addEventListener('hashchange', () => {
    if (!ensureSlash()) {
      return
    }
    this.transitionTo(getHash(), route => {
      replaceHash(route.fullPath)
    })
  })
}
//监听地址栏
```

## 历史模式

```javascript
window.history.pushState(stateObject,title,url)
window.history.replaceState(stateObject,title,url)
//HTML5引入了history.pushState()和history.replaceState()方法，他们分别可以添加和修改历史记录条目。这些方法通常与window.onpopstate配合使用。这两个函数会触发popState事件，该事件将携带这个stateObject参数的副本。
//pushState和replaceState两种方法的共同特点：当调用他们修改浏览器历史栈后，虽然当前url改变了，但浏览器不会立即发送请求该url，这就为单页应用前端路由，更新视图但不重新请求页面提供了基础。
```

那么历史模式就和哈希模式没有啥区别，我们只是需要修改方法的一些细节而已。

添加对修改浏览器地址栏URL的监听popstate是直接在构造函数中执行的 

```javascript
window.addEventListener('popstate', e => {
  const current = this.current
  this.transitionTo(getLocation(this.base), route => {
    if (expectScroll) {
      handleScroll(router, route, current, true)
    }
  })
})
```

## Router-Link

默认tag其实就是个a标签，然后阻止点击的默认行为，不让他跳转，然后里边还是调用push或者replace

## Router-View

routerView是一个函数式组件，函数式组件没有data，没有组件实例。因此使用了父组件中的$createElement函数，用以渲染组件（h函数）。 

这玩意借助的是$route的matched属性，这个属性是一个数组，因为router-view有个depth属性用来记录嵌套路由深度，matched[depth]就是这个层次匹配到的组件，router-View直接用h(matched[depth],data,children)用来渲染真正需要的组件。而缓存则基于history.current，看看cache[name]有没有缓存，有就直接读缓存数据渲染。