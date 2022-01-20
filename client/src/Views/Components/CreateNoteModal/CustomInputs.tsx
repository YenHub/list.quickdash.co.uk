import { ChangeEventHandler, Dispatch, FC, SetStateAction } from 'react'

import { isMobile } from 'react-device-detect'

import { Button, TextField } from '@material-ui/core'

interface ICustomInputs {
  noteTitle: string
  setNoteTitle: Dispatch<SetStateAction<string>>
  noteDesc: string
  darkMode: boolean
  setNoteDesc: Dispatch<SetStateAction<string>>
  createNote(evt: any): void
  editingNoteID?: string
  handleClose(): void
}

export const TitleInput: FC<
  Pick<ICustomInputs, 'noteTitle' | 'setNoteTitle'>
> = ({ noteTitle, setNoteTitle }) => {
  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = evt =>
    setNoteTitle(evt.target.value)

  return (
    <TextField
      autoFocus
      fullWidth
      label="Note Title"
      variant="outlined"
      defaultValue={noteTitle}
      onChange={handleTitleChange}
      inputProps={{ 'aria-label': 'Note Title' }}
    />
  )
}

export const DescInput: FC<Pick<ICustomInputs, 'noteDesc' | 'setNoteDesc'>> = ({
  noteDesc,
  setNoteDesc,
}) => {
  const handleDescChange: ChangeEventHandler<HTMLInputElement> = evt =>
    setNoteDesc(evt.target.value)

  return (
    <TextField
      fullWidth
      data-testid="description-input"
      label="Note Description (optional)"
      variant="outlined"
      onChange={handleDescChange}
      multiline
      rows={isMobile ? 6 : 12}
      defaultValue={noteDesc}
      inputProps={{ 'aria-label': 'Note Description' }}
    />
  )
}

export const SubmitButton: FC<
  Pick<ICustomInputs, 'createNote' | 'noteTitle' | 'editingNoteID' | 'noteDesc'>
> = ({ createNote, noteTitle, editingNoteID, noteDesc }) => {
  const noteLabel = `${editingNoteID ? 'Update' : 'Create'}`

  return (
    <Button
      aria-label={noteLabel}
      onClick={createNote}
      variant="outlined"
      color="primary"
      disabled={!noteTitle.length && !noteDesc.length}
      data-testid="create-note-submit"
      style={{ width: '48%', marginLeft: '2%' }}
    >
      {noteLabel}
    </Button>
  )
}

export const CloseButton: FC<
  Pick<ICustomInputs, 'handleClose' | 'editingNoteID' | 'darkMode'>
> = ({ handleClose, editingNoteID, darkMode }) => (
  <Button
    aria-label={'Close Note'}
    onClick={handleClose}
    variant="outlined"
    data-testid="create-note-close"
    // color="primary"
    color={darkMode ? 'default' : 'primary'}
    style={{
      color: `${darkMode ? 'lightGrey' : 'black'}`,
      width: '48%',
      marginRight: '2%',
    }}
  >
    {editingNoteID ? 'Cancel' : 'Close'}
  </Button>
)
