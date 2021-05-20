import { useState } from 'react';
import { isMobile } from 'react-device-detect';

import { makeStyles } from '@material-ui/core/styles';
import { Modal, IconButton, } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { TitleInput, DescInput, SubmitButton, CloseButton } from './CustomInputs';
import { getUniqueId } from '../../../Services/UUID';

import MDPreview from '../MDPreview';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = wideView => makeStyles((theme) => ({
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
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 1),
    },
    formGroup: {
        flexDirection: 'row-reverse'
    },
}));

const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const CreateNoteModal = props => {

    const {
        noteState,
        setNoteState,
        modalOpen,
        setModalOpen,
        editNoteId,
        setEditNoteId,
        darkMode,
        mdMode,
        previewMode,
    } = props;

    const [wideView, toggleWideView] = useState(false);

    const classes = useStyles(wideView)();

    const getNoteDetail = detail => {
        let editingNote, editingNoteIndex;

        if (editNoteId) {
            editingNoteIndex = noteState.findIndex(note => note.id === editNoteId);
            editingNote = noteState[editingNoteIndex];
        }
        return editingNote?.[detail] || ''
    };

    const [noteDesc, setNoteDesc] = useState(getNoteDetail('secondary'));
    const descProps = { noteDesc, setNoteDesc };

    const [noteTitle, setNoteTitle] = useState(getNoteDetail('primary'));
    const titleProps = { noteTitle, setNoteTitle };

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => {
        setModalOpen(false);
        setEditNoteId(false);
    };

    const noteButtonProps = { handleClose, editNoteId, darkMode };

    const editExistingNote = editNoteId => {
        let indOfNote = noteState.findIndex(note => note.id === editNoteId);
        let newNotes = [...noteState];
        newNotes[indOfNote] = { ...newNotes[indOfNote], primary: noteTitle, secondary: `${noteDesc}` };
        setNoteState([...newNotes]);
    };

    const createNote = (evt) => {
        handleClose();
        evt.preventDefault();
        switch (true) {
            case !noteTitle && !noteDesc:
                // NO NOTE: Just close modal
                return handleClose();
            case !!editNoteId:
                // HAS NOTE: Edit existing
                return editExistingNote(editNoteId);
            case !!noteState?.length:
                // HAS NOTES: Prepend new note
                return setNoteState([{ id: getUniqueId(noteState), primary: noteTitle, secondary: `${noteDesc}` }, ...noteState]);
            default:
                // FIRST NOTE: Set initial state
                return setNoteState([{ id: getUniqueId(), primary: noteTitle, secondary: `${noteDesc}` }]);
        }
    };

    const submitButtonProps = { noteTitle, createNote, editNoteId, noteDesc };

    const CreateNoteButton = () => (
        <IconButton
            data-testid="create-note-button"
            aria-label="Create New Note"
            edge="end"
            onClick={handleOpen}
        >
            <AddCircleOutlineIcon
                color="primary"
                fontSize="large"
            />
        </IconButton>
    );

    const MDContainer = () => {
        const [showPreview, togglePreview] = useState(previewMode);

        const handlePreview = (event) => togglePreview(event.target.checked);
        const handleWideView = (event) => toggleWideView(event.target.checked);

        return (
            <div style={{
                border: `solid 1px rgba(${darkMode ? '255, 255, 255, 25%' : '0, 0, 0, 25%'})`,
                padding: '1em 1em',
                borderRadius: '4px',
                maxHeight: 'calc(40vh)',
                overflowY: 'auto',
            }}>
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
                            />
                        }
                        label="Live Preview"
                    />
                    { !isMobile && (
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
                {showPreview && <MDPreview children={noteDesc} darkMode={darkMode} />}
            </div>
        );
    };

    const ModalBody = () => (
        <div style={modalStyle} className={classes.paper}>
            <form style={{marginTop: '1em'}} className={classes.root} onSubmit={createNote} noValidate autoComplete="off" >
                <TitleInput {...titleProps} />
                <DescInput {...descProps} />
                <CloseButton {...noteButtonProps}/>
                <SubmitButton {...submitButtonProps} />
                {
                    (mdMode && !isMobile) && <MDContainer />
                }
            </form>
            <span id="new-note-modal" style={{display: 'none'}} aria-hidden="true">
                New Note modal
             </span>
            <span id="new-note-modal-description" style={{display: 'none'}} aria-hidden="true">
                Here you can set the Title and Description of your new note
             </span>
        </div>
    );

    return (
        <div>
            <CreateNoteButton />
            <Modal
                open={!!editNoteId || modalOpen}
                onClose={handleClose}
                aria-labelledby="new-note-modal"
                aria-describedby="new-note-modal-desc-description"
            >
                {ModalBody()}
            </Modal>
        </div>
    );
}

export default CreateNoteModal;