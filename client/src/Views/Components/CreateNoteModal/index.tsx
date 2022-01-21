import { ChangeEventHandler, FormEvent, useContext, useState } from 'react'

import { Scrollbars } from 'react-custom-scrollbars'
import { isMobile } from 'react-device-detect'

import { IconButton, Modal } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import makeStyles from '@mui/styles/makeStyles'
import Switch from '@mui/material/Switch'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

import { Theme } from '@mui/system'
import { NoteItem } from '../../../Services/Database/NoteClient'
import { bigLog, shallowCompareIdentical } from '../../../Services/ReactUtils'
import { store } from '../../../Services/State/Store'
import { getUniqueId } from '../../../Services/UUID'
import MDPreview from '../MDPreview'
import { CloseButton, DescInput, SubmitButton, TitleInput } from './CustomInputs'

const useStyles = (wideView: boolean) =>
  makeStyles<Theme>(theme => ({
    root: {
      '& > *': {
        marginBottom: theme.spacing(2),
      },
    },
    paper: {
      position: 'absolute',
      width: isMobile ? '90%' : wideView ? '75%' : 675,
      minWidth: isMobile ? '90%' : 675,
      backgroundColor: theme.palette.background.paper,
      boxShadow: (theme as any).shadows[1],
      padding: theme.spacing(2, 4, 1),
      borderRadius: '0.4rem',
    },
    formGroup: {
      flexDirection: 'row-reverse',
    },
  }))

const modalStyle = (darkMode: boolean) => ({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: darkMode ? '#424242' : '#f2f2f2',
})

interface INoteModal {
  editingNoteID?: string
  ActionButton?: JSX.Element
}

