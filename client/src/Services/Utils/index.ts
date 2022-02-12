export const debounce = <T extends Function>(
  callBack: T,
  wait: number,
  immediate: boolean,
) => {
  let timeout: any

  return (...params: any) => {
    const context = this,
      args = params
    const later = function () {
      timeout = null
      if (!immediate) callBack.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) callBack.apply(context, args)
  }
}
