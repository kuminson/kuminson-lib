import utils from '../dist/utils.js'

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