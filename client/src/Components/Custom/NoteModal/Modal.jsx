import { useState } from 'react';

import { isMobile } from 'react-device-detect';

import { makeStyles } from '@material-ui/core/styles';
import { Modal, IconButton, } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { TitleInput, DescInput, SubmitButton } from './Components/CustomInputs';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            marginBottom: theme.spacing(2),
        },
    },
    paper: {
        position: 'absolute',
        width: isMobile ? '90%' : 675,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const NoteModal = ({
    noteState,
    setNoteState,
    modalOpen,
    setModalOpen,
    editNoteId,
    setEditNoteId,
}) => {

    const classes = useStyles();

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
            case !noteTitle.length:
                return handleClose();
            case !!editNoteId:
                return editExistingNote(editNoteId);
            case !!noteState?.length:
                // HAS NOTES: APPEND NEW NOTE
                const id = `note-${noteState.length}`;
                setNoteState([...noteState, { id, primary: noteTitle, secondary: `${noteDesc}` }]);
                break;
            default:
                setNoteState([{ id: 'note-0', primary: noteTitle, secondary: `${noteDesc}` }]);
        }
    };

    const submitButtonProps = { noteTitle, createNote, editNoteId};

    const CreateNoteButton = () => (
        <IconButton
            aria-label='Create New Note'
            edge="end"
            onClick={handleOpen}
        >
            <AddCircleOutlineIcon
                color="primary"
                fontSize="large"
            />
        </IconButton>
    );

    const ModalBody = () => (
        <div style={modalStyle} className={classes.paper}>
            <form style={{marginTop: '1em'}} className={classes.root} onSubmit={createNote} noValidate autoComplete="off" >
                <TitleInput {...titleProps} />
                <DescInput {...descProps} />
                <SubmitButton {...submitButtonProps} />
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

export default NoteModal;