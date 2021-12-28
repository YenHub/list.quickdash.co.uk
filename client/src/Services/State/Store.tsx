import React, { createContext, useReducer } from 'react'

import { noteClient } from '../../Views/Main'
import { NoteItem } from '../Database/NoteClient'
import { getBoolSetting } from '../ReactUtils'

type DarkMode = boolean
type MDMode = boolean
type PreviewMode = boolean

interface State {
  darkMode: DarkMode
  mdMode: MDMode
  previewMode: PreviewMode
  noteState: NoteItem[]
}

export enum ToggleTypes {
  MarkDownToggle = 'MarkDownToggle',
  DarkModeToggle = 'DarkModeToggle',
  PreviewModeToggle = 'PreviewModeToggle',
}

export type Actions = { type: ToggleTypes.MarkDownToggle }
  | { type: ToggleTypes.DarkModeToggle }
  | { type: ToggleTypes.PreviewModeToggle }
  | { type: 'SetNotes', payload: NoteItem[] }

const initialState: State = {
  darkMode: getBoolSetting('darkMode'),
  mdMode: getBoolSetting('mdMode'),
  previewMode: getBoolSetting('previewMode'),
  noteState: [],
}

const store = createContext<{
  state: State,
  dispatch: React.Dispatch<Actions>,
}>({ state: initialState, dispatch: () => undefined })

const { Provider } = store

const StateProvider: React.FC = ({ children }: any) => {

  const stateReducer = (state: State, action: Actions): State => {
    switch (action.type) {
      case 'DarkModeToggle':
        return { ...state, darkMode: !state.darkMode }
      case 'MarkDownToggle':
        return { ...state, mdMode: !state.mdMode }
      case 'PreviewModeToggle':
        return { ...state, previewMode: !state.previewMode }
      case 'SetNotes':
        noteClient.setNotes([...action.payload])

        return { ...state, noteState: [...action.payload] }
      default:
        return { ...state }
    }
  }

  const [state, dispatch] = useReducer(stateReducer, initialState)

  const stateValue = { state, dispatch }

  return <Provider value={stateValue}>{children}</Provider>
}

export { store, StateProvider }
