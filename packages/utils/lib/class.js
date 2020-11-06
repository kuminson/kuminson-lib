import {
  INPUTTEXTTYPE,
  INPUTVALIDATENAME,
  INPUTVALIDATENAMEKEY
} from '../assets/constant'

/**
 * 触发器
 * @param {number} num - 触发次数
 * @param {function} fun - 触发后执行的方法
 * @param {(string|number)} [id] - 如果实例时传入id，触发时必须传入相同id才能触发
 */
class FireCounter {
  constructor (num, fun, id) {
    this.newNum(num)
    // 当前次数
    this.nowNum = 0
    // 需要触发的事件
    this.fireFun = fun
    // 触发识别码
    if (id !== undefined) {
      this.id = id
    } else {
      this.id = null
    }
  }

  fire (id) {
    // 如果构造时没有传入id 或者有传入id且与触发的id相同 可以完成一次触发
    if ((this.id !== null && this.id === id) || (this.id === null)) {
      this.nowNum += 1
      if (this.nowNum >= this.totalNum) {
        this.fireFun()
      }
    }
  }

  reset () {
    this.nowNum = 0
  }

  newNum (num) {
    // 需要关闭总次数
    if(num.toString() >= 0) {
      this.totalNum = num.toString()
    } else {
      this.totalNum = 0
    }
    this.reset()
  }
}

/**
 * 禁止滚动穿刺
 * @param {stirng} selector - 目标标签css选择器
 */
class NoScrollPuncture {
  constructor (selector) {
    this.dom = document.querySelector(selector)
    this.posY = 0
    this.maxScroll = 0
    // 帮定事件
    this._addEvent()
  }

  _touchStart (e) {
    const events = e.touches[0] || e
    // 缓存开始时y位置
    this.posY = events.pageY
    // 计算最大滚动距离
    this.maxScroll = this.dom.scrollHeight - this.dom.clientHeight
  }

  _touchMove (e) {
    // 如果没有滚动距离，禁止滚动
    if (this.maxScroll <= 0) {
      // 禁止滚动
      e.preventDefault()
    }
    // 获取当前滚动距离
    const scrollTop = this.dom.scrollTop
    // 计算滚动差
    const events = e.touches[0] || e
    const distanceY = events.pageY - this.posY
    // 上边缘检测
    if (distanceY > 0 && scrollTop === 0 && e.cancelable) {
      // 往上滑，并且到头
      // 禁止滚动的默认行为
      e.preventDefault()
      return
    }
    // 下边缘检测
    if (distanceY < 0 && (scrollTop + 1 >= this.maxScroll) && e.cancelable) {
      // 往下滑，并且到头
      // 禁止滚动的默认行为
      e.preventDefault()
    }
  }

  _addEvent () {
    this.startEvent = e => {this._touchStart(e)}
    this.endEvent = e => {this._touchMove(e)}
    this.dom.addEventListener('touchstart', this.startEvent)
    this.dom.addEventListener('touchmove', this.endEvent)
  }

  removeEvent () {
    this.dom.removeEventListener('touchstart', this.startEvent)
    this.dom.removeEventListener('touchmove', this.endEvent)
  }
}

/**
 * 输入框过滤器
 */
class InputFilter {
  constructor (formSelector, config) {
    const formEl = document.querySelector(formSelector)

    const itemEls = formEl.querySelectorAll(`[${INPUTVALIDATENAME}]`)

    const textType = INPUTTEXTTYPE

    const elementType = ['INPUT', 'TEXTAREA']

    this.config = config

    // 获取输入框元素
    this.inputEls = {}

    for (let item of itemEls) {
      if (elementType.indexOf(item.nodeName) === -1) {
        continue
      }
      if (!item.type || textType.indexOf(item.type) === -1) {
        continue
      }
      this.inputEls[item.dataset[INPUTVALIDATENAMEKEY]] = item
    }

    // 生成过滤事件
    this.inputFilterFunc = {}

    for (let key in this.config) {
      this.inputFilterFunc[key] = (e) => {
        let val = e.target.value
        for (let item of this.config[key]) {
          val = item(val)
        }
        e.target.value = val
      }
    }
  }

  add () {
    for (let key in this.config) {
      this.inputEls[key].addEventListener('input', this.inputFilterFunc[key], false)
    }
  }

