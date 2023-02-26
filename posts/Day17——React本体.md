---
title: "React本体"
date: "2023-01-25"
---

# 一些概念

## 开始

### 创建一个应用

```react
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<h1>Hello, world!</h1>);
```

### JSX

JavaScript 的语法扩展。可以描述 UI 应该呈现出它应有交互的本质形式。 

```react
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;
```

 React DOM 在渲染所有输入内容之前，默认会进行转义。 本质上是React.createElement()的语法糖。

### 元素渲染

```react
const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <h1>Hello, world</h1>;
root.render(element);//替换root里的东西为element
```

## 组件

```react
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}//类式组件
class Welcome extends React.Component {
  render() {
    return <h1>{this.props.children}, {this.props.name}</h1>;
  }
}//函数式组件

//那么我们可以在渲染时使用组件
const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <Welcome name="Sara">Wow</Welcome>;
root.render(element);
```

注意，render()或者组件函数都是纯函数，不要去修改props

## Fragment

```react
<></>
<React.Fragment></React.Fragment>
<!--就是这个玩意,隐式的无法加入key，显示的可以-->
```

## Context

提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

```react
const MyContext = React.createContext(defaultValue);//创建一个环境
<MyContext.Provider value={name:"蓝蓝路",changeName:()=>{xxx}/* 希望透传的值 */}>
<MyContext.Consumer>
  {value => <div onClick={()=>{value.changeName(xxx)}}>{value.name}</div>}
</MyContext.Consumer>
```

如果需要更新value里的东西，就提供一个函数给子组件

## ReactDOM的API

### ReactDOM.render(element,container[,cb])

在container里渲染element（一个react元素），并返回对组件的引用。

如果已经渲染过就执行更新。cb会在渲染或更新之后执行。

### unmountComponentAtNode(container)

从 DOM 中卸载组件，会将其事件处理器（event handlers）和 state 一并清除。如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回 true，如果没有组件可被移除将会返回 false。 

### createPortal(child,container)

把一个child组件绑定到指定的container上，类似vue的teleport。看似是我的儿子，只不过是为了方便管理，其实早就跳到别的container上了。注意返回值仍然是一个用来render的组件

```react
render() {
  return ReactDOM.createPortal(
    this.props.children,
    this.el
  );
}
```

## 事件

事件的参数： SyntheticEvent

```typescript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

注意，在事件中，SyntheticEvent类型的event参数是合并而来的，也就是说他可能被重用，而且在事件回调函数被调用后，所有的属性都会无效。出于性能考虑，你不能通过异步访问事件。 如果希望异步访问事件属性，需在事件上调用 event.persist()保留对事件的引用。

这玩意叫合成事件，React 实现了一个**合成事件层**，就是这个事件层，把 IE 和 W3C 标准之间的兼容问题给消除了。 

- React 上注册的事件最终会绑定在`document`这个 DOM 上，而不是 React 组件对应的 DOM(减少内存开销就是因为所有的事件都绑定在 document 上，其他节点没有绑定事件)
- React 自身实现了一套事件冒泡机制，所以这也就是为什么我们 `event.stopPropagation()` 无效的原因。
- React 通过队列的形式，从触发的组件向父组件回溯，然后调用他们 JSX 中定义的 callback
- React 有一套自己的合成事件 `SyntheticEvent`，不是原生的。
- React 通过对象池的形式管理合成事件对象的创建和销毁，减少了垃圾的生成和新对象内存的分配，提高了性能

详细的事件直接看文档吧，这里说一下复合事件

```typescript
onCompositionEnd onCompositionStart onCompositionUpdate
```

 利用compositionstart和compositionend可以知道中文输入什么时候开始和结束，比如说用输入法输入中文汉字，使用onInput会出现输入拼音就进行提示的情况，而复合事件则是中文真正落在input里才触发。

## State

为了弥补props的不可变，组件里有State用来修改，接下来我们看类式组件

# 类式组件

## State

```react
class Clock extends React.Component {
  constructor(props) {//在constructor定义我们需要的state
    super(props);
    this.state = {date: new Date()};//那么state就是这个组件独有的可修改的东西
  }
  componentDidMount() {//组件挂载开启定时器
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  },

  componentWillUnmount() {//组件卸载关闭定时器
      clearInterval(this.timerID);
  },
  tick() {
    this.setState({
      date: new Date()//不要直接修改任何state
    });
    /*this.setState((state, props) => ({
      counter: state.counter + props.increment
    }));*/
  }

