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

export default {
  FireCounter
}