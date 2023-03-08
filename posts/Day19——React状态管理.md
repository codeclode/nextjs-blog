---
title: "React状态管理"
date: "2023-01-27"
---

# Redux和RTK

## Redux

redux是最基本的单元，使用的话比较简单和基础

原则有四个：单向数据流、唯一的 store、保持状态只读（只能派发action）、数据改变只能通过纯函数完成 

```javascript
npm install redux -S // 安装

import { createStore } from 'redux' // 引入

const reducer = (state = {count: 0}, action) => {
  switch (action.type){
    case 'INCREASE': return {count: state.count + 1};
    case 'DECREASE': return {count: state.count - 1};
    case 'SET': return {count:action.number}
    default: return state;
  }
}

const actions = {
  increase: () => ({type: 'INCREASE'}),
  decrease: () => ({type: 'DECREASE'},
  set: (num) => ({type:'SET',number:num})
}

const store = createStore(reducer);

store.subscribe(() =>
  console.log(store.getState())
);

store.dispatch(actions.increase()) // {count: 1}
store.dispatch(actions.increase()) // {count: 2}
store.dispatch(actions.set(11)) // {count: 11}
```

## 开始

```shell
#下载简化包和协同包
npm i @reduxjs/toolkit react-redux
```

创建一个store.js

```javascript
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {}
})
```

通过Provide提供store给整个应用

```jsx
import store from './app/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

编写状态切片——状态模块

```javascript
import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
//这个东西是真正用来调用的
export default counterSlice.reducer
```

添加这个切片给store

```javascript
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
export default configureStore({
  reducer: {
    counter: counterReducer
  }
})
```

在应用里使用

```react
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'
export function Counter() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div>
      <div>
        <span>{count}</span>
        <button onClick={() => dispatch(decrement())}>-</button>
      </div>
    </div>
  )
}
```

异步的逻辑和数据获取

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {//不要用reducers是因为我们在createAsyncThunk生成的type名字不知道，而且有异步有3种状态
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
    })
  }
})

export default usersSlice.reducer
```

## 设计理念

- 不可变，引用对象修改副本，在createSlice方法里面，会自动转换数组方法以及对象等号赋值为不可变更新
- 单向数据流，View---dispatch--->action->Reducer->Store---subscribe--->View

## RTKapi连接redux

### store创建

```javascript
const reducer = {
  todos: todosReducer,
  visibility: visibilityReducer,
}

const preloadedState = {
  todos: [{text: 'Eat food',completed: true,},],
  visibilityFilter: 'SHOW_COMPLETED',
}

const debounceNotify = _.debounce(notify => notify());
//整个配置
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
  enhancers: [batchedSubscribe(debounceNotify)],
})//这个函数是redux函数cre、ateStore的抽象
```

### 生成Reducer

在redux里，createStore这样使用

```javascript
import { createStore } from 'redux'

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
  }
}
const store = createStore(todos, ['Use Redux'])//分别是处理函数和初始状态

store.dispatch({
  type: 'ADD_TODO',
  text: 'Read the docs'
})
console.log(store.getState())
// [ 'Use Redux', 'Read the docs' ]
```

而在rtk里，我们在开始章节直到。简单的reducer这样创建和使用

```javascript
export const counterSlice = createSlice({//createSlice生成一个切片方便模块化操作
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      state.value += 1
    },
  }
})
export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer//这个对象用来传给configreStore的reducer选项
dispatch(increment())
```

对于复杂的多状态reducer，需要先createAction

```javascript
const increment = createAction<number>('counter/increment')
//泛型指明参数类型，参数指明type

const counterReducer = createReducer(0, (builder) => {
  builder.addCase(increment, (state, action) => state + action.payload)
})//createReducer，第一个参数是初始值，第二个是生成器
```

生成器方法

- addCase(actionCreator,reducer)
- addMatcher(matchFunction:()=>boolean,reducer)，自定义匹配规则
- addDefaultCase：就是case里的default选项

### 切片

```javascript
function createSlice({
    name: string,
    initialState: any,
    reducers: Object<string, ReducerFunction | ReducerAndPrepareObject>
    extraReducers?:
    | Object<string, ReducerFunction>
    | ((builder: ActionReducerMapBuilder<State>) => void)
})=>{
    name : string,
    reducer : ReducerFunction,//用来传递给configerStore的reducer对象（模块化）
    actions : Record<string, ActionCreator>,//这个东西用是action生成器
    //应用中，这样使用：dispatch(action.name(paramas))
    caseReducers: Record<string, CaseReducer>.
    getInitialState: () => State
}
```

### 异步

```javascript
const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId: number, thunkAPI) => {
    const response = await userAPI.fetchById(userId)
    return response.data
  }
)
```

添加reducer