  render() {
    return (
      <div>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

关于setState：

- 唯一的修改state的地方，这个方法会合并修改，没修就是以前的
- 更新是异步的，啥时候更新取决于React内部实现（也就是说别想着更新完接着用上热乎的）
- 浅合并，新对象完全替换而旧对象完全保留（地址不会变）
- setState 方法可能是同步的也可能是异步的，这取决于执行上下文和更新队列的状态。 当在 React **事件处理程序**中调用 setState 方法时，React 会在下一次渲染之前，将更新加入到更新队列中，并**异步**更新组件。这是为了优化性能，避免在一次事件处理程序中多次更新组件。在一些特定的情况下，setState 方法是**同步**的，例如在**生命周期方法和回调函数（定时器）**中调用 setState 方法时。这是因为在这些情况下，React 已经开始进行组件的更新，并且需要立即更新组件的状态，以便后续的更新能够正确地进行。 

## 事件处理

```react
<button onClick={activateLasers}>
  Activate Lasers
</button>
//注意除非是高阶函数，否则不要给处理函数加括号！
```

关于处理函数

```react
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();//不要妄图使用return false阻止默认行为
    this.setState({xxx});//为了在处理函数里使用this，一定要显式绑定this对象
  }
  //当然你也可以使用箭头函数
  //handleClick:()=>{}

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```

如果函数有参数

```react
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
<!--后者的e会作为最后一个参数进入函数-->
```

## 渲染

react的列表和条件都没有默认的指令，我们要做的只不过是用js的方法去渲染

### 条件

方法一：封装简易函数

```react
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
//如此使用
<Greeting isLoggedIn={false} />
```

方法二：元素变量

```react
render(){
  const isLoggedIn = this.state.isLoggedIn;
  let button;
  if (isLoggedIn) {
	button = <LogoutButton onClick={this.handleLogoutClick} />;
 } else {
	button = <LoginButton onClick={this.handleLoginClick} />;
  }
  return <div>{button}</div>
}
```

方法三：运算符

```react
render(){
    return <div>{logined&&<h1>没登录</h1>}</div>
}
```

方法四：三元表达式（最喜欢）

```react
render(){
    return <div>{logined?null:<h1>hello:{name}</h1>}</div>
}//null代表啥也不渲染
```

### 列表

```react
render(){
    return <ul>{this.state.numbers.map((v,i)=>{
            return <li key={i}>{v}</li>
        })}</ul>
}
```

### 组合

props.children类似于vue里的默认插槽

如果希望实现其他部分的插槽，那么只能传参

```react
function C(props){
    return <div>
      {props.left}
      {props.children}
    </div>
}
<C left={<h1>hello</h1>}>liaosong</C>
```

## Refs

```react
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.cbRef=null;
    this.myRef = React.createRef();
    this.textInput = React.createRef();
  }
  focus:()=>{
      this.myRef.current.focus()//使用current来获取当前绑定的dom
  }
  Refcb:(element)=>{
      this.cbRef=element
  }
  render() {
    return <>
      <div ref={this.myRef} />
      <div ref={this.Refcb}></div><!--回调ref,渲染时绑定-->
      <CustomTextInput ref={this.textInput} /><!--只能是类式组件-->
    </>;
  }
}
```

### refs转发

```react
const FancyButton = React.forwardRef((props, ref) => 
(<button ref={ref} className="FancyButton">{props.children}</button>));
//forwardRef创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。
// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
//实际上ref获得的是button的内容
```

### 非受控组件

对于表单，我们使用value属性和onInput属性实现数据的双向绑定

但是对于file这种只读value的非受控组件，我们必须通过ref实现数据value读取

```react
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();  
  }
  handleSubmit(event) {
    event.preventDefault();
    alert(
      `Selected file - ${this.fileInput.current.files[0].name}`    );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} /></label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
```

## 生命周期

### 挂载阶段

- constructor(props)
- static getDerivedStateFromProps(props,state) 在调用 render 方法之前调用，并且在初始挂载及后续更新时都会被调用。它应返回一个对象来更新 state，如果返回null则不更新任何内容，为了防止某些人在这里被setState所以是static方法。 
- render()
- componentDidMount()可以使用setState，一般在这里进行初始的网络请求等内容

### 更新阶段

- static getDerivedStateFromProps(props,state) 
- shouldComponentUpdate(nextProps, nextState)如果返回false那么取消本次更新
  - React.Component 并未实现 shouldComponentUpdate()，而 `React.PureComponent` 中以浅层对比 prop 和 state 的方式来实现了该函数。 
- render()
- getSnapshotBeforeUpdate(prevProps, prevState)拍快照，返回值就是生成的快照传给下边那个周期
- componentDidUpdate(prevProps,prevState,snapshot)在更新后会被立即调用。首次渲染不会执行此方法。 

### 卸载

- componentWillUnmount()取消定时器以及网络请求等，不要使用setState()

### 出错

- static getDerivedStateFromError(err) 后代组件抛出错误后被调用。 
- componentDIdCatch(err,info)用来记录错误信息

# 函数（Hook）式组件

为了可以在函数式组件里使用类式组件的功能，react16+引入hook赋能函数组件

> hook的两个可用地方
>
> - 函数式组件最外层
> - 自定义hook

## useState

```react
const [count,setCount] = useState(0)
```

一般来说，在函数退出后变量就会”消失”，而 state 中的变量会被 React 保留。 对于响应式，React通过Object.is来对比新state和老state，不一样就会触发副作用（所以数组要\[...oldState,newElement\]）。和setState不一样的是，这里修改状态必定异步。如果是函数，会执行函数以返回值为value。

## useEffect

```react
useEffect(() => {
  document.title = `You clicked ${count} times`; 
  return clear(){
	//如果需要进行组件卸载的清理工作就返回一个函数进行清理
  }
});//新打开和更新时都执行
useEffect(() => {
  document.title = `You clicked ${count} times`; 
},[count]);//新打开和count更新时都执行
useEffect(() => {
  document.title = `You clicked hh times`; 
},[]);//新打开时都执行
//第二个参数要是传对象就会每次都执行
```

## 自定义hook

### 规则

- 可以使用其他hook
- 就是个函数
- 一定要以use开头

### 例子

```react
//定义
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });
  return isOnline;
}
//使用hook
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);
  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

## useContext

```react
export default myContext = createContext(value)
//使用context
const value = useContext(myContext)
//当然，对于contextvalue的修改依然通过其本身提供的方法
```

## useCallback和useMemo

```react
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => {doSomething(a, b);},[a, b],);
```

类似vue的计算属性，useMemo获取的值是fn里的返回值，如果没有改变就始终返回缓存值，但是一旦a，b改变就创建新的结果。而useCallback(fn,deps)则相当于 useMemo(() => fn, deps)，函数只会在deps改变时更新。 

## useLayoutEffect

参数和useEffect一样，但是在所有的 DOM 变更之后同步调用 effect。 

和useeffect不一样的地方是，useEffect是异步的，浏览器先渲染好了才会触发，而useLayoutEffect则是会阻塞渲染，等自己执行完才能继续。

## useReducer

useState的替代方案，类似vuex的状态管理

```react
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

## useRef

```react
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <input ref={inputEl} type="text" />
  );
}
```

和自己搞一个对象不一样的是，useRef每次渲染时返回的都是同一个ref对象，当 ref 对象内容发生变化时，useRef并不会通知。变更 .current属性不会引发组件重新渲染。 

## useDeferredValue

```jsx
const deferredValue = useDeferredValue(value);
```

 让我们延迟渲染不紧急的部分，value可以是一个state，可以帮我们实现防抖。

## useImperativeHandle

自定义绑定给一个处理对象，从而通过类似代理人的方式模拟操作真正的dom

```react
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }//父组件可以使用<FancyInput ref={inputRef} />提供的inputRef.current.focus()方法
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

## useTransition

非紧急更新

```react
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }
  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}//返回一个方法和任务状态指针
