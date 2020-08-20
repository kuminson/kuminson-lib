import utils from '../dist/utils'

describe('change userAgent', () => {
  // 防止污染全局userAgent
  let userAgent = ''

  beforeAll(() => {
    userAgent = navigator.userAgent
  });

  afterAll(() => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: userAgent
    })
  });

  test('getOs is desktop', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12'
    })
    expect(utils.getOs()).toBe('desktop')
  });

  test('getOs is ios', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    })
    expect(utils.getOs()).toBe('ios')
  });

  test('getOs is android', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'
    })
    expect(utils.getOs()).toBe('android')
  });

})

test('getUuid is string with 10 length 10 hexadecimal', () => {
  expect(utils.getUuid(10, 10)).toEqual(expect.stringMatching(/^[0-9]{10}$/))
});

test('getUuid is string with 10 length 16 hexadecimal', () => {
  expect(utils.getUuid(10, 16)).toEqual(expect.stringMatching(/^[0-9A-F]{10}$/))
});
test('getUuid is string with rfc4122', () => {
  expect(utils.getUuid()).toEqual(expect.stringMatching(/^[0-9A-F]{8}-([0-9A-F]{4}-){3}[0-9A-F]{12}$/))
});

describe('testDom', () => {
  let container = null

  beforeAll(() => {
    container = document.createElement('div')
    container.style.width = '100px'
    container.style.height = '20px'
    container.style.fontSize = '16px'
    container.id = 'testDom'
    document.body.appendChild(container)
  });

  afterAll(() => {
    document.body.removeChild(container)
  });

  test('midtextEllipsis is string', () => {
    expect(utils.midtextEllipsis('testDom', 'asdfghjklqewroiu')).toEqual(expect.stringMatching(/\.{3}/))
  });
})


describe('location search change', () => {

  afterAll(() => {
    window.history.pushState({}, '', '/')
  });

  test('parseUrlParams is object with space', () => {
    window.history.pushState({}, '', '/?code=1&msg=all%20problem%20is%20ojbk')
    expect(utils.parseUrlParams()).toEqual({
      code: '1',
      msg: 'all problem is ojbk'
    })
  });

  test('parseUrlParams is object with punctuation', () => {
    window.history.pushState({}, '', '/?code=2&msg=name-%3Ewuming')
    expect(utils.parseUrlParams()).toEqual({
      code: '2',
      msg: 'name->wuming'
    })
  });

  test('parseUrlParams is object with punctuation', () => {
    window.history.pushState({}, '', '/?code=3&msg=%E6%88%91%E5%8D%B3%E8%99%AB%E7%BE%A4')
    expect(utils.parseUrlParams()).toEqual({
      code: '3',
      msg: '我即虫群'
    })
  });

})

test('encodeUrlParam is string has space', () => {
  expect(utils.encodeUrlParam({
    code: 1,
    msg: 'all problem is ojbk'
  })).toBe('?code=1&msg=all%20problem%20is%20ojbk')
});

test('encodeUrlParam is string has punctuation', () => {
  expect(utils.encodeUrlParam({
    code: 2,
    msg: 'name->wuming'
  })).toBe('?code=2&msg=name-%3Ewuming')
});

test('encodeUrlParam is string has Chinese', () => {
  expect(utils.encodeUrlParam({
    code: 3,
    msg: '我即虫群'
  })).toBe('?code=3&msg=%E6%88%91%E5%8D%B3%E8%99%AB%E7%BE%A4')
});



test('numAddThousandSeparator is string', () => {
  expect(utils.numAddThousandSeparator(12312312812)).toBe('12,312,312,812')
  expect(utils.numAddThousandSeparator(12312312812.12381)).toBe('12,312,312,812.12381')
});

test('numAddThousandSeparator is string', () => {
  expect(utils.numAddThousandSeparator('12312312812')).toBe('12,312,312,812')
  expect(utils.numAddThousandSeparator('12312312812.12381')).toBe('12,312,312,812.12381')
  expect(utils.numAddThousandSeparator('000000012312312812.12381')).toBe('000,000,012,312,312,812.12381')
});




test('parseLastTime is string', () => {
  expect(utils.parseLastTime(800)).toBe('')
  expect(utils.parseLastTime(1000)).toBe('1s')
  expect(utils.parseLastTime(1000 * 60)).toBe('1m')
  expect(utils.parseLastTime(1000 * 60 * 60)).toBe('1h')
  expect(utils.parseLastTime(1000 * 60 * 60 * 24)).toBe('1day')
  expect(utils.parseLastTime(1000 * 60 * 60 * 24 * 2)).toBe('2days')
  expect(utils.parseLastTime(1000 * 60 + 1000 * 10)).toBe('1m 10s')
  expect(utils.parseLastTime(1000 * 60 * 60 + 1000 * 60 * 20 + 1000 * 20)).toBe('1h 20m 20s')
  expect(utils.parseLastTime(1000 * 60 * 60 + 1000 * 20)).toBe('1h 0m 20s')
  expect(utils.parseLastTime(1000 * 60 * 60 + 1000 * 60 * 20)).toBe('1h 20m')
  expect(utils.parseLastTime(1000 * 60 * 60 * 24 + 1000 * 60 * 60 + 1000 * 60 * 20 + 1000 * 20)).toBe('1day 1h 20m 20s')
  expect(utils.parseLastTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 + 1000 * 60 * 20 + 1000 * 20)).toBe('2days 1h 20m 20s')
  expect(utils.parseLastTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 + 1000 * 60 * 20)).toBe('2days 1h 20m')
  expect(utils.parseLastTime(1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60)).toBe('2days 1h')
});



test('extensionArrayRemove is Array', () => {
  expect(utils.extensionArrayRemove([0, 1, 2, 3, 4], 2)).toEqual([0, 1, 3, 4])
  expect(utils.extensionArrayRemove([0, 1, 2, 3, 4], 2, 3)).toEqual([0, 1, 4])
  expect(utils.extensionArrayRemove([0, 1, 2, 3, 4], -2)).toEqual([0, 1, 2, 4])
  expect(utils.extensionArrayRemove([0, 1, 2, 3, 4], -2, -1)).toEqual([0, 1, 2])
});


test('getStringBytes is Number', () => {
  expect(utils.getStringBytes('on my way')).toBe(9)
  expect(utils.getStringBytes('致远星战况如何')).toBe(21)
  expect(utils.getStringBytes('麗を返す')).toBe(12)
});

describe('change userAgent', () => {
  // 防止污染全局userAgent
  let userAgent = ''

  beforeAll(() => {
    userAgent = navigator.userAgent
  });

  afterAll(() => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: userAgent
    })
  });

  test('getUserAgentLanguage is en', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12/language=en'
    })
    expect(utils.getUserAgentLanguage()).toBe('en')
  });

  test('getUserAgentLanguage is zh_Hans_HK', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12/language=zh_Hans_HK'
    })
    expect(utils.getUserAgentLanguage()).toBe('zh_Hans_HK')
  });

  test('getUserAgentLanguage is ', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12/language=en_JP/mes=ok'
    })
    expect(utils.getUserAgentLanguage()).toBe('en_JP')
  });
})