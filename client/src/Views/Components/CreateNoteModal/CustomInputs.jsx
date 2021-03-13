import { TextField, Button } from '@material-ui/core';

export const TitleInput = ({ noteTitle, setNoteTitle }) => {

    const handleTitleChange = (evt) => {
        setNoteTitle(evt.target.value);
    };

    return (
        <TextField
            autoFocus
            fullWidth
            label="Note Title"
            variant="outlined"
            defaultValue={noteTitle}
            onChange={handleTitleChange}
            inputProps={{'aria-label': 'Note Title'}}
        />
    );
};

export const DescInput = ({ noteDesc, setNoteDesc }) => {

    const handleDescChange = (evt) => {
        setNoteDesc(evt.target.value);
    };

    return (
        <TextField
            fullWidth
            label="Note Description (optional)"
            variant="outlined"
            onChange={handleDescChange}
            multiline
            rows={6}
            defaultValue={noteDesc}
            inputProps={{'aria-label': 'Note Description'}}
        />
    );
};

export const SubmitButton = ({ createNote, noteTitle, editNoteId }) => {
    const noteLabel = `${editNoteId ? 'Update' : 'Create'}`;
    return (
        <Button
            aria-label={noteLabel}
            edge="end"
            onClick={createNote}
            variant="outlined"
            color="primary"
            disabled={noteTitle.length === 0}
            style={{width: '48%', marginLeft: '2%'}}
        >
            {noteLabel}
        </Button>
    );
};

export const CloseButton = ({ handleClose, editNoteId, darkMode}) => {
    return (
        <Button
            aria-label={'Close Note'}
            edge="end"
            onClick={handleClose}
            variant="outlined"
            color={`${darkMode ? 'default' : 'primary'}`}
            style={{color: `${darkMode ? 'lightGrey' : 'black'}`, width: '48%', marginRight: '2%'}}
        >
            {editNoteId ? 'Cancel' : 'Close'}
        </Button>
    );
};

