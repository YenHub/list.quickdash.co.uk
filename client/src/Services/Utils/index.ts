export const debounce = <T extends (...args: unknown[]) => unknown>(
  callBack: T,
  wait: number,
  immediate: boolean,
) => {
  let timeout: ReturnType<typeof setTimeout> | null

  return (...params: unknown[]) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this,
      args = params
    const later = function () {
      timeout = null
      if (!immediate) callBack.apply(context, args)
    }
    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
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
 * // TODO: We should really have notes as a dictionary of note.ids or index
 * We can then avoid looking items up within arrays
 */
export const diffWithNewIndex = (
  arrayA: Record<string, unknown>[],
  arrayB: Record<string, unknown>[],
) => {
  const diff: Record<string, unknown>[] = []
  arrayB.forEach((it, index) => {
    const areEqual = JSON.stringify(it) === JSON.stringify(arrayA[index])
    if (!areEqual) diff.push({ ...it, index })
  })

  return diff
}
