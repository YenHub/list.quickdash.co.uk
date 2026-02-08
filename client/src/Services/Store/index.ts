import { create } from 'zustand'

import { noteClient } from '../../Views/Main'
import { type NoteItem } from '../Database/NoteClient'
import {
  getBoolSetting,
  getNumberSetting,
  getStringSetting,
  setStringSetting,
} from '../Utils/ReactUtils'

interface ModalState {
  open: boolean
  editingNoteId: string | null
}

interface NoteState {
  noteState: NoteItem[]
}

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

interface AppState {
  modal: ModalState
  notes: NoteState
  settings: SettingState
}

interface AppActions {
  /* Modal actions */
  setModalState: (modalState: Partial<ModalState>) => void

  /* Note actions */
  setNotes: (notes: NoteItem[]) => void
  deleteNote: (index: number) => void

  /* Setting actions */
  togglePreviewMode(): void
  toggleDarkMode(): void
  toggleMdMode(): void
  resetColours(): void
  setVersion(version: number | null): void
  setWebId(webId: string | null): void
  setSocketState(connected: boolean): void
  setSyncSequence(syncSequence: number | null): void
  setColours(colours: { primary: string; secondary: string }): void
  setSyncSettings(settings: {
    version: number | null
    webId: string | null
    syncSequence: number | null
  }): void
  clearSyncSettings(): void
}

type AppStore = AppActions & AppState

/* Initial App State */
const initialModalState: ModalState = { open: false, editingNoteId: null }
const initialNotesState: NoteState = { noteState: [] }
const initialSettingsState: SettingState = {
  connected: false,
  webId: getStringSetting('webId'),
  syncSequence: getNumberSetting('syncSequence'),
  version: getNumberSetting('syncSequence'),
  mdMode: getBoolSetting('mdMode'),
  darkMode: getBoolSetting('darkMode'),
  previewMode: getBoolSetting('previewMode'),
  colours: JSON.parse(getStringSetting('colours') ?? '{}'),
}

export const useAppStore = create<AppStore>()((set, get) => ({
  /* Initial App State */
  modal: { ...initialModalState },
  notes: { ...initialNotesState },
  settings: { ...initialSettingsState },

  /* Modal actions */
  setModalState: modalState =>
    set(state => ({ modal: { ...state.modal, ...modalState } })),

  /* Note actions */
  setNotes: notes => {
    noteClient.setNotes(notes)
    set(state => ({ notes: { ...state.notes, noteState: notes } }))
  },

  deleteNote: index => {
    set(state => {
      const newNotes = [...state.notes.noteState]
      newNotes.splice(index, 1)
      noteClient.setNotes(newNotes)

      return { notes: { ...state.notes, noteState: newNotes } }
    })
  },

  /* Setting actions */
  togglePreviewMode: () =>
    set(state => ({
      settings: { ...state.settings, previewMode: !state.settings.previewMode },
    })),

  toggleDarkMode: () =>
    set(state => ({
      settings: { ...state.settings, darkMode: !state.settings.darkMode },
    })),

  toggleMdMode: () =>
    set(state => ({
      settings: { ...state.settings, mdMode: !state.settings.mdMode },
    })),

  resetColours: () => {
    localStorage.removeItem('colours')

    set(state => ({ settings: { ...state.settings, darkMode: true } }))
  },

  setVersion: version => set(state => ({ settings: { ...state.settings, version } })),

  setWebId: webId => set(state => ({ settings: { ...state.settings, webId } })),

  setSocketState: connected =>
    set(state => ({ settings: { ...state.settings, connected } })),

  setSyncSequence: syncSequence =>
    set(state => ({ settings: { ...state.settings, version: syncSequence } })),

  setColours: colours => {
    setStringSetting('colours', JSON.stringify(colours))

    set(state => ({ settings: { ...state.settings, colours } }))
  },

  setSyncSettings: settings =>
    set(state => ({ settings: { ...state.settings, ...settings } })),

  clearSyncSettings: () =>
    set(state => ({
      settings: { ...state.settings, version: null, syncSequence: null, webId: null },
    })),
}))
