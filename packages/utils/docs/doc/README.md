# Class

## FireCounter (将要废弃)

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

- 备注:

   该方法可以用Promise.all()来实现，已经没有使用的必要，将会在后几个版本移除


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


## InputFilter


- 描述：

输入框过滤器

- 实例化：

`new utils.InputFilter(formSelector, config)`

- 实例化参数：

   - `{stirng} formSelector` - 表单容器标签css选择器

   - `{object} config` - 过滤方法配置

- 实例方法：

   - `add()` - 绑定过滤事件

   - `remove()` - 解除绑定的事件

- 静态方法：

   - `InputFilter.filter.onlyNumber(n)` - 生成只有数字过滤器方法

      {number} n - 保留几位小数 -1为无限个小数 0为没有小数

   - `InputFilter.filter.noZeroBefore()` - 生成 数字前没有0 的过滤器方法

   - `InputFilter.filter.max(n)` - 生成 数字必须小于n 的过滤器方法

      {number} n - 数字最大值

   - `InputFilter.filter.min(n)` - 生成 数字必须大于n 的过滤器方法

      {number} n - 数字最小值

- 用法：

``` js
// 配置过滤方法
const config = {
  age: [
    utils.InputFilter.filter.onlyNumber(2),
    utils.InputFilter.filter.noZeroBefore()
  ]
}
// 实例化过滤器
const inputFilter = new utils.InputFilter('.form', config)
// 挂载过滤方法
inputFilter.add()
// 两秒后 取消过滤方法
setTimeout(() => {
  inputFilter.remove()
}, 2000)
```


## AutoFillForm


- 描述：

自动测试表单，填充表单

- 实例化：

`new utils.AutoFillForm(para)`

- 实例化参数：

   - `{object} para` - 初始化参数

      - `{array} para.testConfig` - 测试配置

      - `{object} para.validator` - 测试库async-validator的实例

      - `{string} para.formSelector` - 表单选择器

- 实例方法：

   - `fill()` - 填充安全值

   - `test()` - 进行边缘测试

      返回值 `{boolean}` true - 边缘测试成功  false - 边缘测试失败

- 用法：

   - `fill()`填充安全值不用传入`validator`参数

      ``` html
      <div class="form">
        <div class="row"><input type="text" class="name" data-validate="name" placeholder="name"></div>
        <div class="row"><input type="text" class="age" data-validate="age" placeholder="age"></div>
        <div class="row">
          <label>
            <input type="checkbox" class="checkbox" data-validate="equipment" name="equipment" value="mac">
            mac
          </label>
          <label>
            <input type="checkbox" class="checkbox" data-validate="equipment" name="equipment" value="pc">
            pc
          </label>
          <label>
            <input type="checkbox" class="checkbox" data-validate="equipment" name="equipment" value="mobile">
            mobile
          </label>
        </div>
      </div>
      ```

      ``` js
      const testConfig = [
        {
          // 输入框
          key: 'name',
          safe: 'asdfa'
        },{
          key: 'age',
          safe: '24'
        },{
          // 选择框
          key: 'equipment',
          safe: ['mac', 'pc']
        }
      ]
      const aff = new utils.AutoFillForm({
        testConfig: testConfig,
        formSelector: '.form',
      })
      aff.fill()
      ```

   - `test()`必须传入`validator`参数

      ``` js
      const descriptor = {
        name: [
          {
            // 必填
            type: 'string', required: true,
            // 国际化
            message: () => i18next.t('title')
            // transform (val) {
            //   return val.trim()
            // }
          }, {
            // 正则
            type: 'string', pattern: new RegExp('^[a-zA-Z]+$'),
            message: 'Names can only be letters'
          }, {
            type: 'string', max: 32,
            message: 'The name should be less than 32 bits'
          }
        ],
        age: [
          {
            type: 'string', required: true,
            message: 'The age cannot be empty'
          }
        ],
        equipment: [
          {
            type: 'array', required: true,
            message: 'The equipment cannot be empty'
          }
        ]
      }

      const validator = new Schema(descriptor)

      const testConfig = [
        // 输入框
        {
          key: 'name',
          safe: 'asdfa',
          test: [
            {type: 'required'},
            {type: 'max', max: 32, text: 'a'},
            {type: 'space', space: 'all', text: 'adbc'},
            {type: 'text', text: 'asd ads'},
            {type: 'text', text: '1231'}
          ]
        },
        {
          key: 'age',
          safe: '24',
          test: [
            {type: 'required'},
            {type: 'space', space: 'all', text: '99'},
            {type: 'text', text: '3 1'},
            {type: 'text', text: '1231'}
          ]
        },
        // 选择框
        {
          key: 'equipment',
          safe: ['mac', 'pc'],
          test: [
            {type: 'required'}
          ]
        }
      ]

      const aff = new autoFillForm({
        testConfig: testConfig,
        validator: validator,
        formSelector: '.form',
      })
      aff.test().then(val => {
        console.log('val', val)
      })
      ```

      `type` 可选值为 `required, text, max, space`



