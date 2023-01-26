---
title: "Vue2+3"
date: "2023-01-23"
---

# Vue2

## 实例

```javascript
var vm = new Vue({
    el:"#app",//指定绑定的模板
    data:{
        a:1
    }
})//这个data可以直接vm.a获取
```

## 模板语法

```vue
<template>
	<span>Message: {{ msg }}</span>
	<span v-once>这个将不会改变: {{ msg }}</span>
	<p>rawHtml是html代码<span v-html="rawHtml"></span></p>
	<div v-bind:id="dynamicId"></div><!--绑定结点属性-->
	<a :[key]="url">...</a><!--缩写+动态参数-->
	<a @click="doSomething">...</a><!--事件，v-on缩写-->
</template>
```

## 计算和监听

```javascript
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello'
  },
  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }//默认只有getter
	fillname:{
      get: function () {
      	return this.firstName + ' ' + this.lastName
        },
    	set: function (newValue) {
      		var names = newValue.split(' ')
      		this.firstName = names[0]
			this.lastName = names[names.length - 1]
      }
  	}
  },
  watch:{
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  }
})
```

## Class和Style

```vue
<template>
  <div class="static" v-bind:class="{ active: isActive }"></div>
  <div v-bind:class="[activeClass]"></div>
<!--activeClass要在data里定义好-->
  <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
  <div v-bind:style="[baseStyles, overridingStyles]"></div>
</template>
```

## 渲染

```vue
<template>
  <div v-if="type==='A'"></div>
  <div v-else-if="type==='A'"></div>
  <div v-else="type==='A'"></div>
<!--if是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建,也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。-->
  <h1 v-show="ok">Hello!</h1>
<!--v-show 不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。show初始渲染开销大而if切换开销大-->
<ul id="example-1">
  <li v-for="(item,index) in items" :key="item.message">
    {{index}}:{{ item.message }}
  </li>
</ul>
<!--对于数组只能用7个变异方法进行修改-->
<!--也可以遍历对象-->
<div v-for="(value, name, index) in object">
  {{ index }}. {{ name }}: {{ value }}
</div>
<!--v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中。-->
</template>
```

## 事件处理

```vue
<template>
  <button v-on:click="say('hi',$event)">Say hi</button>
  <button v-on:click="say('what')">Say what</button>

  <!-- 阻止单击事件继续传播 -->
  <a v-on:click.stop="doThis"></a>

  <!-- 提交事件不再重载页面 -->
  <form v-on:submit.prevent="onSubmit"></form>

  <!-- 修饰符可以串联 -->
  <a v-on:click.stop.prevent="doThat"></a>

  <!-- 只有修饰符 -->
  <form v-on:submit.prevent></form>

  <!-- 添加事件监听器时使用事件捕获模式 -->
  <!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
  <div v-on:click.capture="doThis">...</div>

  <!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
  <!-- 即事件不是从内部元素触发的 -->
  <!--once仅仅触发一次-->
  <div v-on:click.self.once="doThat">...</div>

  <!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
  <!-- 而不会等待 `onScroll` 完成  -->
  <!-- 这其中包含 `event.preventDefault()` 的情况 -->
  <div v-on:scroll.passive="onScroll">...</div>

  <!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
  <input v-on:keyup.enter="submit">

  <!-- Ctrl + Click -->
  <div v-on:click.ctrl="doSomething">Do something</div>

  <!--对应的鼠标修饰符.left\.right\.middle-->
  <!--对应的键盘修饰符.ctrl\.alt\.shift\.meta-->
</template>

<script>
new Vue({
  methods: {
    say: function (message) {
      if (event) {
        event.preventDefault()
      }
      alert(message)
    }
  }
})
</script>
```

## 双向绑定

