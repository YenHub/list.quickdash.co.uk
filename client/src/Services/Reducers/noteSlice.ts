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
    deleteNote: (state, action: PayloadAction<number>) => {
      const newNotes = [...state.noteState]
      newNotes.splice(action.payload, 1)
      noteClient.setNotes(newNotes)

      return { ...state, noteState: newNotes }
    },
  },
})

export const { setNotes, deleteNote } = noteSlice.actions

export default noteSlice.reducer