  remove () {
    for (let key in this.config) {
      this.inputEls[key].removeEventListener('input', this.inputFilterFunc[key], false)
    }
  }
}

/**
 * 输入框内容过滤方法生成集合
 */
InputFilter.filter = {
  /**
   * 生成只有数字过滤器方法
   * @param {number} n - 保留几位小数 -1为无限个小数 0为没有小数
   * @return {function(*)} - 返回过滤器
   */
  onlyNumber (n) {
    let re
    if (n === 0) {
      re = new RegExp(/^\d+/)
    } else if (n === -1) {
      re = new RegExp('^\\d+\\.?(?:\\d)*')
    } else {
      re = new RegExp('^\\d+\\.?(?:\\d{0,' + n + '})?')
    }
    return (val) => {
      const newVal = val.match(re)
      let res = ''
      if (newVal !== null) {
        res = newVal[0]
      }
      return res
    }
  },
  /**
   * 生成 数字前没有0 的过滤器方法
   * @return {function(*)}
   */
  noZeroBefore () {
    return (val) => {
      return val.replace(/^0+([1-9][0-9]*(?:\.|\.[0-9]+)?)$/, '$1')
    }
  },
  /**
   * 生成 数字必须小于n 的过滤器方法
   * @param {number} n - 数字最大值
   * @return {function(*=)}
   */
  max (n) {
    return (val) => {
      let res = val
      if (Number(val) > n) {
        res = String(n)
      }
      return res
    }
  },
  /**
   * 生成 数字必须大于n 的过滤器方法
   * @param {number} n - 数字最小值
   * @return {function(*=)}
   */
  min (n) {
    return (val) => {
      let res = val
      if (Number(val) < n) {
        res = String(n)
      }
      return res
    }
  }
}


/**
 * 自动测试表单
 * 依赖getInputValue方法
 * @param {{}} para - 初始化参数
 * {[]} para.testConfig - 测试配置
 * {{}} para.validator - 测试库async-validator的实例
 * {string} para.formSelector - 表单选择器
 * @method test() - 进行边缘测试
 * @method fill() - 填充安全值
 */

/**
 * para.testConfig 参考
 * [
 * // 输入框
 * {
 *   key: 'name', // data-validate的值
 *   safe: 'asdfa', // 安全值
 *   test: [  // 要进行的边缘测试
 *     {type: 'required'},
 *     {type: 'max', max: 32, text: 'a'},
 *     {type: 'space', space: 'all', text: 'adbc'},
 *     {type: 'text', text: 'asd ads'},
 *     {type: 'text', text: '1231'}
 *   ]
 * },
 * // 选择框
 * {
 *   key: 'equipment',
 *   safe: ['mac', 'pc'],
 *   test: [
 *     {type: 'required'}
 *   ]
 * }
 * ]
 */
class AutoFillForm {

  constructor (para) {
    // 表单类型
    this.itemType = {
      textType: ['text', 'password', 'number', 'email', 'url', 'textarea'],
      checkType: ['checkbox', 'radio'],
    }

    // 输入框通用测试方法
    this._testValTextFunc = {
      // 必填
      required () {
        return ''
      },
      // 文本
      text (config) {
        return config.text
      },
      // 最大值
      max (config) {
        const num = Math.ceil(config.max / config.text.length) + 1
        let text = ''
        for (let i = 0; i < num; i++) {
          text += config.text
        }
        return text
      },
      // 空格
      space (config) {
        let text = config.text

        switch (config.space) {
          case 'before':
            text = ' ' + text
            break
          case 'after':
            text = text + ' '
            break
          case 'all':
            text = ' ' + text + ' '
        }

        return text
      }
    }

    // 选择框通用测试方法
    this._testValSelectFunc = {
      required () {
        return []
      }
    }

    // 测试用配置
    this.testConfig = para.testConfig

    // 效验实例
    this.validator = para.validator

    this.inputEls = this._getInputEls(para.formSelector)
  }

