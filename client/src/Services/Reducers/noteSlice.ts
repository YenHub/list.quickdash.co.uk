import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { noteClient } from '../../Views/Main'
import { NoteItem } from '../Database/NoteClient'

interface NoteState {
  noteState: NoteItem[]
}

const initialState: NoteState = {
  noteState: [],
}

export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<NoteItem[]>) => {
      noteClient.setNotes(action.payload)

      return { ...state, noteState: action.payload }
    },
  },
})

export const { setNotes } = noteSlice.actions

export default noteSlice.reducer
