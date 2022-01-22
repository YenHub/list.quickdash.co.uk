import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ModalState {
  modalState: {
    open: boolean
    editingNoteId: string | null
  }
}

const initialState: ModalState = {
  modalState: { open: false, editingNoteId: null },
}

export const settingSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalState: (state, action: PayloadAction<ModalState>) => ({
      ...state,
      modalState: action.payload.modalState,
    }),
  },
})

export const { setModalState } = settingSlice.actions

export default settingSlice.reducer
