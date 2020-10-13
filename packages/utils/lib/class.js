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
export class NoScrollPuncture {
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

export default {
  FireCounter,
  NoScrollPuncture
}