```javascript
const reducer1 = createReducer(initialState, {
  [fetchUserById.fulfilled]: (state, action) => {},
})

const reducer2 = createReducer(initialState, (builder) => {
  builder.addCase(fetchUserById.fulfilled, (state, action) => {})
})

const reducer3 = createSlice({
  extraReducers: {
    [fetchUserById.fulfilled]: (state, action) => {},
  },
})

const reducer4 = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {})
  },
})
```

返回结果

```javascript
const onClick = () => {
  //dispatch(fetchUserById(userId)).then(() => {/*...*/})
  //但是我们一般要unwrap再使用结果，因为使用asyncTrunk生成的promise总是可以resolve，真正的结果需要解绑才能使用
  dispatch(fetchUserById(userId))
    .unwrap().then((originalPromiseResult) => {
      // handle result here
    }).catch((rejectedValueOrSerializedError) => {
      // handle error here
    })
 //或者
    dispatch(fetchUserById(userId))
    .then(unwrapResult).then((originalPromiseResult) => {
      // handle result here
    }).catch((rejectedValueOrSerializedError) => {
      // handle result here
    })
}
```

# MobX

## 宗旨

### 构成

-  observable 被观察的状态
- computed 根据被观察的状态计算而来的属性
- action 操作状态

### 流程

- action
- 修改被观察状态
- 计算值修改
- 响应修改
- event->actions->observable state->computed Values->effects

## 观察状态

```javascript
const state={
    count:1,
    get double(){
        return count*2
    },
    increment:()=>{count++}
}
const countStore = makeObservable(state,{
    count:observable,
    double:computed,
    increment:action
},{
    autoBind:true,//是否自动绑定事件到正确实例
    deep:false,
    name:devName,//调试用的名字
    proxy:false//使用非 proxy 的实现。
})
const countStore = makeAutoObservable(state,{
    double:false//排除double选项
})//推断所有的属性。
```

makeObservable(target,annotations?,options?)

显示的指明观察对象的特征

makeAutoObservable(target, overrides?, options?)

observable(source, overrides?, options?)克隆一个对象让它变成可观察的，而不是代理原来的对象

```javascript
import { observable, autorun } from "mobx"

const todos = observable([
    { title: "Spoil tea", completed: true },
    { title: "Make coffee", completed: false }
])

autorun(() => {
    console.log(
        "Remaining:",
        todos.filter(todo => !todo.completed).map(todo => todo.title).join(", ")
    )
})//观察行为
// 打印: 'Remaining: Make coffee'

todos[0].completed = false
// 打印: 'Remaining: Spoil tea, Make coffee'

todos[2] = { title: "Take a nap", completed: false }
// 打印: 'Remaining: Spoil tea, Make coffee, Take a nap'

todos.shift()
// 打印: 'Remaining: Make coffee, Take a nap'
```

## 事件

### 用action包裹函数

```jsx
const ResetButton = ({ formState }) => (
    <button
        onClick={action(e => {
            formState.resetPendingUploads()
            formState.resetValues()
            e.stopPropagation()
        })}
    >
        Reset form
    </button>
)
```

这种操作起到的是标记作用，我们可以这样想，如果没有包裹，那么formState调用了两个事务，从而导致state被观察更新了两次，而包裹以后我们显示的告诉mobx这是一个事务，更新只会在结束时进行。

### action.bound(注解)

自动绑定方法到正确的实例 

### runInAction(fn)

立即调用一个事务

```javascript
import { observable, runInAction } from "mobx"

const state = observable({ value: 0 })

runInAction(() => {
    state.value++
    state.value++
})
```

### flow注解

async/await的替代方案，它要求被注解的东西是一个generator函数，在 generator 内部，可以使用 yield 串联 Promise 

```javascript
class Doubler {
    value
    constructor(value) {
        makeObservable(this, {
            value: observable,
            fetch: flow
        })
        this.value = value
    }
    *fetch() {
        const response = yield fetch("/api/value")
        this.value = response.json()
    }
}
```

## 派生（计算）

### 注解见观察状态

### 带配置注解

```javascript
{
    double:computed({
        name:"devName",
        equals:()=>boolean,//比较方法
        //有四种默认的
        /*comparer.identity 使用全等 （===）运算符确定两个值是否相同。
        comparer.default 与 comparer.identity 相同，但是其认为 NaN 等于 NaN。
        comparer.structural 执行深层的结构比较以确定两个值是否相同。
        comparer.shallow 执行浅层的结构比较以确定两个值是否相同。*/
        requiresReaction,//如果设置为true，当你试图在响应式上下文之外读取这样的计算值——这种情况下，它可能不会被缓存起来——就会导致计算值抛出错误，而不是进行昂贵的重新计算。
        keepAlive//是否永远不会被释放
    })
}
```

## 集成React

