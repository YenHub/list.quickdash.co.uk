import { createSlice } from '@reduxjs/toolkit'
import { getBoolSetting } from '../ReactUtils'

interface SettingState {
  darkMode: ReturnType<typeof getBoolSetting>
  mdMode: ReturnType<typeof getBoolSetting>
  previewMode: ReturnType<typeof getBoolSetting>
}

const initialState: SettingState = {
  darkMode: getBoolSetting('darkMode'),
  mdMode: getBoolSetting('mdMode'),
  previewMode: getBoolSetting('previewMode'),
}

export const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    togglePreviewMode: state => ({ ...state, previewMode: !state.previewMode }),
    toggleDarkMode: state => ({ ...state, darkMode: !state.darkMode }),
    toggleMdMode: state => ({ ...state, mdMode: !state.mdMode }),
  },
})

export const { toggleDarkMode, togglePreviewMode, toggleMdMode } =
  settingSlice.actions

export default settingSlice.reducer
