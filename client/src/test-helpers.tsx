import { act } from 'react-dom/test-utils'

import { fireEvent, screen } from '@testing-library/react'
import App from './App'
import { customRender } from './test-utils'

// DOM Helpers
export const initApp = () =>
  act(async () => {
    customRender(<App />)
  })
export const openNoteModal = () =>
  fireEvent.click(screen.getByTestId('create-note-button'))
export const openMainMenu = () =>
  fireEvent.click(screen.getByTestId('menu-button'))
export const closeMainMenu = () =>
  fireEvent.click(screen.getByTestId('close-menu-button'))
export const closeNoteModal = () =>
  fireEvent.click(screen.getByTestId('create-note-close').closest('button')!)
export const submitNote = () =>
  fireEvent.click(screen.getByTestId('create-note-submit').closest('button')!)
export const getNoteCount = () =>
  document.querySelectorAll('.MuiListItemText-secondary').length
export const toggleDarkMode = () =>
  openMainMenu() &&
  fireEvent.click(screen.getByTestId('dm-toggle')) &&
  closeMainMenu()
export const toggleMD = () =>
  openMainMenu() &&
  fireEvent.click(screen.getByTestId('md-toggle')) &&
  closeMainMenu()
export const toggleMDPreview = () =>
  openMainMenu() &&
  fireEvent.click(screen.getByTestId('md-preview-toggle')) &&
  closeMainMenu()
export const acceptActionDialog = () =>
  fireEvent.click(screen.getByTestId('action-dialog-accept'))
export const deleteAllNotes = () => {
  openMainMenu()
  fireEvent.click(screen.getByTestId('delete-all-notes'))
  acceptActionDialog()
  closeMainMenu()
}

export const setNoteTitle = (value: string) => {
  const titleInput = screen.getByLabelText('Note Title').closest('input')
  fireEvent.change(titleInput!, { target: { value } })
}

export const setNoteDesc = (value: string) => {
  const descInput = screen
    .getByLabelText('Note Description')
    .closest('textarea')
  fireEvent.change(descInput!, { target: { value } })
}

export const deleteLastNote = () => {
  const deleteButtons = screen.getAllByRole(/deleteNote/)
  fireEvent.click(deleteButtons[deleteButtons.length - 1])
  acceptActionDialog()
}