```react
import React from "react"
import ReactDOM from "react-dom"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
class Timer {
    secondsPassed = 0
    constructor() {
        makeAutoObservable(this)
    }
    increaseTimer() {
        this.secondsPassed += 1
    }
}
const myTimer = new Timer()
//被`observer`包裹的函数式组件会被监听在它每一次调用前发生的任何变化
const TimerView = observer(({ timer }) => <span>Seconds passed: {timer.secondsPassed}</span>)//订阅
ReactDOM.render(<TimerView timer={myTimer} />, document.body)
setInterval(() => {
    myTimer.increaseTimer()
}, 1000)
```

### 定义全局状态树

```react
import {observer} from 'mobx-react-lite'
import {createContext, useContext} from "react"
const TimerContext = createContext<Timer>()

const TimerView = observer(() => {
    // 从context中获取timer.
    const timer = useContext(TimerContext)
    return (
        <span>Seconds passed: {timer.secondsPassed}</span>
    )
})
```

## 其他API或注解

### 注解

- observable.ref 只有重新赋值会被追踪。所赋的值本身并不会被自动转化成 observable。 

- observable.shallow和ref类似，但是用于集合。任何所赋的集合都会被转化成 observable，但是集合本身的内容不会被转化成 observable。 

- observable.struct与现有值结构相等的任何赋值都会被忽略。 

- observable.deep就是observable本身

### 函数

- observable.object->就是observable方法本身
- observable.array(initialArray?,options?) 创建一个新的 observable 数组。如果要把 observable 数组转化回普通的数组，就请使用 .slice() 方法，observable 数组除了Array里的实例方法外还提供还有clear()，replace(newItems)，remove(value)方法辅助使用
- observable.map(initialMap?,options?)和数组一样，提供了toJSON()，merge(values)合并普通对象，replace(values) 用所提供的 values替换该 Map 的全部内容三个辅助方法。 
- observable.set 每当想创建一个动态集合，并需要观察其内部值的添加和删除，但每个值在整个集合中只能出现一次时，就可以使用它。 

### 和React

- observer：包裹一个组件，让他在被观察对象变化时重新渲染

- Observer： 渲染所提供的 render 函数，并在 render 函数所使用的 observable 之一发生改变时自动将函数重新渲染。 

  ```react
  <GridRow onRender={() => <Observer>{() => <td>{todo.title}</td>}</Observer>} />
  ```

- useLocalObservable(() => source, annotations?)

  使用 makeObservable 创建一个新的 observable，并在组件的整个生命周期内将其保留在组件中。

# Next

## 开始

自动导入一个模板项目

```bash
npx create-next-app@latest
```

或者手动创建

## 页面

### 数据三函数

- getServerSideProps

  ```javascript
  export async function getServerSideProps(context) {
    return {
      props: {}, // 服务端渲染时的参数
    }
  }
  ```

- getStaticPaths

  ```javascript
  export async function getStaticPaths() {
    return {
      paths: [{ params: { id: '1' } }, { params: { id: '2' } }],//允许的路径
      fallback: false, // 没有就是404
    }
  }
  ```

- getStaticProps（SSG）

  ```javascript
  export async function getStaticProps(context) {
    return {
      props: {}, // 页面的参数
    }
    revalidate: 10,//每隔10s或用户请求时重新验证内容来实现增量生成站点
  }
  ```

### 动态路由

- /page->page页面
- /[id]->/1,/2...
- /[...slug]->/1/2/3,/3/2...

### 编程式

```javascript
import { useRouter } from 'next/router'

export default function ReadMore() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/about')}>
      Click here to read more
    </button>
  )
}
```

## 内置标签

静态资源都放在public下，默认暴露在/目录下

```java
<Image src="/me.png" alt="Picture of the author" width={500} height={500} />
<Link href="/about">About Us</Link>
<Script src="https://example.com/script.js" />
<Head>
  <title>My page title</title>
  <meta property="xxx" content="xxx" key="title" />
</Head>
```

## 样式

### 引入

```javascript
import styles from './Button.module.css'

export function Button() {
  return (<button className={styles.error}>
      Destroy
    </button>
  )
}
```

### 全局样式

在_app.js页面中直接引入

```javascript
import 'bootstrap/dist/css/bootstrap.css'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

## 云函数

定义在pages/api目录下的js文件

```javascript
export default function handler(req, res) {
  res.status(200).json({ name: '1111' })
}
```

动态参数

- /api/posts/[postId].js->/api/posts/1

  ```javascript
  export default function handler(req, res) {
    const { pid } = req.query
    res.end(`Post: ${pid}`)
  }
  ```

- pages/api/post/[...slug].js->/api/post/1/2/3

  ```javascript
  export default function handler(req, res) {
    const { slug } = req.query//[1,2,3]
    res.end(`Post: ${slug.join(', ')}`)
  }
  ```

- pages/api/post/[[...slug]].js->/api/post,api/post/1,api/post/1/2,