import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  getBoolSetting,
  getStringSetting,
  setStringSetting,
} from '../ReactUtils'

interface SettingState {
  darkMode: ReturnType<typeof getBoolSetting>
  mdMode: ReturnType<typeof getBoolSetting>
  previewMode: ReturnType<typeof getBoolSetting>
  colours: {
    primary: string
    secondary: string
  }
}

const initialState: SettingState = {
  darkMode: getBoolSetting('darkMode'),
  mdMode: getBoolSetting('mdMode'),
  previewMode: getBoolSetting('previewMode'),
  colours: JSON.parse(getStringSetting('colours')).colours,
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
  },
})

export const {
  toggleDarkMode,
  togglePreviewMode,
  toggleMdMode,
  setColours,
  resetColours,
} = settingSlice.actions

export default settingSlice.reducer
