---
title: "Vue2+3"
date: "2023-01-23"
---
# 对框架的理解

Model->数据层、View->视图层

## MVC

c->controller，controller和view并没有解耦，业务逻辑被放置在model层 

## MVP

Model和View之间不进行通讯，都是通过Presenter完成。Controller和View解耦。

## MVVM

通过双向绑定的机制，实现数据和UI内容，只要想改其中一方，另一方都能够及时更新的一种设计理念，这样就省去了很多在View层中写很多case的情况，只需要改变数据就行。在MVVM中View和ViewModel通过Binding进行关联，他们之前的关联处理通过DataBinding完成。 

## 两个核心

组件系统和数据驱动 

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

  <!-- 阻止单击事件继续冒泡 -->
  <a v-on:click.stop="doThis"></a>

  <!-- 阻止默认行为 -->
  <form v-on:submit.prevent="onSubmit"></form>

  <!-- 阻止默认行为 -->
  <form v-on:submit.self="onSubmit"></form>

  <!-- 只有是自己触发的自己才会执行 -->
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
  <input :value="searchText" @input="searchText = $event.target.value"/>
  <!--其实是这玩意的语法糖-->
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
<script>
Vue.component('my-component-name', {
  inheritAttrs: false,
  //不希望组件的根元素继承 attribute
  //一般和$attr一起自定义谁真正得到参数
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
  //$attrs代表父亲传入但没有被子组件接收的props
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
</script>
//组件可以接受任意的 attribute，而这些 attribute 会被添加到这个组件的根元素上。
<my-component-name v-bind="post"></div>
<!--这样传递的是post对象所有的键值对，类似react的{...v}-->
```

### 自定义事件

```vue
<script>
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
</script>
<base-checkbox v-model="lovingVue" @focus.native="onFocus" @change="fatherChange"></base-checkbox>
<!--lovingVue 的值将会传入这个名为 checked 的 prop。同时当 <base-checkbox> 触发一个 change 事件并附带一个新的值的时候，这个 lovingVue 的 property 将会被更新。-->
<!--可以绑定原生事件.native到组件根元素-->
<text-document v-bind:title.sync="doc.title"></text-document>
<!--.sync提供方便地实现双向的数据绑定，类似react的双向的语法糖,要在组件内进行一些操作，V3会详细说明-->
<!--this.$emit('update:title', newTitle)-->
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

```javascript
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
//允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。
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
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
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
  //注意，和Vue.Component(全局注册一个组件)不一样的是，这个所谓的子类是一个构造函数，需要调用new才能真正创建对应的组件实例，并挂载到一个元素上。new Profile().$mount('#mount-point')
  Vue,nextTick(cb,context)//在下次 DOM 更新循环结束之后执行延迟回调。也可以nextTick().then(func)调用
  Vue.set(target:Object,property:string|number,value:value)//向响应式对象中添加一个property，并确保这个新 property 同样是响应式的，且触发视图更新。vm.$set
  Vue.delete(target,property)//set的删除过程|vm.$delete
  Vue.directive( id, [definition] )//注册或获取全局指令。
  Vue.filter( id, [definition] )//注册或获取全局过滤器。
  Vue.component('my-component', Vue.extend({}))//注册或获取全局组件。注册还会自动使用给定的 id 设置组件的名称
  Vue.use(plugin)
  Vue.mixin(mixin)
  Vue.compile( template:string )
  //将一个模板字符串编译成 render 函数。只在完整版时可用。
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
  //provide/inject绑定并不是可响应的。如果传入了一个可监听的对象，那么其 property 还是可响应的
  //通过传递一个函数或者V3里的ref|reactive包裹的对象可以实现响应式
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

    - ```vue
      <input ref="input">
      this.$refs.input.focus()
      ```

  - is

- 内置指令

  - v-text\\v-html\\v-show\\v-if\\v-for
  - v-on\\v-bind\\v-model
  - v-slot:slotName="插槽作用域的名字（自定义的）"
  - v-pre 跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。 
  - v-cloak 这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 [v-cloak] { display: none } 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到实例准备完毕，可以解决第一次编译时出现双大括号的问题。
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
    
  - API事件
  
    ```javascript
    vm.$on('test', function (msg) {//$once自动解绑
      console.log(msg)
    })
    vm.$emit('test', 'hi')
    vm.$off('test')
    //这样监听器就可以独立在组件之外。
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
//和v2不一样的是，原始的 Object 不会变为响应式：确保始终通过 this 来访问响应式状态。

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

### setup

setup执行在beforeCreate之前。。。

```javascript
export default {
  setup(props, context) {
    // 透传 Attributes（非响应式的对象，等价于 $attrs）
    console.log(context.attrs)

    // 插槽（非响应式的对象，等价于 $slots）
    console.log(context.slots)

    // 触发事件（函数，等价于 $emit）
    console.log(context.emit)

    // 暴露公共属性（函数）
    console.log(context.expose)
  }
}
```

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
})//如果不只是1个v-model，如v-model:first,v-model:second
//那么对应prop为first和second,而修饰符则是firstModifiers,secondModifiers
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