```vue
<template>
  <input v-model.lazy.trim="message" placeholder="edit me">
  <p>Message is: {{ message }}</p>
  <!--输入框类绑定普通字符串，lazy转为在 change 事件之后进行同步而非input,trim则是去除头尾空白，还有number转化为数字-->
  <input type="checkbox" id="checkbox" v-model="checked">
  <!--单个复选框绑定普通字符串-->
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <!--多个复选框绑定数组-->
  <input type="radio" id="one" value="One" v-model="picked">
  <input type="radio" id="two" value="Two" v-model="picked">
  <!--单选绑定字符串-->
  <!--选择框根据单选或多选绑定字符串或数组-->

</template>
```

## 组件

### 注册

```javascript
Vue.component('my-component-name', {
  //这是全局注册，可以在任何地方使用
})

var ComponentA = { /* 这是局部注册 */ }

new Vue({
  el: '#app',
  components: {
    'component-a': ComponentA,//如此使用组件
  }
})
```

### prop

```vue
Vue.component('my-component-name', {
  inheritAttrs: false,
  //不希望组件的根元素继承 attribute
  prop:{
	propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
	propF: {
      validator: function (value) {
	    return['success','warning'].includes(value)
      }
    }//type也可以是自定义类
  }
  //$attrs代表父亲传入的prop赋予给谁
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
//组件可以接受任意的 attribute，而这些 attribute 会被添加到这个组件的根元素上。

<my-component-name v-bind="post"></div>
<!--这样传递的是post对象所有的键值对，类似react的{...v}-->
```

### 自定义事件

```vue
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})

<base-checkbox @focus.native="onFocus" @change="fatherChange"></base-checkbox>
<!--可以绑定原生事件.native到组件根元素-->
<text-document v-bind:title.sync="doc.title"></text-document>
<!--.sync提供方便地实现双向的数据绑定，类似react的双向的语法糖-->
```

### 插槽

```vue
<template>
  <a v-bind:href="url" class="nav-link">
    <slot>我是插槽为空时的内容</slot>
    <slot name="header">我是有名插槽</slot>
	<slot v-bind:user="user" name="scope">
        我是作用域插槽
      {{ user.lastName }}
	</slot>
  </a>
</template>

<template>
  <my-com>
	<template>默认插槽</template>  
	<template v-slot:header>header插槽，可以简写#header</template>  
	<slot v-slot:scope="slotProps">
      {{ slotProps.user.firstName }}
    </slot>
  </my-com>
</template>
```

### 动态组件

```vue
<component v-bind:is="currentTabComponent"></component>
```

### 异步组件

```vue
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。
new Vue({
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```

### 其他

- $root可以访问根实例
- $parent访问父组件
- 通过ref标注以及this.$ref访问原生的元素或者子组件
- 可以在声明周期或方法里使用$on\\$once\\$off(eventName,eventHandler)来设置或终止对事件的侦听
- $forceUpdate强制刷新，如果一个需要响应的东西没有被注册
- v-once,只会渲染一次，以后就不动他了

## 关于复用

### mixin

```javascript
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
//当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。
//数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
//同名钩子函数将合并为一个数组，因此都将在钩子之前被调用。
//值为对象的选项，如methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。
Vue.mixin({  
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})//全局混入，以后每个实例都会有
```

### 自定义指令

- 自定义指令写在directives里，使用v-xxx调用

- 自定义指令是一个对象，里边提供钩子函数

  - bind： 指令第一次绑定到元素时调用。 
  - inserted：被绑定元素插入父节点时调用 
  - update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前
  - componentUpdate：指令所在组件的 VNode 及其子 VNode全部更新后调用。 
  - unbind：指令和元素解绑时调用

- ```json
  {
      //钩子函数的参数
      el:"指令绑定的元素",
      binding:{
          name:"指令名",
          value:"绑定的值",
          oldValue:"指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。",
          expression:"字符串形式的指令表达式。例如 v-my-directive='1 + 1' 中，表达式为 '1 + 1'",
          arg:"传给指令的参数，可选,比如v-xxx:foo,arg就是foo",
          modifiers:"包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }"
      },
      vnode:"虚拟结点",
      oldVnode
  }
  ```

- 也可以简写

  ```javascript
  Vue.directive('color-swatch', function (el, binding) {
    el.style.backgroundColor = binding.value
  })//这样注册的指令是全局的
  ```

