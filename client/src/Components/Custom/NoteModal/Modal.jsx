import { useState } from 'react';

import {
    Modal,
    IconButton,
    Button,
    TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { isMobile } from 'react-device-detect';

const DescInput = ({ noteState, editNoteId, noteDesc, setNoteDesc }) => {

    let value = '';
    if (editNoteId) {
        value = noteState.filter(note => note.id === editNoteId)[0]['secondary'];
    }

    const handleDescChange = (evt) => {
        setNoteDesc(evt.target.value);
    };

    return (
        <TextField
            fullWidth
            label="Note Description (opt)"
            variant="outlined"
            onChange={handleDescChange}
            multiline
            rows={6}
            defaultValue={value}
        />
    );
}

const TitleInput = ({ noteState, editNoteId, noteTitle, setNoteTitle }) => {

    let value = '';
    if (editNoteId) {
        value = noteState.filter(note => note.id === editNoteId)[0]['primary'];
    }

    const handleTitleChange = (evt) => {
        setNoteTitle(evt.target.value);
    };

    return (
        <TextField
            autoFocus
            fullWidth
            label="Note Title"
            variant="outlined"
            defaultValue={value}
            onChange={handleTitleChange}
        />
    );
};

const SubmitButton = ({ noteState, editNoteId, createNote, noteTitle }) => (
    <Button
        aria-label="Create Note"
        edge="end"
        onClick={createNote}
        variant="outlined"
        color="primary"
        fullWidth
        disabled={noteTitle.length === 0}
    >
        CREATE NOTE
    </Button>
);

const NoteModal = ({
    darkMode,
    noteState,
    setNoteState,
    modalOpen,
    setModalOpen,
    editNoteId,
    setEditNoteId,
}) => {

    let editingNote, editingNoteIndex;

    if (editNoteId) {
        editingNoteIndex = noteState.findIndex(note => note.id === editNoteId);
        editingNote = noteState[editingNoteIndex];
    }

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

    const classes = useStyles();

    const noteProps = { noteState, editNoteId };

    const [noteDesc, setNoteDesc] = useState(editingNote?.secondary || '');
    const descProps = { ...noteProps, noteDesc, setNoteDesc };

    const [noteTitle, setNoteTitle] = useState(editingNote?.primary || '');
    const titleProps = { ...noteProps, noteTitle, setNoteTitle };

    const handleOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        setEditNoteId(false);
        setModalOpen(false);
    };

    const createNote = (evt) => {
        evt.preventDefault();
        if (!noteTitle.length) {
            handleClose();
            return false;
        }
        if (editNoteId) {
            let indOfNote = noteState.findIndex(note => note.id === editNoteId);
            noteState[indOfNote] = { id: editNoteId, primary: noteTitle, secondary: `${noteDesc}` };
            setNoteState([...noteState]);
        } else if (noteState?.length) {
            const id = `note-${noteState.length}`;
            setNoteState([...noteState, { id, primary: noteTitle, secondary: `${noteDesc}` }]);
        } else {
            setNoteState([{ id: 'note-0', primary: noteTitle, secondary: `${noteDesc}` }]);
        }
        handleClose();
    }

    const submitButtonProps = {
        noteTitle,
        createNote,
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <form style={{marginTop: '1em'}} className={classes.root} onSubmit={createNote} noValidate autoComplete="off" >
                <TitleInput {...titleProps} />
                <DescInput {...descProps} />
                <SubmitButton {...submitButtonProps} />
            </form>
        </div>
    );

    return (
        <div>
            <IconButton
                aria-label="Create Note"
                edge="end"
                onClick={handleOpen}
            >
                <AddCircleOutlineIcon
                    color="primary"
                    fontSize="large"
                />
            </IconButton>
            <Modal
                open={!!editNoteId || modalOpen}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}

export default NoteModal;