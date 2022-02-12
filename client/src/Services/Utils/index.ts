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

/**
 * Returns the items from objB that differ to objA along with the new index
 *
 * `index` is always inferred by the position of an item in NoteItem[] and not persisted
 *
 * This is used to identify items that require syncing between two state objects
 *
 * e.g.
 * We can use the resulting diff to reduce API overhead and simply
 * post a syncItemIndex(note.webId, index) alone to update their index values
 *
 */
export const diffWithNewIndex = (
  objA: Record<string, any>[],
  objB: Record<string, any>[],
) => {
  const diff: Record<string, any>[] = []
  objB.forEach((it, index) => {
    const areEqual = JSON.stringify(it) === JSON.stringify(objA[index])
    if (!areEqual) diff.push({ ...it, index })
  })

  return diff
}