```

## useId

生成横跨服务端和客户端的稳定的唯一 ID。

## 性能方法

### React.memo(Component,howToCompare)

如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。 也就是说整个组件的渲染与否取决于prop。第二个参数默认浅比较，也可以自己传入一个函数进行比较，这个函数的参数是preProp和nextProp。其实如果就像是React.PureComponent和shouldComponentUpdate的结合体。请注意第二个参数返回true代表没有改变（不会渲染）。

### React.lazy

 定义一个动态加载的组件。这有助于缩减 bundle 的体积，并延迟加载在初次渲染时未用到的组件。 

```jsx
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

### React.Suspense

和lazy一起使用

```jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // 显示 <Spinner> 组件直至 OtherComponent 加载完成
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

# 高阶组件

- 复用逻辑：加工`react`组件的工厂，批量对原有组件进行**加工**，**包装**处理。可以复用逻辑。

- 强化props：这个是`HOC`最常用的用法之一，高阶组件返回的组件，可以劫持上一层传过来的`props`,然后混入新的`props`,来增强组件的功能。代表作`react-router`中的`withRouter`。

- 赋能组件：`HOC`有一项独特的特性，就是可以给被`HOC`包裹的业务组件，提供一些拓展功能，比如说**额外的生命周期，额外的事件**，但是这种`HOC`，可能需要和业务组件紧密结合。典型案例`react-keepalive-router`中的 `keepaliveLifeCycle`就是通过`HOC`方式，给业务组件增加了额外的生命周期。

- 控制渲染：劫持渲染是`hoc`一个特性，在`wrapComponent`包装组件中，可以对原来的组件，进行`条件渲染`，`节流渲染`，`懒加载`等功能，典型代表做`react-redux`中`connect`和 `dva`中 `dynamic` 组件懒加载

### 使用

```react
function classHOC(WrapComponent){
    return class  Idex extends React.Component{
        state={
            name:'alien'
        }
        componentDidMount(){
           console.log('HOC')
        }
        render(){
            return <WrapComponent { ...this.props }  { ...this.state }   />
        }
    }
	//函数式组件也可以
	return function Index(props){
        const [ state , setState ] = useState({ name :'alien'  })       
        return  <WrapComponent { ...props }  { ...state }   />
    }
}
function Index(props){
  const { name } = props
  useEffect(()=>{
     console.log( 'index' )
  },[])
  return <div>
    hello,world , my name is { name }
  </div>
}

