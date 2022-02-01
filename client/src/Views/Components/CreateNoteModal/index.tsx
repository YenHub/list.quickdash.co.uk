import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react'

import { Scrollbars } from 'react-custom-scrollbars'
import { isMobile } from 'react-device-detect'

import { FormControlLabel, FormGroup, Modal, Switch } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { Theme } from '@mui/system'

import { NoteItem } from '../../../Services/Database/NoteClient'
import { bigLog, shallowCompareIdentical } from '../../../Services/ReactUtils'
import { getUniqueId } from '../../../Services/UUID'
import MDPreview from '../MDPreview'
import { useAppDispatch, useAppSelector } from '../../../Services/Store'
import { setNotes } from '../../../Services/Reducers/noteSlice'
import { setModalState } from '../../../Services/Reducers/modalSlice'
import {
  CloseButton,
  DescInput,
  SubmitButton,
  TitleInput,
} from './CustomInputs'

const useStyles = (wideView: boolean) =>
  makeStyles<Theme>(
    theme => ({
      modalRoot: {
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
    }),
    { index: 1 },
  )

const modalStyle = (darkMode: boolean) => ({
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: darkMode ? '#424242' : '#f2f2f2',
})

const CreateNoteModal: React.FC = () => {
  const { darkMode, mdMode, previewMode } = useAppSelector(
    ({ settings }) => settings,
  )
  const { noteState } = useAppSelector(({ notes }) => notes)
  const {
    modalState: { editingNoteId, open },
  } = useAppSelector(({ modal }) => modal)
  const dispatch = useAppDispatch()

  const [wideView, toggleWideView] = useState<boolean>(false)
  const [showPreview, togglePreview] = useState<boolean>(previewMode)

  useEffect(() => {
    togglePreview(previewMode)
  }, [previewMode])

  const classes = useStyles(wideView)()

  const editingNote = noteState.find(
    (note: NoteItem) => note.id === editingNoteId,
  )

  const [primary, setPrimary] = useState<string>('')
  const [secondary, setSecondary] = useState<string>('')

  useEffect(() => {
    setPrimary(editingNote?.primary ?? '')
    setSecondary(editingNote?.secondary ?? '')
  }, [editingNote, open])

  const handleClose = (): void => {
    dispatch(
      setModalState({ modalState: { open: false, editingNoteId: null } }),
    )
  }

  const titleProps = { setPrimary, primary }
  const descProps = { setSecondary, secondary }
  const noteButtonProps = { handleClose, editingNoteId, darkMode }

  const editExistingNote = (editingNoteId: string): void => {
    const newNote = {
      id: editingNoteId,
      primary,
      secondary,
    }
    if (shallowCompareIdentical(editingNote, newNote)) {
      bigLog(`No changes made to note: ${editingNoteId}`)

      return
    }

    bigLog(`Updated note: ${editingNoteId}`)
    const indOfNote = noteState.findIndex(
      (note: NoteItem) => note.id === editingNoteId,
    )
    const newNotes = [...noteState]
    newNotes[indOfNote] = {
      ...newNotes[indOfNote],
      primary,
      secondary,
    }
    dispatch(setNotes(newNotes))
  }

  const createNote = (evt: FormEvent | MouseEvent): void => {
    handleClose()
    evt.preventDefault()
    switch (true) {
      case !primary && !secondary:
        /* NO NOTE: Just close modal */
        return
      case editingNoteId && editingNoteId !== '':
        bigLog(`Editing Existing ${editingNoteId}`)

        /* HAS NOTE: Edit existing */
        return editExistingNote(editingNoteId as string)
      case !!noteState?.length:
        bigLog('Adding new note')

        /* HAS NOTES: Prepend new note */
        dispatch(
          setNotes([
            {
              id: getUniqueId(noteState),
              primary,
              secondary,
            },
            ...noteState,
          ]),
        )

        return
      default:
        bigLog('First Ever Note')

        /* FIRST NOTE: Set initial state */
        dispatch(setNotes([{ id: getUniqueId(), primary, secondary }]))

        return
    }
  }

  const submitButtonProps = { primary, createNote, secondary }

  const MDContainer = (): JSX.Element => {
    const handlePreview: ChangeEventHandler<HTMLInputElement> = event =>
      togglePreview(event.target.checked)
    const handleWideView: ChangeEventHandler<HTMLInputElement> = event =>
      toggleWideView(event.target.checked)

    return (
      <div
        style={{
          border: `solid 1px rgba(${
            darkMode ? '255, 255, 255, 25%' : '0, 0, 0, 25%'
          })`,
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
            {showPreview && (
              <MDPreview darkMode={darkMode}>{secondary}</MDPreview>
            )}
          </div>
        </Scrollbars>
      </div>
    )
  }

  const ModalBody = (): JSX.Element => (
    <div style={modalStyle(darkMode)} className={classes.paper}>
      <form
        style={{ marginTop: '1em' }}
        className={classes.modalRoot}
        onSubmit={createNote}
        noValidate
        autoComplete="off"
      >
        <TitleInput {...titleProps} />
        <DescInput {...descProps} />
        <CloseButton {...noteButtonProps} />
        <SubmitButton
          {...submitButtonProps}
          editingNoteID={editingNoteId ?? undefined}
        />
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
      <Modal
        open={open}
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
