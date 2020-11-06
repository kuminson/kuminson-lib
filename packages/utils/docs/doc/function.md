# function

## getOs()

- 描述：

获取当前设备类型

- 返回值：

`{'ios' | 'android' | 'desktop'}`

- 用法：

``` js
// navigator.userAgent -> 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12'
const type = utils.getOs()
// -> 'desktop'
```

## getUuid(len, radix)

- 描述：

生成唯一id

- 参数：
   - `{ number } [len]` - 要生成id的字符长度
   - `{ number } [radix]` - 要生成id的进制数

- 返回值：
   - `{ string }` 如果传入`len、radix`参数，返回相应长度和进制的随机数
   - `{ string }` 如果没有传入参数，返回符合rfc4122规范的uuid

- 用法：

``` js
utils.getUuid(10, 10)
// -> 'A069C95261'
utils.getUuid()
// -> 'E6B91ED9-DA10-4AA3-8919-225521620B72'
```

## midtextEllipsis(id, text)

- 描述：

根据容器宽度对给定文本进行中间省略

- 参数：
   - `{ string } id` - 目标容器的dom id
   - `{ string | number } text` - 要处理的文本

- 返回值：

`{ string }` 处理后中间增加省略号的文本

- 用法：

``` js
utils.midtextEllipsis('testDom', 'asdfghjklqewroiu')
// -> 'asdf...roiu'
```

## parseUrlParams()

- 描述：

解析url里的参数

只适用前端通信url 与后端通信url要用decodeURIComponent方法

- 返回值：

`{ object }` 反回key-value格式的对象

- 用法：

``` js
// location.search -> ?code=1&msg=all%20problem%20is%20ojbk
utils.parseUrlParams()
// -> {code: '1',msg: 'all problem is ojbk'}
```

## encodeUrlParam(obj)

- 描述：

编码给前端用的url参数

如果要发给后端要用encodeURIComponent方法

- 参数：
   - `{ object } obj` - 要编码的数据

- 返回值：

`{ string }` - 编码后的数据

- 用法：

``` js
utils.encodeUrlParam({
    code: 3,
    msg: '我即虫群'
})
// -> '?code=3&msg=%E6%88%91%E5%8D%B3%E8%99%AB%E7%BE%A4'
```

## numAddThousandSeparator(val)

- 描述：

给数字增加千位分隔符

- 参数：
   - `{ string|number } val` - 需要增加千位符的数字

- 返回值：

`{ string }` - 已加上千位符的数字

- 用法：

``` js
utils.numAddThousandSeparator('12312312812.12381')
// -> '12,312,312,812.12381'
```

## parseLastTime(t)

- 描述：

解析毫秒数为具体时间

- 参数：
   - `{ number } t` - 需要解析的毫秒数

- 返回值：

`{ string }` - 解析后的时间

- 用法：

``` js
utils.parseLastTime(1000 * 60 * 60 * 24 + 1000 * 60 * 60 + 1000 * 60 * 20 + 1000 * 20)
// -> '1day 1h 20m 20s'
utils.parseLastTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60)
// -> '2days 1h'
```

## addTrimFunc()

- 描述：

扩展没有去除前后空格方法的老环境

- 用法：

``` js
utils.addTrimFunc()
' asdl '.trim()
// -> 'asdl'
```

## safariReload()

- 描述：

修复safari下，页面反回后 只用缓存页面而不刷新页面问题

- 用法：

``` js
utils.safariReload()
```

## extensionArrayRemove(array, from, to)

- 描述：

数组可以像字符串一样移除元素

该方法会改变原数组

移除是包括from和to元素的

- 参数：
   - `{ array } array` - 目标数组
   - `{ number } from` - 要移除位置/开始移除位置
   - `{ number } [to]` - 结束位置

- 返回值：

`{ array }` - 改变后的数组

- 用法：

``` js
utils.extensionArrayRemove([0, 1, 2, 3, 4], 2)
// -> [0, 1, 3, 4]
utils.extensionArrayRemove([0, 1, 2, 3, 4], 2, 3)
// -> [0, 1, 4]
utils.extensionArrayRemove([0, 1, 2, 3, 4], -2)
// -> [0, 1, 2, 4]
utils.extensionArrayRemove([0, 1, 2, 3, 4], -2, -1)
// -> [0, 1, 2]
```

## getStringBytes(str, charset)

- 描述：

计算字符串字节长度

一个utf8数字占1个字节，一个utf8英文字母占1个字节，

少数是汉字每个占用3个字节(基本上等同于GBK，含21000多个汉字)，

多数占用4个字节(多数的意思是中日韩超大字符集里面的汉字，有5万多个)

- 参数：
   - `{ string } str` - 要计算的字符串
   - `{ string } [charset=utf-8]` - 字符串编码类型，默认utf-8

- 返回值：

`{ number }` - 反回字符串字节数

- 用法：

``` js
utils.getStringBytes('on my way')
// -> 9
utils.getStringBytes('致远星战况如何')
// -> 21
utils.getStringBytes('麗を返す')
// -> 12
```

## getUserAgentLanguage()

- 描述：

获取原生应用语言类型

- 返回值：

`{string|null}` - 国际化语言类型

- 用法：

``` js
// navigator.userAgent ->  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12/language=zh_Hans_HK'
utils.getUserAgentLanguage()
// -> 'zh_Hans_HK'
```

## getInputValue()

- 描述：

获取表单内容值

- 参数：
   - `{ string } formSelector` - form表单容器标签的css选择器
   - `{ function } [transform]` - 对获取的值进行转换的方法
      - transform 参数
        - `{string} val` - 获取的input值
        - `{string} name` - 值对应的名字
        - `{string} type` - 值的类型 'input'，'select'，'other'三个中的一个
      - transform 返回值
        - `{any} val` - 返回转换后的值

- 返回值：

`{ object }` - 表单的值对象

- 用法：

``` js
const formObj = utils.getInputValue('.form', (val, name, type) => {
  // 如果是输入框 去掉前后空格
  if (type === 'input' && typeof val === 'string') {
    return val.trim()
  }
  return val
})
```

- 备注：

   - 表单的input标签要用`data-validate`属性来做标记

      ``` html
      <div class="form">
        <input type="text" data-validate="name" value="Jack">
      </div>
      ```

      上面的例子`name`就是`getInputValue`返回的内容值的key

      ``` js
      const formObj = utils.getInputValue('.form')
      // formObj => {name: 'Jack'}
      ```

   - `getInputValue`还支持特殊表单值获取

      只要在表单上增加`data-validate-value`属性就可以被`getInputValue`方法获取

      ``` js
      <div class="form">
         <div data-validate="special" data-validate-value="zero"></div>
      </div>
      ```

      特殊表单可以在其它操作后修改`data-validate-value`属性的值，然后由`getInputValue`方法获取

      ``` js
      const formObj = utils.getInputValue('.form')
      // formObj => {special: 'zero'}
      ```
