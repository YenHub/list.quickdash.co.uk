import { CircularProgress, Link, useTheme } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { Checkmark } from 'react-checkmark'

import { syncNewList } from '../../../Services/Clients/Api'
import { socketInit } from '../../../Services/Clients/WebSockets'
import { NoteItem } from '../../../Services/Database/NoteClient'
import { setNotes } from '../../../Services/Reducers/noteSlice'
import { setSyncSettings } from '../../../Services/Reducers/settingSlice'
import { useAppDispatch, useAppSelector } from '../../../Services/Store'
import {
  errorLog,
  persistAppSettings,
} from '../../../Services/Utils/ReactUtils'
import ActionDialog from '../ActionDialog'
import { currentAnimation, CustomButton } from '.'

const Dialog: FC<{
  onAccept(): void
  open: boolean
  success: boolean
  webId: string | null
}> = ({ onAccept, open, success, webId }) => {
  const listUrl = `${document.location.origin}/${webId}`
  if (!success) {
    return (
      <ActionDialog
        open={open}
        title="Something went wrong 😔"
        message="Your list failed to save; please try again later"
        onAccept={onAccept}
      />
    )
  }

  return (
    <ActionDialog
      open={open}
      title="Successfully synced 🎉"
      onAccept={onAccept}
    >
      <p>Your personal list link:</p>
      <Link href={listUrl}>{listUrl}</Link>
    </ActionDialog>
  )
}

export const ShareButton: FC = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { webId } = useAppSelector(({ settings }) => settings)
  const { noteState } = useAppSelector(({ notes }) => notes)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [saved, setSaved] = useState(
    localStorage.getItem('animateButton') === 'saved-list',
  )

  useEffect(() => {
    if (saved) {
      localStorage.removeItem('animateButton')
      setDialogOpen(true)
      setSuccess(true)
      const x = setTimeout(() => setSaved(false), 1500)

      return () => clearTimeout(x)
    }
  }, [saved])

  const handleCreateSuccess = ({
    version,
    webId,
    syncSequence,
    listItems,
  }: {
    version: number
    webId: string
    syncSequence: number
    listItems: NoteItem[]
  }) => {
    setSaved(true)
    dispatch(setNotes(listItems))
    persistAppSettings({ version, webId, syncSequence })
    dispatch(setSyncSettings({ version, syncSequence, webId }))
    // Sockets require the syncSettings to be present
    socketInit()
    localStorage.setItem('animateButton', 'saved-list')
  }

  const handleCreateFail = () => {
    localStorage.removeItem('animateButton')
    setSaved(false)
    setSuccess(false)
    setAnimating(false)
    setDialogOpen(true)
  }

  const syncList = async () => {
    localStorage.setItem('animateButton', 'saving-list')
    setAnimating(true)

    if (webId) {
      /* List already exists */

      // IGDev: Check whether syncsequence is up to date
      // IGDev: Show Link Modal
      console.log('Already Synced')

      await new Promise(res => setTimeout(res, 1000))
      handleCreateFail()
    } else {
      /* New list to sync */
      await syncNewList()
        .then(res => {
          const { version, syncSequence, webId, listItems } = res
          if (!version || !webId || !syncSequence) return handleCreateFail()
          handleCreateSuccess({ version, webId, syncSequence, listItems })
        })
        .catch(e => {
          errorLog(e)
          handleCreateFail()
        })
      // IGDev: Show Link Modal
    }
  }

  const handleOnClick = () => {
    if (currentAnimation()) return
    syncList()
  }

  const buttonProps = {
    'aria-label': 'SHARE LIST',
    onClick: handleOnClick,
    type: 'default',
    disabled: noteState.length <= 0,
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

  return (
    <>
      <CustomButton {...buttonProps} />
      <Dialog
        open={dialogOpen}
        onAccept={() => setDialogOpen(false)}
        success={success}
        webId={webId}
      />
    </>
  )
}
