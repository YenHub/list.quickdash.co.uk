import './style.css'

import { Button, IconButton, Link, useTheme } from '@mui/material'
import { type FC, useEffect, useState } from 'react'
import { Checkmark } from 'react-checkmark'

import { deleteList } from '../../../Services/Clients/Api'
import { type NoteItem } from '../../../Services/Database/NoteClient'
import { useAppStore } from '../../../Services/Store'
import { downloadFile } from '../../../Services/Utils/BrowserUtils'
import { deleteSyncSettings } from '../../../Services/Utils/ReactUtils'
import { getUniqueId } from '../../../Services/Utils/UUID'
import ActionDialog from '../ActionDialog'
import { currentAnimation } from './constants'
import generateNote, { random } from './generateNote'

const DeletionWarning: FC = () => {
  const { webId } = useAppStore(state => ({ webId: state.settings.webId }))

  if (webId) {
    const listUrl = `${document.location.origin}/${webId}`

    return (
      <>
        <p>Anyone with the link below can restore this list within 90 days:</p>
        <Link href={listUrl}>{listUrl}</Link>
      </>
    )
  }

  return <p>You cannot undo this 👀</p>
}

const DeleteAlert: FC<{
  handleAccept(): Promise<void>
  handleClose: () => void
}> = ({ handleAccept, handleClose }) => (
  <ActionDialog
    open={true}
    title="Delete this list?"
    onAccept={handleAccept}
    onCancel={handleClose}
  >
    <DeletionWarning />
  </ActionDialog>
)

export const CustomButton: FC<{
  'aria-label': string
  disabled?: boolean
  'data-testid'?: string
  color?: string
  onClick(): void | Promise<void>
}> = props => (
  <Button {...props} edge="end" variant="outlined" fullWidth>
    {props['aria-label']}
  </Button>
)

const AnimatedButton: FC<{
  type: 'default'
  'aria-label': string
  onClick(): void | Promise<void>
  animatesuccess: 'reset-colours' | 'save-colours'
}> = props => {
  const theme = useTheme()

  const { animatesuccess, onClick } = props

  const [animating, setAnimating] = useState(
    localStorage.getItem('animateButton') === animatesuccess,
  )

  useEffect(() => {
    if (animating) {
      localStorage.removeItem('animateButton')
      const x = setTimeout(() => setAnimating(false), 1700)

      return () => clearTimeout(x)
    }
  })

  const handleOnClick = () => {
    if (currentAnimation()) return
    localStorage.setItem('animateButton', animatesuccess)
    void onClick()
  }

  const buttonProps = {
    ...props,
    onClick: handleOnClick,
  }

  if (animating)
    return <Checkmark size="35px" color={theme.palette.primary.main} />

  return <CustomButton {...buttonProps} />
}

export const DeleteNotes: FC = () => {
  const { clearSyncSettings, noteState, setNotes } = useAppStore(state => ({
    clearSyncSettings: state.clearSyncSettings,
    noteState: state.notes.noteState,
    setNotes: state.setNotes,
  }))

  const [showDeleteAlert, toggleDeleteAlert] = useState<boolean>(false)

  const clearNotes = async (): Promise<void> => {
    deleteSyncSettings()
    await deleteList()
    clearSyncSettings()
    await setNotes([])
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
        <DeleteAlert
          handleAccept={clearNotes}
          handleClose={handleDeleteCancel}
        />
      )}
      <CustomButton {...buttonProps} />
    </div>
  )
}

export const ImportButton: FC = () => {
  const { noteState, setNotes } = useAppStore(state => ({
    noteState: state.notes.noteState,
    setNotes: state.setNotes,
  }))

  const importNotes = async (noteState: NoteItem[]): Promise<void> => {
    const currentNotes = [...noteState]
    const newNotes = []

    for (let i = 0; i < random(15); i++) {
      const newNote = generateNote()
      newNotes.push({
        primary: newNote.primary,
        secondary: newNote.secondary,
      })
    }
    newNotes.forEach(item =>
      currentNotes.push({ ...item, id: getUniqueId(currentNotes) }),
    )
    await setNotes(currentNotes)
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
  const { noteState } = useAppStore(state => ({
    noteState: state.notes.noteState,
  }))

  const exportNotes = (noteState: NoteItem[]): void => {
    const exportContent = JSON.stringify(
      noteState.map(note => ({
        primary: note.primary,
        secondary: note.secondary,
      })),
    )
    downloadFile(exportContent)
  }

  const buttonProps = {
    type: 'default',
    'aria-label': 'EXPORT NOTES',
    onClick: () => exportNotes(noteState),
    disabled: noteState?.length === 0,
  }

  return <CustomButton {...buttonProps} />
}

export const SaveColours: FC<{ primary: string; secondary: string }> = ({
  primary,
  secondary,
}) => {
  const { setColours } = useAppStore(state => ({
    setColours: state.setColours,
  }))

  const buttonProps = {
    'aria-label': 'SAVE',
    onClick: () => setColours({ primary, secondary }),
    type: 'default' as const,
    animatesuccess: 'save-colours' as const,
  }

  return <AnimatedButton {...buttonProps} />
}

export const ResetColours: FC = () => {
  const { resetColours } = useAppStore(state => ({
    resetColours: state.resetColours,
  }))

  const buttonProps = {
    'aria-label': 'RESET',
    type: 'default' as const,
    onClick: () => resetColours(),
    animatesuccess: 'reset-colours' as const,
  }

  return <AnimatedButton {...buttonProps} />
}

export const CreateNoteButton: FC<{
  ActionButton: React.ReactNode
  testId: string
  label: string
  onClick(): void
}> = ({ ActionButton, testId, onClick, label }) => (
  <IconButton
    edge="end"
    onClick={onClick}
    aria-label={label}
    data-testid={`${testId}-note-button`}
  >
    {ActionButton}
  </IconButton>
)
