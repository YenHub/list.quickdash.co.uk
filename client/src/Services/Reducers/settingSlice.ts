import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getBoolSetting,
  getNumberSetting,
  getStringSetting,
  setStringSetting,
} from '../Utils/ReactUtils'

export interface SettingState {
  darkMode: ReturnType<typeof getBoolSetting>
  mdMode: ReturnType<typeof getBoolSetting>
  previewMode: ReturnType<typeof getBoolSetting>
  colours: {
    primary: string
    secondary: string
  }
  connected: boolean
  webId: ReturnType<typeof getStringSetting> | null
  syncSequence: ReturnType<typeof getNumberSetting> | null
  version: ReturnType<typeof getNumberSetting> | null
}

const initialState: SettingState = {
  darkMode: getBoolSetting('darkMode'),
  mdMode: getBoolSetting('mdMode'),
  previewMode: getBoolSetting('previewMode'),
  colours: JSON.parse(getStringSetting('colours') ?? ''),
  connected: false,
  webId: getStringSetting('webId'),
  syncSequence: getNumberSetting('syncSequence'),
  version: getNumberSetting('syncSequence'),
}

export const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    togglePreviewMode: state => ({ ...state, previewMode: !state.previewMode }),
    toggleDarkMode: state => ({ ...state, darkMode: !state.darkMode }),
    toggleMdMode: state => ({ ...state, mdMode: !state.mdMode }),
    resetColours: state => {
      delete localStorage.colours

      return { ...state, darkMode: true }
    },
    setVersion: (
      state,
      action: PayloadAction<Pick<SettingState, 'version'>>,
    ) => ({
      ...state,
      version: action.payload.version,
    }),
    setWebId: (state, action: PayloadAction<Pick<SettingState, 'webId'>>) => ({
      ...state,
      webId: action.payload.webId,
    }),
    setSocketState: (
      state,
      action: PayloadAction<Pick<SettingState, 'connected'>>,
    ) => ({
      ...state,
      connected: action.payload.connected,
    }),
    setSyncSequence: (
      state,
      action: PayloadAction<Pick<SettingState, 'syncSequence'>>,
    ) => ({
      ...state,
      version: action.payload.syncSequence,
    }),
    setColours: (
      state,
      action: PayloadAction<Pick<SettingState, 'colours'>>,
    ) => {
      setStringSetting('colours', JSON.stringify(action.payload.colours))

      return {
        ...state,
        ...action.payload,
      }
    },
    setSyncSettings: (
      state,
      action: PayloadAction<
        Pick<SettingState, 'syncSequence' | 'version' | 'webId'>
      >,
    ) => ({
      ...state,
      ...action.payload,
    }),
    clearSyncSettings: state => ({
      ...state,
      version: null,
      syncSequence: null,
      webId: null,
    }),
  },
})

export const {
  toggleDarkMode,
  togglePreviewMode,
  setSocketState,
  toggleMdMode,
  setColours,
  resetColours,
  clearSyncSettings,
  setSyncSequence,
  setSyncSettings,
  setVersion,
  setWebId,
} = settingSlice.actions

export default settingSlice.reducer