export default classHOC(Index)
```

当然，不仅如此，我们还可以这样搞出来一个事件总线

```react
function classHOC(WrapComponent){
  return function Index(props){
    const [ name , setName ] = useState('alien')       
    return  <WrapComponent { ...props } name={name} setName={setName}   />
  }
}
function Index(props){
  const [ value ,setValue ] = useState(null)
  const { name , setName } = props
  return <div>
    <div>   hello,world , my name is { name }</div>
    改变name <input onChange={ (e)=> setValue(e.target.value)  }  />
    <button onClick={ ()=>  changeName(value) }  >确定</button>
  </div>
}
export default classHOC(Index)
```

因为return什么，我们说了算，那么如何渲染、何时渲染、渲染与否，可以在return中自行决定。

而且，我们甚至可以添加生命周期的内容

```react
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

# 虚拟dom对比原则

- 更新的节点层级不会发生移动（直接找到旧树中的位置进行对比）。
- 兄弟节点之间通过`key`进行唯一标识。
- 如果新旧的`节点类型`不相同，那么它认为就是一个新的结构，无论嵌套了多深也会全部`丢弃`重新创建。

### fiber

React16以前，更新是通过深度优先遍历完成的，当树的层级深就会产生栈的层级过深时页面渲染速度变慢，为了解决这个问题引入了fiber，React fiber就是虚拟DOM，它是一个链表结构（因此可以随时中断，记录下当前位置即可），返回了return、children、siblings，分别代表父fiber，子fiber和兄弟fiber，**随时可中断**，这样就实现增量渲染，增量渲染指的是把一个渲染任务分解为多个渲染任务，而后将其分散到多个帧里。 

**workInProgress**:正在内存中构建的fiber树叫workInProgress fiber，在第一次更新时，所有的更新都发生在workInProgress树，在第一次更新后，workInProgress树上的状态是最新状态，它会替换current树

**current**:正在视图层渲染的树叫current fiber树

更新时重新创建workInProgress树，复用当前current树上的alternate，作为新的workInProgress二者形成双缓冲，类似舞台的左右场，实现更加顺滑和迅速的切换。

# 三种模式

React官方一开始就是把setState设计成了异步模式，但是为了现实中的一些业务，在**Legacy模式**下，脱离React上下文环境的情况就出现异步模式，但是在**concurrent模式**下是肯定都是异步的。 

### legacy流行模式

```jsx
ReactDOM.render(<App />, rootNode)
```

同步构建DOM

### concurrent实验+未来模式

```jsx
ReactDOM.createRoot(rootNode,<App />)
```

React以提升用户交互体验为核心，把任务分为高低优先级，此模式下，高优先级的任务可以打断低优先级任务的执行，低优先级任务在打断之后被恢复。另外，倘若**低优先级任务一直被高优先级任务打断，那么低优先级任务就会过期，会被强制执行掉**。

concurrent不存在一个很大的任务，取而代之代之的是很多个“微型”任务。Concurrent 是解决计算密集型的一种思路，而Fiber是React体系下，要实现这种思路的一种基础结构，可以记录处理过的信息，从而可以恢复和暂停。

### blocking过渡模式

```jsx
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```