### 插件

```javascript
Vue.use(MyPlugin, { someOption: true })//如此使用

MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}//如此开发
```

### 过滤器

```vue
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>

<script>
  new Vue({
    filters:{
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  })
</script>
```

```javascript
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
//全局过滤器
```

## API讲解

- 全局配置Vue.config.xxx

  ```javascript
  Vue.config.silent = true//取消所有日志和警告
  Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
    return child + 1
  }
  //自定义选项将使用默认策略，即简单地覆盖已有值。如果想让自定义选项以自定义逻辑合并，可以向 Vue.config.optionMergeStrategies 添加一个函数：这个函数返回最后合并的值
  Vue.config.devtools = true
  //是否允许vue插件查看代码
  Vue.config.keyCodes = {
    v: 86,
    f1: 112,
    // camelCase 不可用
    mediaPlayPause: 179,
    // 取而代之的是 kebab-case 且用双引号括起来
    "media-play-pause": 179,
    up: [38, 87]
  }//自定义键盘编码
  Vue.config.ignoredElements = [
    'my-custom-web-component',
    'another-web-component',
    // 用一个 `RegExp` 忽略所有“ion-”开头的元素
    // 仅在 2.5+ 支持
    /^ion-/
  ]
  //使 Vue 忽略在 Vue 之外的自定义元素 (e.g. 使用了 Web Components APIs)。否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于 Unknown custom element 的警告。
  //其他的配置项基本和开发生产模式有关
  ```

- 全局API

  ```javascript
  Vue.extend({})//使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。
  Vue,nextTick(cb,context)//在下次 DOM 更新循环结束之后执行延迟回调。也可以以nextTick().then(func)调用
  Vue.set(target:Object,property:string|number,value:value)//向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。
  Vue.delete(target,property)//set的删除过程
  Vue.directive( id, [definition] )//注册或获取全局指令。
  Vue.filter( id, [definition] )//注册或获取全局过滤器。
  Vue.component('my-component', Vue.extend({}))//注册或获取全局组件。注册还会自动使用给定的 id 设置组件的名称
  Vue.use(plugin)
  Vue.mixin(mixin)
  Vue.compile( template:string )
  //将一个模板字符串编译成 render 函数。只
  //在完整版时可用。
  Vue.observable( object )
  //让一个对象可响应。Vue 内部会用它来处理 data 函数返回的对象。
  Vue.version//Vue版本
  ```

- 组件选项/数据

  - data

  - props

  - propsData

    ```javascript
    //只用于 new 创建的实例中。
    var Comp = Vue.extend({
      props: ['msg'],
      template: '<div>{{ msg }}</div>'
    })
    
    var vm = new Comp({
      propsData: {
        msg: 'hello'
      }
    })
    ```

  - computed

  - methods

  - watch

- 组件选项/DOM

  - el
  - template
  - render，自定义渲染函数
  - renderError： 当 render函数遭遇错误时，提供另外一种渲染输出。其错误将会作为第二个参数传递到 renderError。

- 组件选项/资源

  - filters
  - directives
  - components

- 组件选项/组合

  ```javascript
  var Provider = {
    provide: {
      foo:'name'
    },
  }
  
  var Child = {
      inject:['foo']
      extends:oneCom//类似类的扩展
  })
  
  var mixin = {
    created: function () { console.log(1) }
  }
  var vm = new Vue({
    created: function () { console.log(2) },
    parent:father//敲定父组件，这个一般是非单文件组件
    mixins: [mixin]
  })
  ```

- 其他选项

  - name：组件名

  - delimiters：改变纯文本插入分隔符。delimiters: ['${', '}'] 

  - modal： 允许一个自定义组件在使用 v-model 时定制 prop 和 event。 

    ```javascript
    Vue.component('my-checkbox', {
      model: {
        prop: 'checked',
        event: 'change'
      },
      props: {
        value: String,
        checked: {
          type: Number,
          default: 0
        }
      },
    })
    //<my-checkbox v-model="foo" value="some value"></my-checkbox>
    ```

  - inheritAttrs:见组件prop一节

  - comments： 当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。 

