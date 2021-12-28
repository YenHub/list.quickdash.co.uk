import { FC, useContext, useState } from 'react'

import Button from '@material-ui/core/Button'

import { downloadFile } from '../../../Services/BrowserUtils'
import { NoteItem } from '../../../Services/Database/NoteClient'
import { store } from '../../../Services/State/Store'
import { getUniqueId } from '../../../Services/UUID'
import ActionDialog from '../ActionDialog'
import generateNote, { random } from './generateNote'
const DeleteAlert = (handleAccept: () => void, handleClose: () => void) => (
  <ActionDialog
    open={true}
    title="Delete List"
    message="Are you sure you want to delete all of your notes?"
    onAccept={handleAccept}
    onCancel={handleClose}
  />
)

const CustomButton = (props: any) => (
  <Button
    {...props}
    edge="end"
    variant="outlined"
    fullWidth
  >
    {props['aria-label']}
  </Button>
)

export const DeleteNotes: FC = () => {

  const globalState = useContext(store)
  const { state: { noteState }, dispatch } = globalState

  const [showDeleteAlert, toggleDeleteAlert] = useState<boolean>(false)

  const clearNotes = (): void => {
    dispatch({ type: 'SetNotes', payload: [] })
    toggleDeleteAlert(false)
  }

  const handleDeleteClick = () => toggleDeleteAlert(true)
  const handleDeleteCancel = () => toggleDeleteAlert(false)

  const buttonProps = {
    'aria-label': 'Delete List',
    onClick: handleDeleteClick,
    disabled: noteState?.length === 0,
    'data-testid': 'delete-all-notes',
    color: 'primary',
  }

  return (
    <div style={{ width: '100%' }}>
      {showDeleteAlert && (
        DeleteAlert(clearNotes, handleDeleteCancel)
      )}
      <CustomButton {...buttonProps} />
    </div>
  )
}

export const ImportButton: FC = () => {

  const globalState = useContext(store)
  const { state: { noteState }, dispatch } = globalState

  const importNotes = (noteState: NoteItem[]) => {
    const currentNotes = [...noteState]
    const newNotes = []

    for (let i = 0; i < random(15); i++) {
      const newNote = generateNote()
      newNotes.push({
        primary: newNote.primary,
        secondary: newNote.secondary,
      })
    }
    newNotes.map(item => {
      return currentNotes.push({ ...item, id: getUniqueId(currentNotes) })
    })
    dispatch({ type: 'SetNotes', payload: currentNotes })
  }

  const buttonProps = {
    'aria-label': 'CREATE RANDOM NOTES',
    onClick: () => importNotes(noteState),
    disabled: !noteState,
    type: 'secondary',
  }

  return <CustomButton {...buttonProps} />

}

export const ExportButton: FC = () => {

  const globalState = useContext(store)
  const { state: { noteState } } = globalState

  const exportNotes = (noteState: NoteItem[]): void => {
    const exportContent = JSON.stringify(noteState.map(note => ({ primary: note.primary, secondary: note.secondary })))
    downloadFile(exportContent)
  }

  const buttonProps = {
    'aria-label': 'EXPORT NOTES',
    onClick: () => exportNotes(noteState),
    disabled: noteState?.length === 0,
    type: 'default',
  }

  return <CustomButton {...buttonProps} />
}