### extends

```vue
const CompA = { ... }

const CompB = {
  extends: CompA,
  ...
}
```

和mixin几乎一样，只不过mixin混入一个简单对象，而extends继承一个组件。

### 插件

```javascript
app.use(myPlugin,oprions)
myPlugin:{
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

|             name             |                         content                         |
| :--------------------------: | :-----------------------------------------------------: |
|         beforeCreate         |               初始化、props解析后，data前               |
|           created            |      在组件实例处理完所有与状态相关的选项后调用。       |
|         beforeMount          |                 在组件被挂载之前调用。                  |
|           mounted            |                 在组件被挂载之后调用。                  |
|         beforeUpdate         |                       组件更新前                        |
|           updated            |                       组件更新后                        |
|        beforeUnmount         |                         卸载前                          |
|          unmounted           |                         卸载后                          |
| errorCaptured(err, vm, info) |           在捕获了后代组件传递的错误时调用。            |
|          activated           | keep-alive缓存树的一部分，当组件被插入到 DOM 中时调用。 |
|         deactivated          | keep-alive缓存树的一部分，当组件从 DOM 中被移除时调用。 |

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

值得注意的是，setup在beforeCreate之前（或者说是模拟量create）执行

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

  - watchEffect(): 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。 依赖自动收集

    ```typescript
    function watchEffect(
      effect: (onCleanup: OnCleanup) => void,
      options?: WatchEffectOptions
    ): StopHandle
    type OnCleanup = (cleanupFn: () => void) => void//用来注册清理回调。可以手动去除无效副作用
    interface WatchEffectOptions {
      flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
      //pre侦听器将在组件渲染之前执行。post使侦听器延迟到组件渲染之后再执行。sync在响应式依赖发生改变时立即触发侦听器
      onTrack?: (event: DebuggerEvent) => void
      onTrigger?: (event: DebuggerEvent) => void
    }
    type StopHandle = () => void
    ```

  - watchPostEffect()|watchSyncEffect(),默认flush为post|sync的副作用器

  - watch(source,cb,options)不再细说

- 响应式工具

  - isRef()

  - unref() 如果参数是 ref，则返回内部值，否则返回参数本身。 

  - toRef()基于响应式对象上的一个属性，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值将更新 ref 的值，反之亦然。 

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

  - shallowRef()浅引用ref,深层结构不是响应式的

  - triggerRef(ref: ShallowRef) 强制触发依赖于一个浅层 ref 的副作用，这通常在对浅引用的内部值进行深度变更后使用。 

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


# 抽象组件

类似React的高阶组件，在抽象组件的生命周期过程中，我们可以对包裹的子组件监听的事件进行拦截，也可以对子组件进行Dom 操作，从而可以对我们需要的功能进行封装，而不需要关心子组件的具体实现。 

要编写一个抽象组件，就要设置他的配置项 **abstract** 为true

```vue
<script>
import {get, debounce, set} from 'lodash';
//一个防抖组件
export default {
  name: 'debounce',
  abstract: true, //标记为抽象组件
  render() {
  let vnode = this.$slots.default[0]; // 子组件的vnode
  if (vnode) {
    let event = get(vnode, `data.on.click`); // 子组件绑定的click事件
    if (typeof event === 'function') {
        set(vnode, `data.on.click`, debounce(event, 1000));
      }
    }
    return vnode;
  }
};
</script>
<!--使用-->
<debounce>
    <button @click="clickHandler">测试</button>