const CreateNoteModal: React.FC<INoteModal> = ({
  editingNoteID,
  ActionButton,
}: INoteModal) => {
  const globalState = useContext(store)
  const {
    state: { darkMode, mdMode, previewMode, noteState },
    dispatch,
  } = globalState

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const [wideView, toggleWideView] = useState<boolean>(false)
  const [showPreview, togglePreview] = useState<boolean>(previewMode)

  const classes = useStyles(wideView)()

  const editingNote = noteState.find((note: NoteItem) => note.id === editingNoteID)

  const getNoteDetail = (detail: 'primary' | 'secondary'): string =>
    editingNote?.[detail] || ''

  const [noteDesc, setNoteDesc] = useState<string>(getNoteDetail('secondary'))
  const descProps = { noteDesc, setNoteDesc }

  const [noteTitle, setNoteTitle] = useState<string>(getNoteDetail('primary'))
  const titleProps = { noteTitle, setNoteTitle }

  const handleOpen = (): void => setModalOpen(true)
  const handleClose = (): void => {
    setModalOpen(false)
    // HACK: This should not really be many instances of a modal
    // This hould be hung from the parent container just once
    if (!editingNoteID) {
      setNoteDesc('')
      setNoteTitle('')
    }
  }

  const noteButtonProps = { handleClose, editingNoteID, darkMode }

  const editExistingNote = (editingNoteID: string): void => {
    const newNote = {
      id: editingNoteID,
      primary: noteTitle,
      secondary: noteDesc,
    }
    if (shallowCompareIdentical(editingNote, newNote)) {
      bigLog(`No changes made to note: ${editingNoteID}`)

      return
    }

    bigLog(`Updated note: ${editingNoteID}`)
    const indOfNote = noteState.findIndex((note: NoteItem) => note.id === editingNoteID)
    const newNotes = [...noteState]
    newNotes[indOfNote] = {
      ...newNotes[indOfNote],
      primary: noteTitle,
      secondary: noteDesc,
    }
    dispatch({ type: 'SetNotes', payload: newNotes })
  }

  const createNote = (evt: FormEvent | MouseEvent): void => {
    handleClose()
    evt.preventDefault()
    switch (true) {
      case !noteTitle && !noteDesc:
        // NO NOTE: Just close modal
        return
      case editingNoteID !== undefined && editingNoteID !== '':
        bigLog(`Editing Existing ${editingNoteID}`)

        // HAS NOTE: Edit existing
        return editExistingNote(editingNoteID as string)
      case !!noteState?.length:
        bigLog('Adding new note')

        // HAS NOTES: Prepend new note
        return dispatch({
          type: 'SetNotes',
          payload: [
            {
              id: getUniqueId(noteState),
              primary: noteTitle,
              secondary: `${noteDesc}`,
            },
            ...noteState,
          ],
        })
      default:
        bigLog('First Ever Note')

        // FIRST NOTE: Set initial state
        return dispatch({
          type: 'SetNotes',
          payload: [{ id: getUniqueId(), primary: noteTitle, secondary: `${noteDesc}` }],
        })
    }
  }

  const submitButtonProps = { noteTitle, createNote, editingNoteID, noteDesc }

  const CreateNoteButton = (): JSX.Element => (
    <IconButton
      data-testid={`${ActionButton ? 'edit' : 'create'}-note-button`}
      aria-label="Create New Note"
      edge="end"
      onClick={handleOpen}
    >
      {ActionButton ? (
        ActionButton
      ) : (
        <AddCircleOutlineIcon color="primary" fontSize="large" />
      )}
    </IconButton>
  )

  const MDContainer = (): JSX.Element => {
    const handlePreview: ChangeEventHandler<HTMLInputElement> = event =>
      togglePreview(event.target.checked)
    const handleWideView: ChangeEventHandler<HTMLInputElement> = event =>
      toggleWideView(event.target.checked)

    return (
      <div
        style={{
          border: `solid 1px rgba(${darkMode ? '255, 255, 255, 25%' : '0, 0, 0, 25%'})`,
          borderRadius: '4px',
          paddingRight: '0.3rem',
        }}
      >
        <Scrollbars
          hideTracksWhenNotNeeded
          autoHeight
          autoHeightMax={'calc(40vh)'}
          style={{ margin: '0.8rem 0' }}
        >
          <div style={{ padding: '1em 1em', marginRight: '1rem' }}>
            <FormGroup row className={classes.formGroup}>
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    inputProps={{ 'aria-label': 'Show MarkDown Preview' }}
                    checked={showPreview}
                    onChange={handlePreview}
                    name="showPreview"
                    color="primary"
                    data-testid="create-note-md-toggle"
                  />
                }
                label="Live Preview"
              />
              {!isMobile && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      inputProps={{ 'aria-label': 'Show Wide View' }}
                      checked={wideView}
                      onChange={handleWideView}
                      name="wideView"
                      color="primary"
                    />
                  }
                  label="Wide View"
                />
              )}
            </FormGroup>
            {showPreview && <MDPreview darkMode={darkMode}>{noteDesc}</MDPreview>}
          </div>
        </Scrollbars>
      </div>
    )
  }

  const ModalBody = (): JSX.Element => (
    <div style={modalStyle(darkMode)} className={classes.paper}>
      <form
        style={{ marginTop: '1em' }}
        className={classes.root}
        onSubmit={createNote}
        noValidate
        autoComplete="off"
      >
        <TitleInput {...titleProps} />
        <DescInput {...descProps} />
        <CloseButton {...noteButtonProps} />
        <SubmitButton {...submitButtonProps} />
        {mdMode && !isMobile && <MDContainer />}
      </form>
      <span id="new-note-modal" style={{ display: 'none' }} aria-hidden="true">
        New Note modal
      </span>
      <span
        id="new-note-modal-description"
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        Here you can set the Title and Description of your new note
      </span>
    </div>
  )

  return (
    <div>
      <CreateNoteButton />
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="new-note-modal"
        aria-describedby="new-note-modal-desc-description"
      >
        {ModalBody()}
      </Modal>
    </div>
  )
}

export default CreateNoteModal
