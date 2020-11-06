import {getKeyByAttr} from './methods'

// 文本输入框类型
export const INPUTTEXTTYPE = ['text', 'password', 'number', 'email', 'url', 'textarea']

// 文本输入框 自定义属性 效验key
export const INPUTVALIDATENAME = 'data-validate'
export const INPUTVALIDATENAMEKEY = getKeyByAttr(INPUTVALIDATENAME)

// 文本输入框 自定义属性 效验值
export const INPUTVALIDATEVALUE = 'data-validate-value'
export const INPUTVALIDATEVALUEKEY = getKeyByAttr(INPUTVALIDATEVALUE)