- Vue实例原型

  - $data\\$props\\$el\\$parent\\$root就是选项里的内容

  - $options

    ```javascript
    new Vue({
      customOption: 'foo',
      created: function () {
        console.log(this.$options.customOption) // => 'foo'
      }
    })
    ```

  - $children 当前实例的直接子组件。 

  - $slots

    ```javascript
    Vue.component('blog-post', {
      render: function (createElement) {
        var header = this.$slots.header
        var body   = this.$slots.default
        var footer = this.$slots.footer
        return createElement('div', [
          createElement('header', header),
          createElement('main', body),
          createElement('footer', footer)
        ])
      }
    })
    ```

  - $refs

  - $attrs: 包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定  

  - $isServer， 当前 Vue 实例是否运行于服务器。 

  - $listeners: 包含了父作用域中的 (不含 .native修饰器的) v-on 事件监听器。 

- 实例方法

  ```javascript
  var MyComponent = Vue.extend({
    template: '<div>Hello!</div>'
  })
  
  // 创建并挂载到 #app (会替换 #app)
  new MyComponent().$mount('#app')
  
  // 同上
  new MyComponent({ el: '#app' })
  
  // 或者，在文档之外渲染并且随后挂载
  var component = new MyComponent().$mount()
  document.getElementById('app').appendChild(component.$el)
  //还有对应的$destory完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。
  //forceUpdate和nextTick
  ```

- 特殊属性

  - key
  - ref
  - is

- 内置指令

  - v-text\\v-html\\v-show\\v-if\\v-for
  - v-on\\v-bind\\v-model
  - v-slot
  - v-pre 跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。 
  - v-cloak 这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 [v-cloak] { display: none } 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕。 
  - v-once: 只渲染元素和组件一次。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。 

- 实例方法

  - $watch

    ```javascript
    // 键路径
    vm.$watch('a.b.c', function (newVal, oldVal) {
      // 做点什么
    })
    
    // 函数
    var unwatch = vm.$watch(
      function () {
        // 表达式 `this.a + this.b` 每次得出一个不同的结果时
        // 处理函数都会被调用。
        // 这就像监听一个未被定义的计算属性
        return this.a + this.b
      },
      function (newVal, oldVal) {
        // 做点什么
      }
    )
    //unwatch()用来取消监听
    ```

## 生命周期

|     name      |                             time                             |
| :-----------: | :----------------------------------------------------------: |
| beforeCreate  |     在实例初始化之后,进行数据侦听和事件/侦听器的配置之前     |
|    created    | 在实例创建完成后被立即同步调用。在这一步中，实例已完成对选项的处理，意味着以下内容已被配置完毕：数据侦听、计算属性、方法、事件/侦听器的回调函数。然而，挂载阶段还没开始 |
|  beforeMount  |      在挂载开始之前被调用：相关的render函数首次被调用。      |
|    mounted    |                       实例被挂载后调用                       |
| beforeUpdate  |           在数据发生改变后，DOM 被更新之前被调用。           |
|    updated    |   在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。    |
| beforeDestory |        实例销毁之前调用。在这一步，实例仍然完全可用。        |
|   destoryed   | 实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。 |
|   activated   |             被 keep-alive 缓存的组件激活时调用。             |
|  deactivated  |             被 keep-alive 缓存的组件失活时调用。             |



# Vue3

## 前言

首先要分清组合式API和选项式API

- 使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑。其实就是Vue2的逻辑。
- 组合式API，则是自取所需式的Reacthooks写法
- 如果内容和v2一样就不再赘述（条件、列表、表单、事件、类和样式）

## 创建应用

```javascript
import { createApp } from 'vue'
// 从一个单文件组件中导入根组件
import App from './App.vue'

const app = createApp(App)//创建
app.mount('#app')//挂载到dom
```

## 响应式

