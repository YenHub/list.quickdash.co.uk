import { FC, useEffect, useState } from 'react'
import { Checkmark } from 'react-checkmark'
import { IconButton, Button, useTheme, Link } from '@mui/material'

import './style.css'

import { downloadFile } from '../../../Services/Utils/BrowserUtils'
import { NoteItem } from '../../../Services/Database/NoteClient'
import { getUniqueId } from '../../../Services/Utils/UUID'
import ActionDialog from '../ActionDialog'
import { useAppDispatch, useAppSelector } from '../../../Services/Store'
import { setNotes } from '../../../Services/Reducers/noteSlice'
import {
  clearSyncSettings,
  resetColours,
  setColours,
} from '../../../Services/Reducers/settingSlice'
import { deleteList } from '../../../Services/Clients/Api'
import { Socket } from '../../../Services/Clients/WebSockets'
import generateNote, { random } from './generateNote'

export const currentAnimation = () => localStorage.getItem('animateButton') !== null

const DeletionWarning: FC = () => {
  const { webId } = useAppSelector(({ settings }) => settings)

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
  handleAccept: () => void
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

export const CustomButton = (props: any) => (
  <Button {...props} edge="end" variant="outlined" fullWidth>
    {props['aria-label']}
  </Button>
)

const AnimatedButton: FC<any> = (props: any) => {
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
    onClick()
  }

  const buttonProps = {
    ...props,
    onClick: handleOnClick,
  }

  if (animating) {
    return <Checkmark size="35px" color={theme.palette.primary.main} />
  }

  return <CustomButton {...buttonProps} />
}

export const DeleteNotes: FC = () => {
  const { noteState } = useAppSelector(({ notes }) => notes)
  const { version } = useAppSelector(({ settings }) => settings)
  const dispatch = useAppDispatch()

  const [showDeleteAlert, toggleDeleteAlert] = useState<boolean>(false)

  const clearNotes = (): void => {
    if (version) {
      const socket = Socket.getInstance()
      socket.disconnect()
      deleteList()
      dispatch(clearSyncSettings())
      dispatch(setNotes([]))
      toggleDeleteAlert(false)

      return
    }
    dispatch(setNotes([]))
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
        <DeleteAlert handleAccept={clearNotes} handleClose={handleDeleteCancel} />
      )}
      <CustomButton {...buttonProps} />
    </div>
  )
}

export const ImportButton: FC = () => {
  const { noteState } = useAppSelector(({ notes }) => notes)
  const dispatch = useAppDispatch()

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
    newNotes.forEach(item =>
      currentNotes.push({ ...item, id: getUniqueId(currentNotes) }),
    )
    dispatch(setNotes(currentNotes))
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
  const { noteState } = useAppSelector(({ notes }) => notes)

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
    'aria-label': 'EXPORT NOTES',
    onClick: () => exportNotes(noteState),
    disabled: noteState?.length === 0,
    type: 'default',
  }

  return <CustomButton {...buttonProps} />
}

export const SaveColours: FC<{ primary: string; secondary: string }> = ({
  primary,
  secondary,
}) => {
  const dispatch = useAppDispatch()

  const buttonProps = {
    'aria-label': 'SAVE',
    onClick: () => {
      dispatch(setColours({ colours: { primary, secondary } }))
    },
    type: 'default',
    animatesuccess: 'save-colours',
  }

  return <AnimatedButton {...buttonProps} />
}

export const ResetColours: FC = () => {
  const dispatch = useAppDispatch()

  const buttonProps = {
    'aria-label': 'RESET',
    onClick: () => {
      dispatch(resetColours())
    },
    type: 'default',
    animatesuccess: 'reset-colours',
  }

  return <AnimatedButton {...buttonProps} />
}

export const CreateNoteButton: FC<{
  ActionButton: JSX.Element
  testId: string
  label: string
  onClick(): void
}> = ({ ActionButton, testId, onClick, label }) => (
  <IconButton
    data-testid={`${testId}-note-button`}
    aria-label={label}
    edge="end"
    onClick={onClick}
  >
    {ActionButton}
  </IconButton>
)
