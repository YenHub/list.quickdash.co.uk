const isIE = () =>
  navigator.userAgent.indexOf('MISE ') !== -1 ||
  !!navigator.userAgent.match(/Trident.*rv:11\./)

export const downloadFile = (content: string): void => {
  const _fileName = `QuickList-${new Date()
    .toLocaleDateString()
    .replace(/\//g, '-')}.txt`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  if (isIE() && (window.navigator as any).msSaveOrOpenBlob) {
    // for IE versions 10+
    const blobObject = new Blob([content])
    // Download using MS msSaveOrOpenBlob
    // tslint:disable-next-line: align
    ;(window.navigator as any).msSaveOrOpenBlob(blobObject, _fileName)
  } else {
    // All other browsers
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', _fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const sortTable = (e: MouseEvent) => {
  // Identify the index of the column clicked
  const element = e.target as HTMLElement
  if (element.tagName !== 'TH') return

  const columnInd = Array.from(element.parentNode!.children).indexOf(element)
  const table = element.closest('table')
  const sortAsc = element.getAttribute('data-sortAsc') === 'true'
  let switching = true
  let rows, i, shouldSwitch
  /* Iterate our elements until no more switching is required */
  while (switching) {
    /* Assume we don't need to switch */
    switching = false
    rows = table!.rows
    /* Iterate all but the first row (header) */
    for (i = 1; i < rows.length - 1; i++) {
      /* Assume we don't need to switch */
      shouldSwitch = false
      /* Get the text for the cells we want to compare */
      const textX = rows[i]
        .getElementsByTagName('TD')
        [columnInd].innerHTML.toString()
      const textY = rows[i + 1]
        .getElementsByTagName('TD')
        [columnInd].innerHTML.toString()
      const triggerSwitch = sortAsc
        ? textX.localeCompare(textY) < 0
        : textX.localeCompare(textY) > 0

      if (triggerSwitch) {
        /* Break out of the loop & switch rows */
        shouldSwitch = true
        break
      }
    }
    if (shouldSwitch) {
      /* Switch the elements & continue switching */
      rows[i].parentNode!.insertBefore(rows[i + 1], rows[i])
      switching = true
    }
  }
  element.setAttribute('data-sortAsc', sortAsc ? 'false' : 'true')
}