</debounce>
```

# 原理

## 虚拟DOM和diff

- 解析template->AST->渲染函数->虚拟DOM
- 通过遍历AST生成渲染函数
- 虚拟dom，就是我们在渲染的时候参考的那颗树
- 里边有很多比如tag、class等标签相关的东西，当然，有子虚拟DOM数组
- render方法的作用就是递归地创建结点
- 而diff比较两个虚拟DOM的区别，也就是在比较两个对象的区别。 
  - diff算法最后会产生补丁包，根据两个虚拟对象创建出补丁，描述改变的内容，将这个补丁用来更新DOM 
  - 新的DOM节点不存在{type: 'REMOVE', index}
  - 文本的变化{type: 'TEXT', text: 1}
  - 当节点类型相同时，去看一下属性是否相同，产生一个属性的补丁包{type: 'ATTR', attr: {class: 'list-group'}}
  - 节点类型不相同，直接采用替换模式{type: 'REPLACE', newNode}
- 最后我们根据产生的补丁包依然递归地进行DOM修改。
- 而对于key这个东西，如果列表里没有会导致列表通过就地更新，保证他们在原本指定的索引位置上渲染
  - 对没有 key 的子节点数组更新调用的是`patchUnkeyedChildren`这个方法，核心是就地更新的策略。它会通过**对比新旧子节点数组的长度**，先以比较短的那部分长度为基准，将新子节点的那一部分直接 patch 上去。然后再判断，如果是新子节点数组的长度更长，就直接将新子节点数组剩余部分挂载(mount)；如果是新子节点数组更短，就把旧子节点多出来的那部分给卸载掉（unmount）。也就是说，**没有key我就仅仅凑长度，根据原来位置的DOM赋予新DOM属性。**
  - 有 key 的子节点更新是调用的`patchKeyedChildren`，大概流程就是同步头部节点、同步尾部节点、处理新增和删除的节点，最后用求解最长递增子序列的方法区处理未知子序列。是为了**最大程度实现对已有节点的复用，减少 DOM 操作的性能开销**，同时避免了就地更新带来的子节点状态错误的问题。
  - 比对顺序：startOld=>startNew,endOld=>endNew,startOld=>endNew,endOld=>startNew,unkown

## 响应式

### V2

给出几个定义

- Dep是Dep构造函数，这玩意是依赖收集器
- Watcher是侦听器，用来监听依赖并触发render
- Dep.target是依赖变化时需要通知的Watcher实例

接下来捋一下过程

- 3个东西：Observer，Watcher，Dep,可以发现，一个Vue实例只有一个Observer

- Watcher在mounte的时候 new Watcher(self, self.render); 

- ```javascript
  //这是Observer，最顶层的东西
  const Observer = function(data) {
    // 循环修改为每个属性添加get set
    for (let key in data) {
      defineReactive(data, key);
    }
  }
  
  const defineReactive = function(obj, key) {
    // 局部变量dep，用于get set内部调用
    const dep = new Dep();
    // 获取当前值
    let val = obj[key];
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        dep.depend();
        return val;
      },
      set(newVal) {
        if (newVal === val) {
          return;
        }
        val = newVal;
        // 当值发生变更时，通知依赖收集器，更新每个需要更新的Watcher，
        // 这里每个需要更新通过什么断定？dep.subs
        dep.notify();
      }
    });
  }
  
  const observe = function(data) {
    return new Observer(data);//这个函数会在Vue实例创建时给data调用
  }
  ```

- ```javascript
  const Watcher = function(vm, fn) {
    const self = this;
    this.vm = vm;
    // 将当前Dep.target指向自己
    Dep.target = this;//注意是构造函数的target
    // 向Dep方法添加当前Wathcer
    this.addDep = function(dep) {
      dep.addSub(self);//dep的sub里边加入watcher
    }
    // 更新方法，用于触发vm._render
    this.update = function() {
      console.log('in watcher update');
      fn();
    }
    // 这里会首次调用vm._render，从而触发get将当前的Wathcer与Dep关联起来
    this.value = fn();
    // 这里清空了Dep.target，为了防止notify触发时，不停的绑定Watcher与Dep，
    // 造成代码死循环
    Dep.target = null;
  }
  ```

- ```javascript
  const Dep = function() {
    const self = this;
    // 收集目标
    this.target = null;
    // 存储收集器中需要通知的Watcher
    this.subs = [];
    // 当有目标时，绑定Dep与Wathcer的关系
    this.depend = function() {
      if (Dep.target) {
        Dep.target.addDep(self);
      }
    }
    // 为当前收集器添加Watcher
    this.addSub = function(watcher) {
      self.subs.push(watcher);
    }
    // 通知收集器中所的所有Wathcer，调用其update方法
    this.notify = function() {
      for (let i = 0; i < self.subs.length; i += 1) {
        self.subs[i].update();
      }
    }
  }
  ```

- 所以流程就是：new Vue的时候先observe，这样我们就搞出来每个data属性的dep，接下来等到mount环节new了一个Watcher，在watcher首次render，render会调用data的getter从而绑定watcher和deps，最后再解绑target防止多次get不停绑定(target在new Watcher的时候绑定到自己身上，注意这个是Dep构造函数的属性)。每当被监听的属性set时就会通知调用它身上的dep上的notify来通知绑定好的watcher来调用render。

### V3

```javascript
const targetMap = new WeakMap()
function track(target, key) {
    // 如果此时activeEffect为null则不执行下面
    // 这里判断是为了避免例如console.log(person.name)而触发track
    if (!activeEffect) return
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, depsMap = new Map())
    }

    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, dep = new Set())
    }
    dep.add(activeEffect) // 把此时的activeEffect添加进去
}
function trigger(target, key) {
    let depsMap = targetMap.get(target)
    if (depsMap) {
        const dep = depsMap.get(key)
        if (dep) {
            dep.forEach(effect => effect())
        }
    }
}
function reactive(target) {
    const handler = {
        get(target, key, receiver) {
            track(receiver, key) // 访问时收集依赖
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            Reflect.set(target, key, value, receiver)
            trigger(receiver, key) // 设值时自动通知更新
        }
    }
    return new Proxy(target, handler)
}
let activeEffect = null
function effect(fn) {
    activeEffect = fn
    activeEffect()
    activeEffect = null
}//这个函数暴露给外边用，fn就是回调函数
function ref(initValue) {
    return reactive({
        value: initValue
    })
}
function computed(fn) {
    const result = ref()
    effect(() => result.value = fn())
    return result
}
```

- targetMap->监听的对象，depsMap->被监听的属性，dep->属性改变时的副作用
- 这个就简单多了，其实就是在模板里确定data的effect，reactive实现一个proxy，设置get第一次进行绑定副作用，设置set执行副作用。然后首次调用绑定好targetMap、depsMap、dep，set时触发某个属性对应的deps。

### Computed

用这个来举例

在初始化时会执行一次计算属性的getter，这时候就会调用里边所有data的getter，这个getter因为代理使得他们被绑定到了对应的computed属性的watcher上，实现了依赖收集。

# 经典问题

## 生命周期父子局

### 加载渲染过程

父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted

### 更新过程

父beforeUpdate->子beforeUpdate->子updated->父updated

### 销毁过程

父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

## 信息传递

- 公共数据绑定到Vue上（EventBus）
- 使用pinan或Vuex
- prop
- provide+inject
- $attrs、$listeners(父组件的监听器们)，这个意思就是子组件先设置inherited:false,然后$attrs给孙子，v-on="$listeners"给孙子，这样父组件的东西就传给了孙子。
- Vue3的defineExpose({obj})可以把组件里的东西暴露出去。

## V2V3

- 响应式实现方式不一样
- 自定义v-model和.sync
- 组合式API出现
- 需要定义emit
- 虚拟dom优化
  - V3变成了头比头，尾比尾，最后基于最长递增子序列进行移动/添加/删除
  - 静态标记，跳过不会变化的结点
  - Vue3 中会把这个不参与更新的元素保存起来，只创建一次，之后在每次渲染的时候不停地复用
  - 缓存不变的事件。

## nextTick

- 接受一个回调函数作为参数，这个回调函数会在下一个事件循环中被执行，并且能够获取到更新后的DOM并且进行操作。除了传递回调函数之外，nextTick 方法还返回一个 Promise 对象，可以使用 await 关键字等方式等待 nextTick 执行完成
- Promise.then->MutationObserver->setImmediate->setTimeout(fn,0) 

### 状态更新

在vue中，更改数据后，会在微任务中更新dom，这是一个异步操作。 

在我们修改一个数据后，会触发setter，然后将对应的更新任务推导队列中，并调用`queueFlush`函数，这个函数会在一个Promise中调用`flushjobs`，这时候vue就会去做更新组件，更新dom的一些操作。 

改成同步：this.$update()

## keep-alive

- 使用的是LRU
- 缓存的是vue实例

# V2V3到底有啥区别

生命周期：其实没区别。。。setup接替了beforeCreate和created而已，还有destory->unmount

V3支持多个根节点

组合式API，这不废话吗

Suspense组件，#fallback空白时渲染

Teleport组件，to="css选择器"

V3用ts写的，更加支持ts

proxy代替definedefineProperty

增加 patchFlag 字段，帮助 diff 时区分静态节点，以及不同类型的动态节点，一定程度地减少节点本身及其属性的比对。 