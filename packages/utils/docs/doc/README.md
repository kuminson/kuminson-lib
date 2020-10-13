# Class

## FireCounter

- 描述

异步触发器

- 实例化：

`new utils.FireCounter(num, fun, id)`

- 实例化参数：

   - `{number} num` - 触发次数
   - `{function} fun` - 触发后执行的方法
   - `{string|number} [id]` - 如果实例时传入id，触发时必须传入相同id才能触发

- 实例方法：

   - `fire(id)` - 触发一次触发器
      - `{string|number} [id]` - 如果实例化时传入id，触发时必须传入相同id才能触发
   - `reset()` - 重置触发器次数
   - `newNum(num)` - 设置新的触发器次数，同时会重置触发器
      - `{number} num` - 重新设置触发的次数

- 用法：

``` js
const doSomeThing = () => {}

const counter = new utils.FireCounter(3, doSomeThing)

counter.fire()

setTimeout(() => {
    counter.fire()
}, 1000)

setTimeout(() => {
    counter.fire()
}, 3000)
```

上面方法会在3秒后第三次调用`counter.fire()`后，会触发`doSomeThing`方法。


## NoScrollPuncture


- 描述

禁止滚动穿刺

- 实例化：

`new utils.NoScrollPuncture(selector)`

- 实例化参数：

   - `{stirng} selector` - 目标标签css选择器

- 实例方法：

   - `removeEvent()` - 解除邦定的事件

- 用法：

``` js
const ns = new utils.NoScrollPuncture('.test')

setTimeout(() => {
  ns.removeEvent()
}, 2000)
```