  // 获取表单元素
  _getInputEls (formSelector) {
    // 表单元素
    const formEl = document.querySelector(formSelector)
    const itemEls = formEl.querySelectorAll('[data-validate]')

    // 获取所有input元素
    const inputEls = {}

    for (let item of itemEls) {
      // 如果是输入框
      if (item.type && this.itemType.textType.indexOf(item.type) !== -1) {
        inputEls[item.dataset.validate] = item
      }
      // 如果是选择
      if (item.type && this.itemType.checkType.indexOf(item.type) !== -1) {
        if (inputEls[item.dataset.validate] === undefined) {
          inputEls[item.dataset.validate] = []
        }
        inputEls[item.dataset.validate].push(item)
        continue
      }
      // 如果是特殊类型
      // if (item.dataset.validateValue !== undefined) {
      //   inputEls[item.dataset.validate] = item
      // }
    }

    return inputEls
  }

  test () {
    return this._fillTest(true)
  }

  fill () {
    return this._fillTest(false)
  }

  async _fillTest (isTest) {
    // 对input元素进行边缘测试
    let testState = true

    for (let item of this.testConfig) {
      // 判断key对应的元素是否存在
      if (this.inputEls[item.key] === undefined) {
        continue
      }

      // 调用测试方法
      if (item.test !== undefined && isTest) {


        for (let testItem of item.test) {
          const testRes = await new Promise((resolve) => {
            // 获取焦点
            if (this.inputEls[item.key].length === undefined) {
              this.inputEls[item.key].focus()
            } else {
              this.inputEls[item.key][0].focus()
            }

            // 注入文本
            let itemVal = null
            // 如果是输入框
            if (this.inputEls[item.key].length === undefined) {
              itemVal = this._testValTextFunc[testItem.type](testItem)
              this._setValText(this.inputEls[item.key], itemVal)
            } else { // 如果是选择框
              itemVal = this._testValSelectFunc[testItem.type](testItem)
              this._setValSelect(this.inputEls[item.key], itemVal)
            }

            // 效验结果
            setTimeout(() => {
              const formObj = getInputValue('.form', (val, name, type) => {
                if (type === 'input' && typeof val === 'string') {
                  return val.trim()
                }
                return val
              })
              this.validator.validate(formObj).then(() => {
                console.log('效检');
                // 判断当前值与输入值 是否相等
                const valEqualState = this._isSameVal(this.inputEls[item.key], itemVal, formObj[item.key])
                // 如果当前值与输入值不同 则判为未通过
                if (!valEqualState) {
                  resolve(true)
                } else {
                  resolve(false)
                }
              }).catch(({ errors }) => {
                console.log('效检', errors);
                // 如果报错里含有目标元素 则边缘检测成功
                for (let child of errors) {
                  if (child.field === item.key) {
                    resolve(true)
                  }
                }
                // 如果报错里没有目标元素 判断值是否有变
                const valEqualState = this._isSameVal(this.inputEls[item.key], itemVal, formObj[item.key])
                if (!valEqualState) {
                  resolve(true)
                }
                resolve(false)
              })
            }, 20)
          })

          if (!testRes) {
            console.log('边缘测试未通过', testItem)
            testState = false
            break
          }

        }

      }

      // 注入安全内容
      if (this.inputEls[item.key].length === undefined) {
        this._setValText(this.inputEls[item.key], item.safe)
      } else { // 如果是选择框
        this._setValSelect(this.inputEls[item.key], item.safe)
      }



    }

    if (testState) {
      // 边缘测试 通过
      return true
    }
    return false
  }

  // 设置输入框内容
  _setValText(els, val) {
    const evt = new InputEvent('input', {
      inputType: 'insertText',
      data: val,
      dataTransfer: null,
      isComposing: false
    });
    els.value = val
    els.dispatchEvent(evt)
  }

  // 设置选择框内容
  _setValSelect(els, val) {
    for (let item of els) {
      if (val.indexOf(item.value) !== -1) {
        item.checked = true
      }
    }
  }

  // 判断输入值是否不一样
  _isSameVal (inputEls, testVal, inputVal) {
    // 判断当前值与输入值 是否相等
    let valEqualState = null
    if (inputEls.length === undefined) {
      valEqualState = testVal === inputVal
    } else { // 如果是选择框
      valEqualState = JSON.stringify(JSON.parse(JSON.stringify(testVal)).sort()) === JSON.stringify(JSON.parse(JSON.stringify(inputVal)).sort())
    }
    return valEqualState
  }
}


export default {
  FireCounter,
  NoScrollPuncture,
  InputFilter,
  AutoFillForm
}