```javascript
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }//都是深度监视
    }
  }
}
//和v2不一样的是，原始的 newObject 不会变为响应式：确保始终通过 this 来访问响应式状态。

//组合式
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })
    //返回的是proxy而非原始对象
    //不过如果同一个对象多次调用 reactive() 会返回相同的代理
    //注意不要随意地“替换”一个响应式对象，因为这将导致对初始引用的响应性连接丢失
    const count = ref(0)
    //ref允许我们创建可以使用任何值类型的响应式 
    //使用count.value获取值,在模板中自动解包获取.value
    //当一个 ref 被嵌套在一个响应式对象中，作为属性被访问或更改时，它会自动解包，因此会表现得和一般的属性一样
    //一个包含对象类型值的 ref 可以响应式地替换整个对象
    const objectRef = ref({ count: 0 })
	// 这是响应式的替换
    //注意，这种情况模板不会自动解包
    
	objectRef.value = { count: 1 }
    return {
      state,count,objectRef
    }
  }
}
```

## 计算和监听

```javascript
export default {
  data() {
    return {
      name: 'John Doe',
    }
  },
  computed: {
    sayHi() {
      // `this` 指向当前组件实例
      return 'Hi~'+this.name
    }//也有和V2一样的set和get类型写法
  }
}

//组合式
const name = ref('John')
const sayHi = computed(() => {
  return 'Hi~'+name
})
//getter+setter
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

```javascript
export default {
  data() {
    return {
      question: '',
      answer: 'emmmmm'
    }
  },
  watch: {
    // 每当 question 改变时，这个函数就会执行
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    },
    someObject: {
      handler(newValue, oldValue) {
        // 注意：在嵌套的变更中，只要没有替换对象本身，那么这里的 `newValue` 和 `oldValue` 相同
      },
      deep: true,//深层监听
      
      immediate: true// 强制立即执行回调,
      flush:"post"//想在侦听器回调中能访问被 Vue 更新之后的 DOM
    }
  },
   //$watch用法和v2一样
}

//组合式
const x = ref(0)
const y = ref(0)
const obj = reactive({ count: 0 ,o:{count:1}})
// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数，对于响应式对象的属性必须用getter
//响应式对象都是隐式的deep监听，只有用getter函数返回对象才不是深监听，当然，也可以在watch的第三个参数options中加入deep:true实现深监视
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
// 多个来源组成的数组
const unwatch = watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
//watchEffect()在创建侦听器时，立即执行一遍回调。类似react的useEffect().
//如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它,也就是使用上面的unwatch
```

## 模板应用（原生DOM）

```vue
<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
  <input :ref="(el) => { /*每次组件更新甚至卸载时都被调用。*/ }">
</template>
<script>
export default {
  data() {
    return {
      list: []
    }
  },
  mounted() {
    console.log(this.$refs.items)//可以获取列表的内容
  }
}
</script>
```

```vue
<script setup>
import { ref, onMounted } from 'vue'
const input = ref(null)
const itemRefs = ref([])
</script>

<template>
  <input ref="input" />
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

## 组件

### 注册

基本和v2一致，setup语法糖中只需要导入即可完成注册

### prop

选项式和v2一样

```vue
<script setup>
const props = defineProps({
  title: String,
  likes: Number
})
</script>
<!--无script setup-->
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

### 事件

v3的事件需要注册再使用

```javascript
export default {
  emits: ['inFocus', 'submit']
}

export default {
  emits: {
    // 没有校验
    click: null,

    // 校验 submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
//在setup里面
const emit = defineEmits(['inFocus','submit'])
emit('inFocus')

//对于v-model。v3没有了.sync，直接使用v-model自动拆出方法
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>//这是<CustomInput v-model="searchText"/>
//需要在子组件如此定义
defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }//修饰符
})//如果不知1个v-model，如v-model:firet,v-model-second
//那么对应prop为first和second
defineEmits(['update:modelValue'])
```

### attrs

选项式一致($attrs)，组合式setup使用useAttrs()获取，非setup使用setup(props,ctx)里的ctx.attrs

### 插槽,这里再提一下作用域

```vue
<template>
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
</template>

