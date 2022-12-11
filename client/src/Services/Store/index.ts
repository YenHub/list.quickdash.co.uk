import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import modalSlice from '../Reducers/modalSlice'
import noteSlice from '../Reducers/noteSlice'
import settingSlice from '../Reducers/settingSlice'

const store = configureStore({
  reducer: {
    settings: settingSlice,
    modal: modalSlice,
    notes: noteSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {settings: SettingsState, modal: ModalState, notes: NoteState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
