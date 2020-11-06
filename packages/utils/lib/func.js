import {
  INPUTTEXTTYPE,
  INPUTVALIDATENAME,
  INPUTVALIDATENAMEKEY,
  INPUTVALIDATEVALUEKEY,
} from '../assets/constant'

export default {
  /**
   * 获取当前设备类型
   * @return {string} - 设备类型
   */
  getOs () {
    let ua = navigator.userAgent || navigator.vendor || window.opener
    if (/ipad|iphone|ipod/i.test(ua)) {
      return 'ios'
    }
    if (/android/i.test(ua)) {
      return 'android'
    }
    return 'desktop'
  },
  /**
   * 生成唯一id
   * @param {number} [len] - 要生成id的字符长度
   * @param {number} [radix] - 要生成id的进制数
   * @return {string} - uuid
   */
  getUuid (len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = []
    let i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      let r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join('');
  },
  /**
   * 根据容器宽度对给定文本进行中间省略
   * @param {string} id - 目标dom的id
   * @param {(string|number)} text - 要处理的文本
   * @return {string} 处理后中间增加省略号的文本
   * TODO 增加算法 不要一个一个字符试 比如二分法
   * TODO 增加安全性 循环增加终止防护报错 比如加个计数器 循环超过5000次 终止并抛出错误
   */
  midtextEllipsis (id, text) {
    const targetEl = window.document.querySelector('#' + id)
    const testEl = document.createElement('div')
    testEl.style.whiteSpace = 'nowrap'
    testEl.style.opacity = 0

    let frontInfo = text.slice(0, Math.floor(text.length / 2))
    let endInfo = text.slice(Math.floor(text.length / 2))
    testEl.innerText = frontInfo + endInfo
    targetEl.appendChild(testEl)

    if (testEl.scrollWidth < targetEl.offsetWidth) {
      return text
    }

    testEl.innerText = frontInfo + '...' + endInfo
    while (testEl.scrollWidth - targetEl.offsetWidth > 2) {
      if (frontInfo.length > endInfo.length) {
        frontInfo = frontInfo.slice(0, -1)
      } else {
        endInfo = endInfo.slice(1)
      }
      testEl.innerText = frontInfo + '...' + endInfo
    }
    targetEl.removeChild(testEl)
    return frontInfo + '...' + endInfo
  },
  /**
   * 解析url里的参数
   * 只适用前端通信url 与后端通信url要用decodeURIComponent方法
   * @return {object} 反回key-value格式的对象
   */
  parseUrlParams () {
    const a = decodeURI(location.search)
    let params = {}
    let seg = a.replace(/^\?/, '').split('&')
    let len = seg.length
    let p;
    for (let i = 0; i < len; i++) {
      if (seg[i]) {
        p = seg[i].split('=');
        params[p[0]] = p[1];
      }
    }
    return params;
  },
  /**
   * 编码给前端用的url参数
   * 如果要发给后端要用encodeURIComponent方法
   * @param {object} obj - 要编码的数据
   * @return {string} - 编码后的数据
   */
  encodeUrlParam (obj) {
    let url = ''
    for (let key in obj) {
      if (obj[key] !== '' && obj[key] !== undefined) {
        url += '&' + key + '=' + obj[key]
      }
    }
    if (url === '') {
      return ''
    }
    url = url.replace(/^&/, '?')
    return encodeURI(url)
  },
  /**
   * 给数字增加千位分隔符
   * @param {(string|number)} val - 需要增加千位符的数字
   * @return {string} - 已加上千位符的数字
   */
  numAddThousandSeparator (val) {
    const num = String(val)
    return num.replace(/\d+/, function(s){
      return s.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    })
  },
  /**
   * 解析毫秒数为具体时间
   * @param {number} t - 需要解析的毫秒数
   * @return {string} - 解析后的时间
   * TODO 下个版本可以增加国际化 时间('day','h','m','s')做为参数传入
   */
  parseLastTime (t) {
    let diffTime = Number(t)
    let timeText = ''
    const timeArray = []

    if (diffTime < 1000) {
      return ''
    }

    const dhm = [
      {key: 'd', num: 60 * 60 * 24 * 1000},
      {key: 'h', num: 60 * 60 * 1000},
      {key: 'm', num: 60 * 1000}
    ]
    for (let i = 0; i < dhm.length; i++) {
      if (diffTime / dhm[i].num >= 1) {
        timeArray.push(Math.floor(diffTime / dhm[i].num))
        diffTime = diffTime - (Math.floor(diffTime / dhm[i].num) * (dhm[i].num))
      } else {
        timeArray.push(0)
      }
    }
    timeArray.push(Math.floor(Number(diffTime * 0.001) % (60)))

    const start = timeArray.findIndex((item) => {
      return item > 0
    })
    let end = JSON.parse(JSON.stringify(timeArray)).reverse().findIndex((item) => {
      return item > 0
    })
    end = (timeArray.length - 1) - end

    const timeName = ['day', 'h', 'm', 's']
    for (let i = start; i <= end; i++) {
      if (i === 0) {
        if (timeArray[i] > 1) {
          timeText = timeText + ' ' + timeArray[i] + 'days'
          continue
        }
      }
      timeText = timeText + ' ' + timeArray[i] + timeName[i]
    }
    this.addTrimFunc()
    return timeText.trim()
  },
  /**
   * 增加去除前后空格方法
   */
  addTrimFunc () {
    if (!String.prototype.trim) {
      String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
      };
    }
  },
  /**
   * 修复safari下，页面反回后 只用缓存页面而不刷新页面
   */
  safariReload () {
    let browserRule = /^.*((iPhone)|(iPad)|(Safari))+.*$/;
    if (browserRule.test(navigator.userAgent)) {
      window.onpageshow = function (e) {
        if (e.persisted || (window.performance && window.performance.navigation.type === 2)) {
          window.location.reload();
        }
      }
    }
  },
  /**
   * 数组可以像字符串一样移除元素
   * 该方法会改变原数组
   * 移除是包括from和to元素的
   * @param {array} array - 目标数组
   * @param {number} from - 要移除位置/开始移除位置
   * @param {number} [to] - 结束位置
   * @return {array} - 改变后的数组
   */
  extensionArrayRemove (array, from, to) {
    let rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    array.push.apply(array, rest);
    return array
  },
  /**
   * 计算字符串字节长度
   * 一个utf8数字占1个字节，一个utf8英文字母占1个字节，
   * 少数是汉字每个占用3个字节(基本上等同于GBK，含21000多个汉字)，
   * 多数占用4个字节(多数的意思是中日韩超大字符集里面的汉字，有5万多个)
   * @param {string} str - 要计算的字符串
   * @param {string} [charset=utf-8] - 字符串编码类型，默认utf-8
   * @return {number} - 反回字符串字节数
   */
  getStringBytes (str, charset) {
    let total = 0
    let charCode
    let i
    let len
    charset = charset ? charset.toLowerCase() : '';
    if (charset === 'utf-16' || charset === 'utf16') {
      for (i = 0, len = str.length; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode <= 0xffff) {
          total += 2;
        } else {
          total += 4;
        }
      }
    } else {
      for (i = 0, len = str.length; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode <= 0x007f) {
          total += 1;
        } else if (charCode <= 0x07ff) {
          total += 2;
        } else if (charCode <= 0xffff) {
          total += 3;
        } else {
          total += 4;
        }
      }
    }
    return total;
  },
  /**
   * 获取原生应用语言类型
   * @return {(string|null)} - 国际化语言类型
   */
  getUserAgentLanguage () {
    let r = window.navigator.userAgent.match(/language=(.+?)(?:\/|$)/);
    if (r != null) return decodeURI(r[1]);
    return null;
  },

  /**
   * 获取表单内容值
   * @param {string} formSelector - form表单标签的css选择器
   * @param {function} [transform] - 对获取的值进行转换
   * transform  param {string} val - 获取的值
   *            param {string} name - 值对应的名字
   *            param {string} type - 值的类型 'input'，'select'，'other'三个中的一个
   *            return {any} val - 返回转换后的值
   * @return {{}} 表单的值对象
   */
  getInputValue (formSelector, transform) {
    const formEl = document.querySelector(formSelector)

    const itemEls = formEl.querySelectorAll(`[${INPUTVALIDATENAME}]`)

    // 获取表单对象
    const formObj = {}

    const textType = INPUTTEXTTYPE
    const checkType = ['checkbox', 'radio']

    for (let item of itemEls) {
      // 如果是输入框
      if (item.type && textType.indexOf(item.type) !== -1) {
        let val = item.value
        if (typeof transform === 'function') {
          const res = transform(val, item.dataset[INPUTVALIDATENAMEKEY], 'input')
          val = res === undefined ? val : res
        }
        formObj[item.dataset[INPUTVALIDATENAMEKEY]] = val
        continue
      }
      // 如果是选择
      if (item.type && checkType.indexOf(item.type) !== -1) {
        let val = item.value
        if (typeof transform === 'function') {
          const res = transform(val, item.dataset[INPUTVALIDATENAMEKEY], 'select')
          val = res === undefined ? val : res
        }
        if (formObj[item.dataset[INPUTVALIDATENAMEKEY]] === undefined) {
          formObj[item.dataset[INPUTVALIDATENAMEKEY]] = []
        }
        if (item.checked) {
          formObj[item.dataset[INPUTVALIDATENAMEKEY]].push(val)
        }
        continue
      }
      // 如果是特殊类型
      if (item.dataset[INPUTVALIDATEVALUEKEY] !== undefined) {
        let val = item.dataset[INPUTVALIDATEVALUEKEY]
        if (typeof transform === 'function') {
          const res = transform(val, item.dataset[INPUTVALIDATENAMEKEY], 'other')
          val = res === undefined ? val : res
        }
        formObj[item.dataset[INPUTVALIDATENAMEKEY]] = val
      }

    }

    return formObj
  }



}


