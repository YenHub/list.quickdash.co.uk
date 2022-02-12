export type Setting = 'mdMode' | 'darkMode' | 'previewMode' | 'colours'

export const showGatedFeatures =
  process.env.REACT_APP_ENV === 'development' || process.env.REACT_APP_BETA === 'true'

export const getBoolSetting = (setting: Setting): boolean => {
  if (window.localStorage.getItem(setting)) {
    return window.localStorage.getItem(setting) === 'true'
  }

  if (showGatedFeatures && setting === 'mdMode') return true

  return setting !== 'mdMode'
}

export const getStringSetting = (setting: Setting): string => {
  const string = window.localStorage.getItem(setting)
  if (string) return string
  if (setting === 'colours') {
    return JSON.stringify({ primary: '#08d2ff', secondary: '#ff0000' })
  } else return ''
}

export const setStringSetting = (setting: Setting, value: string): void =>
  window.localStorage.setItem(setting, value)

export const setBoolSetting = (setting: Setting, value: boolean): void =>
  localStorage.setItem(setting, value.toString())

export const bigLog = (msg: string, colour?: string): void => {
  if (!showGatedFeatures) return

  console.log(
    `

            ${colour ? '%c' : ''}${msg}

        `,
    colour ?? '',
  )
}

export const errorLog = (msg: string) => bigLog(msg, 'color: orangered')
export const successLog = (msg: string) => bigLog(msg, 'color: chartreuse')

export const groupLog = (name: string, msg: any): void => {
  if (!showGatedFeatures) return

  console.groupCollapsed(name)
  console.log(msg)
  console.groupEnd()
}

export const shallowCompareIdentical = (objA: any, objB: any): boolean =>
  !Object.keys(objA).some(key => objA[key] !== objB[key])
