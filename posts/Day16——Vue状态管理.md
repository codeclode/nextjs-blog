---
title: "VUE状态管理"
date: "2023-01-25"
---

# Vuex

## 开始

和router一样，使用createxxx+app.use

```javascript
const store = createStore({
    state(){
        return {
            count:0
        }
    },
    mutations:{
        increment(state){
            state.count++;
        }
    }
})
app.use(store)
//在组件中
this.$store.commit('increment')
console.log(this.$store.state.count)
//如果是组合式api，使用const store = useStore()
```

## state

如何在组件中使用

```javascript
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count//给他绑定一个计算属性
    }
  }
}
```

mapState

```javascript
computed: mapState({
  count: state => state.count,
  // 传字符串参数 'count' 等同于 `state => state.count`
  countAlias: 'count',//这意味着countAlias也是state.count

  // 为了能够使用 `this` 获取局部状态，必须使用常规函数
  countPlusLocalState (state) {
  return state.count + this.localCount
}
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])//如果都要同名也可以直接这样
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // 展开运算符混入本地计算属性
  })
}
```

## Getter

```javascript
const store = createStore({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos (state) {
      return state.todos.filter(todo => todo.done)
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }//高阶函数的形式
  }
})
//在组件中访问
this.$store.getters.doneTodos
this.$store.getters.getTodoById(2)
...mapGetters({//也有映射函数
  doneCount: 'doneTodosCount'
})
```

## 同步事务Mutation

```javascript
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state,n) {
      // 变更状态
      state.count+=n
    }
  }
})
//组件调用
this.$store.commit('increment',1)
//也可以对象式调用
this.$store.commit({
    type:'increment',
    n:10
})
mutations:{
  increment(state,payload){
    state.count += payload.n
  }
}

//组件中可以使用mapMutations映射到methods，参数是字符串数组或别名对象
```

## 异步任务Action

异步的进行commit任务

```javascript
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {//context有除了actions的其他部件
      context.commit('increment')
    },
    incrementAsync ({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  }
})
//组件里调用
store.dispatch('incrementAsync', {
  amount: 10
})
// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

也有对应的mapActions映射到methods，用法和mapMutations一样

## 模块化

```javascript
moduleA={
    //里边有前面四个东西
}
moduleB={
    //里边有前面四个东西
}
const store =  createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})
//使用
store.state.a
```

局部状态

```javascript
mutations: {
  increment (state) {
    // 这里的 `state` 对象是模块的局部状态
    state.count++
  }
},
actions: {
  incrementIfOddOnRootSum ({ state, commit, rootState }) {
    if ((state.count + rootState.count) % 2 === 1) {
      commit('increment')
    }
  }
}
getters:{
    g(state,getters,rootState){
        //xxx
    }
}
```

namespace:默认情况下，模块内部的 action 和 mutation 仍然是注册在全局命名空间的——这样使得多个模块能够对同一个 action 或 mutation 作出响应。 加入namespace:true可以隔离模块。

模块里可以嵌套模块

```javascript
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,
      actions: {
        someAction: {
          root: true,//在命名空间里注册全局action
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

映射函数

```javascript
computed: {
  ...mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  }),
  ...mapGetters([
    'some/nested/module/someGetter', // -> this['some/nested/module/someGetter']
    'some/nested/module/someOtherGetter', // -> this['some/nested/module/someOtherGetter']
  ])
},
methods: {
  ...mapActions([
    'some/nested/module/foo', // -> this['some/nested/module/foo']()
    'some/nested/module/bar' // -> this['some/nested/module/bar']()
  ])
}
```

为了减少麻烦，可以使用映射函数的另一种形式

```javascript
computed: {
  ...mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  }),
  ...mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},
methods: {
  ...mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ])
}
```

或者从另一个地方获得映射函数

```javascript
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')
//接下来向以前一样使用映射函数
```

# Pinia

## 开始

和Vuex一样

```javascript
const pinia = createPinia()
app.use(pinia)
//和vuex不同的是，app.use(pinia)类似赋能app使得可以使用hook得到定义的store、state、action、getter
//没有$store了，请自己引入store
```

## store

与vuex不同，store自身通过defineStore定义，在组件中直接引入即可。

```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
//也可以使用setup语法
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(()=>{
      return count.value*2
  })
  function increment() {
    count.value++
  }

  return { count, increment,double }
})
```

使用

```javascript
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
export default {
  setup() {
    const store = useCounterStore()
    const { name, doubleCount } = storeToRefs(store)
	//注意，store是一个reactive对象，不要解构赋值它
    //如果希望保持响应式，使用storeToRefs方法
    
    return {
      // 为了能在模板中使用它，你可以返回整个 Store 实例。
      store,name,doubleCount
    }
  },
}
```

## State

state的定义在开始里已经给出

对state的操作

```javascript
const store = useStore()
store.count++//可以直接读写
store.$reset()//重置所有store
store.$patch({
    count:store.count+1,
    age:23//一次性变更多个state
})
//也可以是一个函数
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
//订阅，当出现state变更时调用的函数
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'修改的来源
  // 和 cartStore.$id 一样
  mutation.storeId // 'cart'
  // 只有 mutation.type === 'patch object'的情况下才可用
  mutation.payload // 传递给 cartStore.$patch() 的补丁对象。

  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('cart', JSON.stringify(state))
},{detached: true })//表示在组件卸载后依旧保留它们

//映射到
computed: {
  // 可以访问组件中的 this.count
  // 与从 store.count 中读取的数据相同
  ...mapState(useCounterStore, ['count'])
  // 与上述相同，但将其注册为 this.myOwnName
  ...mapState(useCounterStore, {
    myOwnName: 'count',
    // 你也可以写一个函数来获得对 store 的访问权
    double: store => store.count * 2,
    // 它可以访问 `this`，但它没有标注类型...
    magicValue(store) {
      return store.someGetter + this.count + this.double
   },
  }),
},
```

## Getter

```javascript
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 类型是自动推断出来的，因为我们没有使用 `this`
    doubleCount: (state) => state.count * 2,
    // 可以用 this 来引用 getter
    doubleCountPlusOne() {
      return this.doubleCount + 1//访问其他getter
    },
  },
})
//使用和State一样的mapState方法映射getters，注意二者统一方法
```

## Action

action的定义和vuex基本一致

访问

```javascript
export default {
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('New Count:', this.counterStore.count)
    },
  }
}
//如果没有setup，就使用mapAction，方法类似mapState
```

订阅

```javascript
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    /*同步代码在action之前执行*/

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      /*...*/
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      /*...*/
    })
  },true//true意味着在组件卸载后依旧保留它们
)

// 手动删除监听器
unsubscribe()
```

# Nuxt

## 开始

```shell
npx nuxi init <name>
npm i 
#新建项目并安装依赖
```

## 页面

- 在pages目录下的文件都会根据文件路径生成一个对应页面
- 如果是\[id\].vue类型的，生成动态页面，且可以利用useRoute()的route.params.id获取路由参数
- layouts目录下的default.vue会作为默认的布局囊括页面到slot中
- 和vue一样的components定义组件

## 资源

- public下的文件->'/nuxt.png'
- assets下的文件->'~/assets/nuxt.png'
- 公共资源放public而非assets

## 路由中间件

在middleware文件夹下定义auth.ts文件

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  console.log("auth");
});
```

在需要验证的页面下

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
<template>
  <h1>Welcome to your dashboard</h1>
</template>
```

