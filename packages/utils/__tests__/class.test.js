import utils from '../dist/utils.js'
import Schema from 'async-validator'

beforeEach(() => {
  // 模拟计时器函数
  jest.useFakeTimers()
});

afterEach(() => {
  // 清除所有未决计时器
  jest.clearAllTimers()
});

test('fireCounter is run after 3 fired', () => {

  const callbackFn = jest.fn()

  const counter = new utils.FireCounter(3, callbackFn)

  counter.fire()

  expect(callbackFn).not.toBeCalled()

  setTimeout(() => {
    counter.fire()
  }, 2000)

  setTimeout(() => {
    counter.fire()
  }, 4000)

  // “快进”时间使得所有定时器回调被执行
  // jest.runAllTimers()

  // “快进”时间，使得所有定时器回调都被执行
  jest.advanceTimersByTime(2000)

  expect(callbackFn).not.toBeCalled()

  jest.advanceTimersByTime(2000)

  expect(callbackFn).toBeCalled()

});

test('fireCounter is run after 3 fired with Id', () => {

  const callbackFn = jest.fn()

  const counter = new utils.FireCounter(3, callbackFn, 'alkdfjsd')

  counter.fire('alkdfjsd')

  setTimeout(() => {
    counter.fire('alkdfjsd')
  }, 1000)

  setTimeout(() => {
    counter.fire('alkdfjsd')
  }, 2000)

  expect(callbackFn).not.toBeCalled()

  // “快进”时间使得所有定时器回调被执行
  jest.runAllTimers()

  expect(callbackFn).toBeCalled()


});

test('fireCounter is run after 0', () => {

  const callbackFn = jest.fn()

  const counter = new utils.FireCounter(0, callbackFn)

  counter.fire()


  expect(callbackFn).toBeCalled()

});

test('fireCounter is run after -3', () => {

  const callbackFn = jest.fn()

  const counter = new utils.FireCounter(-3, callbackFn)

  counter.fire()

  expect(callbackFn).toBeCalled()

});

describe('test form', () => {
  // 增加 input元素
  beforeEach(() => {
    window.document.body.innerHTML = `
    <div class="form">
      <div class="row"><input type="text" class="age" data-validate="age" placeholder="age"></div>
    </div>
    `
  })

  // 清除 input元素 防止污染全局
  afterEach(() => {
    window.document.body.innerHTML = ''
  })

  test('test inputFilter onlyNumber two decimal places', () => {
    const config = {
      age: [
        utils.InputFilter.filter.onlyNumber(2)
      ]
    }
    const inputFilter = new utils.InputFilter('.form', config)
    inputFilter.add()

    const ageEl = document.querySelector('.age')
    setValText(ageEl, '10.09123')

    expect(ageEl.value).toEqual('10.09')
  })

  test('test inputFilter onlyNumber no decimal', () => {
    const config = {
      age: [
        utils.InputFilter.filter.onlyNumber(0)
      ]
    }
    const inputFilter = new utils.InputFilter('.form', config)
    inputFilter.add()

    const ageEl = document.querySelector('.age')
    setValText(ageEl, '10.09123')

    expect(ageEl.value).toEqual('10')
  })

  test('test inputFilter noZeroBefore', () => {
    const config = {
      age: [
        utils.InputFilter.filter.noZeroBefore()
      ]
    }
    const inputFilter = new utils.InputFilter('.form', config)
    inputFilter.add()

    const ageEl = document.querySelector('.age')
    setValText(ageEl, '0010.09123')

    expect(ageEl.value).toEqual('10.09123')
  })

  test('test inputFilter max', () => {
    const config = {
      age: [
        utils.InputFilter.filter.max(10)
      ]
    }
    const inputFilter = new utils.InputFilter('.form', config)
    inputFilter.add()

    const ageEl = document.querySelector('.age')
    setValText(ageEl, '132.09123')

    expect(ageEl.value).toEqual('10')
  })

  test('test inputFilter min', () => {
    const config = {
      age: [
        utils.InputFilter.filter.min(10)
      ]
    }
    const inputFilter = new utils.InputFilter('.form', config)
    inputFilter.add()

    const ageEl = document.querySelector('.age')
    setValText(ageEl, '2.09123')

    expect(ageEl.value).toEqual('10')
  })

  test('test inputFilter multiple filter', () => {
    const config = {
      age: [
        utils.InputFilter.filter.onlyNumber(2),
        utils.InputFilter.filter.noZeroBefore()
      ]
    }
    const inputFilter = new utils.InputFilter('.form', config)
    inputFilter.add()

    const ageEl = document.querySelector('.age')
    setValText(ageEl, '002.09123')

    expect(ageEl.value).toEqual('2.09')
  })

  test('test inputFilter event remove', () => {
    const config = {
      age: [
        utils.InputFilter.filter.onlyNumber(2),
      ]
    }
    const inputFilter = new utils.InputFilter('.form', config)
    inputFilter.add()
    inputFilter.remove()

    const ageEl = document.querySelector('.age')
    setValText(ageEl, '002.09123')

    expect(ageEl.value).toEqual('002.09123')
  })
})


function setValText(els, val) {
  const evt = new InputEvent('input', {
    inputType: 'insertText',
    data: val,
    dataTransfer: null,
    isComposing: false
  });
  els.value = val
  els.dispatchEvent(evt)
}


describe('test AutoFillForm', () => {
  beforeEach(() => {
    window.document.body.innerHTML = `
    <div class="form">
      <div class="row"><input type="text" class="name" data-validate="name" placeholder="name"></div>
      <div class="row"><input type="text" class="age" data-validate="age" placeholder="age"></div>
      <div class="row"><input type="password" class="password" data-validate="password" placeholder="password"></div>
      <div class="row"><input type="password" class="confirm-password" data-validate="confirmPassword" placeholder="confirm password"></div>
      <div class="row"><input type="text" class="email" data-validate="email" placeholder="email"></div>
      <div class="row"><textarea class="address" data-validate="address" cols="30" rows="4" placeholder="address"></textarea></div>
      <div class="row">
        <label>
          <input type="radio" class="radio" data-validate="gender" name="gender" value="male">
          男
        </label>
        <label>
          <input type="radio" class="radio" data-validate="gender" name="gender" value="female">
          女
        </label>
      </div>
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
      <div class="row">
        <label>
          <input type="checkbox" class="checkbox" data-validate="agreement" value="agree">
          我已同意相关协议
        </label>
      </div>
    </div>
    `

  })

  // 清除 input元素 防止污染全局
  afterEach(() => {
    window.document.body.innerHTML = ''
  })

  test('test AutoFillForm fill', () => {
    const testConfig = [
      // 输入框
      {
        key: 'name',
        safe: 'asdfa'
      },
      {
        key: 'age',
        safe: '24'
      },
      // 选择框
      {
        key: 'equipment',
        safe: ['mac', 'pc']
      }
    ]
    const aff = new utils.AutoFillForm({
      testConfig: testConfig,
      formSelector: '.form',
    })
    aff.fill()
    const formVal = utils.getInputValue('.form')
    expect(formVal).toEqual({
      name: 'asdfa',
      age: '24',
      equipment: ['mac', 'pc'],
      password: '',
      confirmPassword: '',
      email: '',
      address: '',
      gender: [],
      agreement: [],
    })
  })

})