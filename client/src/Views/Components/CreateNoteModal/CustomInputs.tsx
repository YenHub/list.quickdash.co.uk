import { ChangeEventHandler, Dispatch, FC, SetStateAction } from 'react'

import { isMobile } from 'react-device-detect'

import { Button, TextField } from '@mui/material'

interface ICustomInputs {
  darkMode: boolean
  primary: string
  setPrimary: Dispatch<SetStateAction<string>>
  secondary: string
  setSecondary: Dispatch<SetStateAction<string>>
  createNote(evt: any): void
  editingNoteID?: string
  handleClose(): void
}

export const TitleInput: FC<Pick<ICustomInputs, 'primary' | 'setPrimary'>> = ({
  primary,
  setPrimary,
}) => {
  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = evt =>
    setPrimary(evt.target.value)

  return (
    <TextField
      autoFocus
      fullWidth
      label="Note Title"
      variant="outlined"
      defaultValue={primary}
      onChange={handleTitleChange}
      inputProps={{ 'aria-label': 'Note Title' }}
    />
  )
}

export const DescInput: FC<Pick<ICustomInputs, 'secondary' | 'setSecondary'>> = ({
  secondary,
  setSecondary,
}) => {
  const handleDescChange: ChangeEventHandler<HTMLInputElement> = evt =>
    setSecondary(evt.target.value)

  return (
    <TextField
      fullWidth
      data-testid="description-input"
      label="Note Description (optional)"
      variant="outlined"
      onChange={handleDescChange}
      multiline
      rows={isMobile ? 8 : 12}
      defaultValue={secondary}
      inputProps={{ 'aria-label': 'Note Description' }}
    />
  )
}

export const SubmitButton: FC<
  Pick<ICustomInputs, 'createNote' | 'primary' | 'editingNoteID' | 'secondary'>
> = ({ createNote, primary, editingNoteID, secondary }) => {
  const noteLabel = `${editingNoteID ? 'Update' : 'Create'}`

  return (
    <Button
      aria-label={noteLabel}
      onClick={createNote}
      variant="outlined"
      color="primary"
      disabled={!primary && !secondary}
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
    color={darkMode ? 'neutral' : 'primary'}
    style={{
      color: `${darkMode ? 'lightGrey' : 'black'}`,
      width: '48%',
      marginRight: '2%',
    }}
  >
    {editingNoteID ? 'Cancel' : 'Close'}
  </Button>
)
