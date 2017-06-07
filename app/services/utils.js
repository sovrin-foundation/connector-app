export const isContainsDefined = arr => {
  let isValDefined = true
  if (arr.length != 0) {
    arr.every(val => {
      if (typeof val == 'undefined') {
        isValDefined = false
        return false
      }
    })
  } else {
    isValDefined = false
  }
  return isValDefined
}