## SEO

总设置,nuxt.config.ts

```typescript
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=500, initial-scale=1",
      meta: [{ name: "description", content: "My amazing site." }],
    },
  },
});
```

单个页面配置

```vue
<script setup lang="ts">
useHead({//useHead可以是响应式的参数
  title: 'My App',
  /*titleTemplate:(titleChunk) => {
      return titleChunk ? `${titleChunk} - Site Title` : 'Site Title*/
    }
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  },
  script: [ { children: 'console.log(\'Hello world\')' },
            { src:"jssrc",body:true}],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
      crossorigin: ''
    }
  ]
})
</script>
```

也可以直接写在template里

```vue
<script setup>
const title = ref('Hello World')
</script>
<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
      <Style type="text/css" children="body { background-color: green; }" />
    </Head>
    <h1>{{ title }}</h1>
  </div>
</template>
```

## 数据获取

>  useFetch、useLazyFetch、useAsyncData、useLazyAsyncData都只能在setup或者生命周期钩子里使用

### useFetch

```vue
<script setup>
const { data: count } = await useFetch('/api/count')
//获得数据后在跳转导航
</script>
<template>
  Page visits: {{ count }}
</template>
```

### useLazyFetch

```vue
<template>
  <!-- you will need to handle a loading state -->
  <div v-if="pending">
    Loading ...
  </div>
  <div v-else>
    <div v-for="post in posts">
      <!-- do something -->
    </div>
  </div>
</template>
<script setup>
const { pending, data: posts } = useLazyFetch('/api/posts')
watch(posts, (newPosts) => {
  // 刚导航进来的时候data啥也没有
  // 知道得到了数据pending=false,才有了数据
  // 当然我们可以监听posts及时进行修改
})
</script>
```

### useAsyncFetch

```vue
<script setup>
const { data } = await useAsyncData('count', () => $fetch('/api/count'))//工厂函数，可以有比useFetch更加复杂的逻辑
</script>
<template>
  Page visits: {{ data }}
</template>
```

### useLazyAsyncData

就是lazyFetch+AsyncFetch

### 刷新

useFetch返回的对象里有一个refresh用来重新获得数据

```vue
<script setup>
const page = ref(1);
const { data: users, pending, refresh, error } = await useFetch(() => `users?page=${page.value}&take=6`, { baseURL: config.API_BASE_URL }
);
function previous() {
  page.value--;
  refresh();
}
function next() {
  page.value++;
  refresh();
}
</script>
```

## 统一状态管理

nuxt特有的useState()
```vue
<script setup>
const counter = useState('counter', () => Math.round(Math.random() * 1000))
</script>

<template>
  <div>
    Counter: {{ counter }}
    <button @click="counter++">
      +
    </button>
    <button @click="counter--">
      -
    </button>
  </div>
</template>
```

共享状态，在composables文件夹下面定义状态文件

```typescript
export const useCounter = () => useState<number>('counter', () => 0)
export const useColor = () => useState<string>('color', () => 'pink')
```

```vue
<script setup>
const color = useColor() // Same as useState('color')
</script>
<template>
  <p>Current color: {{ color }}</p>
</template>
```

## 错误处理

和app.vue平级的error.vue

```vue
<template>
  <button @click="handleError">Clear errors</button>
  {{ err }}
</template>
<script setup>
const props = defineProps({
  error: Object
})
const err = useError();
const handleError = () => clearError({ redirect: '/' })
</script>
```

