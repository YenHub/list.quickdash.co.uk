import { SettingState } from '../Reducers/settingSlice'

export const showGatedFeatures =
  process.env.REACT_APP_ENV === 'development' || process.env.REACT_APP_BETA === 'true'

export const getBoolSetting = (setting: keyof SettingState): boolean => {
  if (window.localStorage.getItem(setting)) {
    return window.localStorage.getItem(setting) === 'true'
  }

  if (showGatedFeatures && setting === 'mdMode') return true

  return setting !== 'mdMode'
}

export const getNumberSetting = (setting: keyof SettingState): number | null => {
  const number = window.localStorage.getItem(setting)

  return number ? Number(number) : null
}

export const setNumberSetting = (setting: keyof SettingState, value: number) =>
  window.localStorage.setItem(setting, String(value))

export const getStringSetting = (setting: keyof SettingState): string | null => {
  const string = window.localStorage.getItem(setting)
  if (string) return string
  if (setting === 'colours') {
    return JSON.stringify({ primary: '#08d2ff', secondary: '#ff0000' })
  }

  return null
}

export const setStringSetting = (setting: keyof SettingState, value: string): void =>
  window.localStorage.setItem(setting, value)

export const setBoolSetting = (setting: keyof SettingState, value: boolean): void =>
  localStorage.setItem(setting, value.toString())

export const persistAppSettings = ({
  version,
  syncSequence,
  webId,
}: {
  version: number
  syncSequence: number
  webId: string
}) => {
  setNumberSetting('version', version!)
  setNumberSetting('syncSequence', syncSequence!)
  setStringSetting('webId', webId!)
}

export const deleteSyncSettings = () => {
  localStorage.removeItem('version')
  localStorage.removeItem('syncSequence')
  localStorage.removeItem('webId')
}

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
