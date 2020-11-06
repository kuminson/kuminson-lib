import * as methods from '../assets/methods'

describe('test getKeyByAttr', () => {
  test('one -', () => {
    const attr = 'data-validate'
    expect(methods.getKeyByAttr(attr)).toBe('validate')
  })

  test('two -', () => {
    const attr = 'data-validate-value'
    expect(methods.getKeyByAttr(attr)).toBe('validateValue')
  })
})