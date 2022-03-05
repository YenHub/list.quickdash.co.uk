import { FC, useEffect, useState } from 'react'
import { CircularProgress, Link, useTheme } from '@mui/material'
import { Checkmark } from 'react-checkmark'

import { syncNewList } from '../../../Services/Clients/Api'
import { setNotes } from '../../../Services/Reducers/noteSlice'
import { setSyncSettings } from '../../../Services/Reducers/settingSlice'
import { useAppDispatch, useAppSelector } from '../../../Services/Store'
import { errorLog } from '../../../Services/Utils/ReactUtils'
import ActionDialog from '../ActionDialog'
import { NoteItem } from '../../../Services/Database/NoteClient'
import { replaceUrlPath, unstoppableCopy } from '../../../Services/Utils/BrowserUtils'
import { currentAnimation, CustomButton } from '.'

const Dialog: FC<{
  onAccept(): void
  open: boolean
  success: boolean
  webId: string | null
}> = ({ onAccept, open, success, webId }) => {
  const listUrl = `${document.location.host}/${webId}`
  const copyUrl = () => unstoppableCopy(listUrl)
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
      customHandler={{
        action: copyUrl,
        message: 'Copy Link',
        animateSuccess: true,
      }}
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
  const [synced, setSynced] = useState(
    localStorage.getItem('animateButton') === 'saved-list',
  )

  useEffect(() => {
    if (synced) {
      localStorage.removeItem('animateButton')
      setDialogOpen(true)
      setSuccess(true)
      const x = setTimeout(() => setSynced(false), 1500)

      return () => clearTimeout(x)
    }
  }, [synced])

  const handleSyncSuccess = ({
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
    setSynced(true)
    replaceUrlPath(webId)
    // The payload we set here includes the newly added webIds for the items
    dispatch(setNotes(listItems))
    dispatch(setSyncSettings({ version, syncSequence, webId }))
    localStorage.setItem('animateButton', 'saved-list')
  }

  const handleSyncFail = () => {
    localStorage.removeItem('animateButton')
    setSynced(false)
    setSuccess(false)
    setAnimating(false)
    setDialogOpen(true)
  }

  const showShareLink = () => setSynced(true)

  const syncList = async () => {
    if (webId) {
      showShareLink()
    } else {
      localStorage.setItem('animateButton', 'saving-list')
      setAnimating(true)
      /* New list to sync */
      await syncNewList()
        .then(res => {
          const { version, syncSequence, webId, listItems } = res
          if (!version || !webId || !syncSequence) return handleSyncFail()
          handleSyncSuccess({ version, webId, syncSequence, listItems })
        })
        .catch(e => {
          errorLog(e)
          handleSyncFail()
        })
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

  if (synced) {
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
