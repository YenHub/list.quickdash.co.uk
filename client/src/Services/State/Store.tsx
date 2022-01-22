import { NoteItem } from '../Database/NoteClient'

export enum ToggleTypes {
  MarkDownToggle = 'MarkDownToggle',
  DarkModeToggle = 'DarkModeToggle',
  PreviewModeToggle = 'PreviewModeToggle',
}

export interface Actions {
  type: 'SetNotes'
  payload: NoteItem[]
}
