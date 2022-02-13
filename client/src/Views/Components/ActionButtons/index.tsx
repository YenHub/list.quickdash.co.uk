import { FC, useEffect, useState } from 'react'
import { Checkmark } from 'react-checkmark'
import { IconButton, Button, useTheme, CircularProgress, Link } from '@mui/material'

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
  setSyncSettings,
} from '../../../Services/Reducers/settingSlice'
import { deleteList, syncNewList } from '../../../Services/Clients/Api'
import {
  deleteSyncSettings,
  errorLog,
  persistAppSettings,
} from '../../../Services/Utils/ReactUtils'
import { socketInit } from '../../../Services/Clients/WebSockets'
import generateNote, { random } from './generateNote'

const currentAnimation = () => localStorage.getItem('animateButton') !== null

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

const CustomButton = (props: any) => (
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
  const dispatch = useAppDispatch()

  const [showDeleteAlert, toggleDeleteAlert] = useState<boolean>(false)

  const clearNotes = (): void => {
    deleteSyncSettings()
    deleteList()
    dispatch(clearSyncSettings())
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

export const ShareButton: FC = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { syncSequence } = useAppSelector(({ settings }) => settings)
  const [animating, setAnimating] = useState(
    localStorage.getItem('animateButton') === 'saving-list',
  )
  const [saved, setSaved] = useState(
    localStorage.getItem('animateButton') === 'saved-list',
  )

  useEffect(() => {
    if (animating) {
      localStorage.removeItem('animateButton')
    }
  })

  useEffect(() => {
    if (saved) {
      localStorage.removeItem('animateButton')
      const x = setTimeout(() => setSaved(false), 1500)

      return () => clearTimeout(x)
    }
  })

  const setSuccess = () => {
    localStorage.setItem('animateButton', 'saved-list')
    setSaved(true)
  }

  const syncList = async () => {
    setAnimating(true)
    // If we don't have a syncSequence, it means this is our first time syncing our list
    if (syncSequence) {
      // IGDev: Check whether syncsequence is up to date

      // IGDev:
      setSuccess()
      console.log('Already Synced')
      await new Promise(res => setTimeout(res, 1000))
      // IGDev: Show Link Modal
    } else {
      // IGDev: Sync List
      // IGDev: Sync List Items
      await syncNewList()
        .then(res => {
          const { version, syncSequence, webId, listItems } = res
          if (!version || !webId || !syncSequence) return
          persistAppSettings({ version, webId, syncSequence })
          dispatch(setNotes(listItems))
          dispatch(setSyncSettings({ version, syncSequence, webId }))
          setSuccess()
          socketInit()
        })
        .catch(e => {
          // IGDev: Handle the possible failure here
          errorLog(e)
        })
      // IGDev: Show Link Modal
    }
  }

  const handleOnClick = async () => {
    if (currentAnimation()) return
    setAnimating(true)
    localStorage.setItem('animateButton', 'saving-list')
    await syncList()
  }

  const buttonProps = {
    'aria-label': 'SHARE LIST',
    onClick: handleOnClick,
    type: 'default',
  }

  if (saved) {
    return <Checkmark size="35px" color={theme.palette.primary.main} />
  }

  if (animating) {
    return (
      <div style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
        <CircularProgress size={35} />
      </div>
    )
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
