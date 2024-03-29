import { screen } from '@testing-library/react'

import {
  closeNoteModal,
  deleteAllNotes,
  deleteLastNote,
  getNoteCount,
  initApp,
  openNoteModal,
  setNoteDesc,
  setNoteTitle,
  submitNote,
  toggleMD,
} from '../../test-helpers'

beforeEach(async () => {
  await initApp()
})

describe('Note Functions', () => {
  test('Can delete notes', async () => {
    const initialCount = getNoteCount()

    // Run delete note routine
    deleteLastNote()

    // Check a note was deleted
    expect(getNoteCount()).toBe(initialCount - 1)

    // Refresh the window
    global.location.assign('')

    // Check the notes persist a refresh
    expect(getNoteCount()).toBe(initialCount - 1)
  })

  test('Can delete list', async () => {
    const initialNoteCount = getNoteCount()

    // Run delete note routine
    deleteAllNotes()

    // Ensure we had some notes to delete first :p
    expect(getNoteCount()).toBeLessThan(initialNoteCount)

    // Check there are no notes
    expect(getNoteCount()).toBe(0)
  })

  test('Cannot create blank notes', async () => {
    // Open the note modal & check the submit button is disabled
    openNoteModal()
    expect(screen.getByTestId('create-note-submit').closest('button')).toBeDisabled()

    // Check count before > attempt to submit > check count after
    const expectedCount = getNoteCount()

    // Try to submit the blank note anyway
    submitNote()

    // Check the count hasn't changed
    expect(getNoteCount()).toBe(expectedCount)
  })

  test('Can create a note with only a title', async () => {
    const expectedCount = getNoteCount()
    openNoteModal()
    setNoteTitle('Dondollo')
    submitNote()
    // Check modal has closed
    expect(screen.queryByTestId('create-note-submit')).toBeNull()
    // Check the note was created
    expect(screen.queryByText(/(Dondollo)/i)).toBeInTheDocument()
    expect(getNoteCount()).toBe(expectedCount + 1)
  })

  test('Can create a note with only a desc', async () => {
    const expectedCount = getNoteCount()
    openNoteModal()
    setNoteDesc('Only Desc ab123')
    submitNote() && closeNoteModal()
    // Test the modal is closed
    expect(screen.queryByTestId('create-note-submit')).toBeNull()
    // Test if the note has been created
    expect(screen.queryByText(/Only Desc ab123/i)).toBeInTheDocument()
    expect(getNoteCount()).toBe(expectedCount + 1)
  })

  test('Can create a note using Markdown', async () => {
    // Create a new note with a MD <hr> "---"
    const expectedCount = getNoteCount()
    openNoteModal()
    expect(screen.queryByTestId('create-note-submit')).toBeInTheDocument()
    setNoteTitle('MDTitle')
    setNoteDesc('---')
    submitNote()
    expect(getNoteCount()).toBe(expectedCount + 1)

    // Check the note modal has closed
    expect(screen.queryByTestId('create-note-submit')).toBeNull()

    // Enable MD
    toggleMD()

    // Test if a note has been created with a <hr>
    const newNote = document.querySelectorAll('.MuiListItem-container hr')
    expect(newNote.length).toEqual(1)
  })
})
