// 通过属性名获取元素data属性的key
export function getKeyByAttr (attr) {
  const noData = attr.replace(/^data-/, '')
  const hump = noData.replace(/-(\w)/g, (all, letter) => {
    return letter.toUpperCase()
  })
  return hump
}