<template>
<MyComponent v-slot="slotProps">
  <!--插槽名后面根子组件提供的插槽参数-->
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
</template>
```

## 复用

### 自定义指令

和v2的钩子完全不同，binding参数部分不同

```javascript
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // 在模板中启用 v-focus
    focus
  }
}
//在setup里，任何以v开头的驼峰式命名变量都可以被用作一个自定义指令。
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {}
}
//<div v-example:foo.bar="baz">
binding = {
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
  instance://使用该指令的组件实例。
  dir://指令的定义对象。
}
```

### 插件

```javascript
app.use(myPlugin, {
  install: (app, options) => {
    // 在这里编写插件代码
	//通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。

	//通过 app.provide() 使一个资源可被注入进整个应用。

	//向 app.config.globalProperties 中添加一些全局实例属性或方法
  }
})
```

### 组合式函数

其实就是自定义use

```javascript
import { ref, onMounted, onUnmounted } from 'vue'
export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return { x, y }
}
```

```vue
<script setup>
import { useMouse } from './mouse.js'
const { x, y } = useMouse()
</script>

<template>
  Mouse position is at: {{ x }}, {{ y }}
</template>
```

## 生命周期（选项）

|     name      |                         content                         |
| :-----------: | :-----------------------------------------------------: |
| beforeCreate  |               初始化、props解析后，data前               |
|    created    |      在组件实例处理完所有与状态相关的选项后调用。       |
|  beforeMount  |                 在组件被挂载之前调用。                  |
|    mounted    |                 在组件被挂载之后调用。                  |
| beforeUpdate  |                       组件更新前                        |
|    updated    |                       组件更新后                        |
| beforeUnmount |                         卸载前                          |
|   unmounted   |                         卸载后                          |
| errorCaptured |           在捕获了后代组件传递的错误时调用。            |
|   activated   | keep-alive缓存树的一部分，当组件被插入到 DOM 中时调用。 |
|  deactivated  | keep-alive缓存树的一部分，当组件从 DOM 中被移除时调用。 |

## 生命周期（组合）

|       name        |                     content                     |
| :---------------: | :---------------------------------------------: |
|    onMounted()    |                   组件挂载后                    |
|    onUpdated()    | 组件因为响应式状态变更而更新其 DOM 树之后调用。 |
|   onUnmounted()   |           在组件实例被卸载之后调用。            |
| onBeforeMounte()  |                   组件挂载前                    |
| onBeforeUpdated() | 组件因为响应式状态变更而更新其 DOM 树之前调用。 |
| onBeforeUnmount() |             组件实例被卸载前调用。              |
|  onErrorCaptured  |                        -                        |
|    onActivated    |                        -                        |
|   onDeactivated   |                        -                        |



## API，仅仅比较和v2的差异

- 一个新的指令v-memo

  ```vue
  <div v-memo="[valueA, valueB]">
    只要valueA和valueB 都保持不变，这个div及其子项的所有更新都将被跳过。实际上，甚至虚拟 DOM 的 vnode 创建也将被跳过，因为缓存的子树副本可以被重新使用。一般用来性能优化。
  </div>
  ```

- 新的状态选项emits和expose，expose用于声明当组件实例被父组件通过模板引用访问时暴露的公共属性。 

  ```javascript
  export default {
    // 只有 `publicMethod` 在公共实例上可用
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```

- 应用实例

  - function createApp|createSSRApp(rootComponent: Component, rootProps?: object)

  - app.mount( rootContainer: Element | string )|app.unmount()

  - app.provide()

    ```javascript
    import { createApp } from 'vue'
    
    const app = createApp(/* ... */)
    
    app.provide('message', 'hello')
    //组件
    export default {
      inject: ['message'],
      created() {
        console.log(this.message) // 'hello'
      }
    }
    
    ```

  - app.component()\\app.directive()\\app.use\\app.mixin()注册全局服务

  - app.config.MergeStrategies|compilerOptions同v2

  - app.config.globalProperties

    ```javascript
    app.config.globalProperties.msg = 'hello'
    //组件
    export default {
      mounted() {
        console.log(this.msg) // 'hello'
      }
    }
    ```

### 组合式API

- setup(prop,ctx)

  - setup的返回值会暴露给模板和其他的选项式 API 钩子 

  - 通过prop访问传入的参数

  - ctx上下文里边暴露了attrs、slots、emit、expose

  - expose是一个方法

    ```javascript
    export default {
      setup(props, { expose }) {
        // 让组件实例处于 “关闭状态”
        expose()
        const publicCount = ref(0)
        // 有选择地暴露局部状态
        expose({ count: publicCount })
      }
    }
    ```

- 响应式API

  - ref()

  - computed()

  - reactive()

  - readonly() 接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理。 

  - watchEffect(): 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。 

    ```typescript
    function watchEffect(
      effect: (onCleanup: OnCleanup) => void,
      options?: WatchEffectOptions
    ): StopHandle
    type OnCleanup = (cleanupFn: () => void) => void
    interface WatchEffectOptions {
      flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
      //pre侦听器将在组件渲染之前执行。post使侦听器延迟到组件渲染之后再执行。sync在响应式依赖发生改变时立即触发侦听器
      onTrack?: (event: DebuggerEvent) => void
      onTrigger?: (event: DebuggerEvent) => void
    }
    type StopHandle = () => void
    ```

  - watchPostEffect()|watchSyncEffect(),默认flush为post|sync的副作用器

  - watch()不再细说

- 响应式工具

  - isRef()

  - unref() 如果参数是 ref，则返回内部值，否则返回参数本身。 

  - toRef() 基于响应式对象上的一个属性，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值将更新 ref 的值，反之亦然。 

    ```javascript
    const state = reactive({
      foo: 1,
      bar: 2
    })
    const fooRef = toRef(state, 'foo')
    // 更改该 ref 会更新源属性
    fooRef.value++
    console.log(state.foo) // 2
    // 更改源属性也会更新该 ref
    state.foo++
    console.log(fooRef.value) // 3
    ```

  - toRefs() 将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。 

    ```javascript
    const state = reactive({
      foo: 1,
      bar: 2
    })
    const stateAsRefs = toRefs(state)
    state.foo++
    console.log(stateAsRefs.foo.value) // 2
    stateAsRefs.foo.value++
    console.log(state.foo) // 3
    ```

  - isProxy()是否为响应式对象

  - isReactive()

  - isReadonly()

- 高级响应式

  - shallowRef()浅引用ref

  - triggerRef() 强制触发依赖于一个浅层 ref 的副作用，这通常在对浅引用的内部值进行深度变更后使用。 

  - customRef((track,trigger)=>{getter 和 setter}) 创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。 

  - shallowReactive()浅引用的reactive

  - shallowReadonly()

  - toRaw()获得响应式对象的原始对象

  - makeRaw() 将一个对象标记为不可被转为代理。返回该对象本身。 

    ```javascript
    const foo = markRaw({})
    console.log(isReactive(reactive(foo))) // false
    ```

- 依赖注入

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { fooSymbol } from './injectionSymbols'
  
  // 提供静态值
  provide('foo', 'bar')
  
  // 提供响应式的值
  const count = ref(0)
  provide('count', count)
  
  // 提供时将 Symbol 作为 key
  provide(fooSymbol, count)
  </script>
  
  
  <script setup>
  
  // 注入值的默认方式
  const foo = inject('foo')
  
  // 注入响应式的值
  const count = inject('count')
  
  // 通过 Symbol 类型的 key 注入
  const foo2 = inject(fooSymbol)
  
  // 注入一个值，若为空则使用提供的默认值
  const bar = inject('foo', 'default value')
  
  // 注入一个值，若为空则使用提供的工厂函数
  const baz = inject('foo', () => new Map())
  
  // 注入时为了表明提供的默认值是个函数，需要传入第三个参数
  const fn = inject('function', () => {}, false)
  </script>
  ```

  