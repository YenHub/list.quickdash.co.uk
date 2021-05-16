import { TextField, Button } from '@material-ui/core';
import { isMobile } from 'react-device-detect';

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
            data-testid="description-input"
            label="Note Description (optional)"
            variant="outlined"
            onChange={handleDescChange}
            multiline
            rows={isMobile ? 6 : 8}
            defaultValue={noteDesc}
            inputProps={{'aria-label': 'Note Description'}}
        />
    );
};

export const SubmitButton = ({ createNote, noteTitle, editNoteId, noteDesc }) => {
    const noteLabel = `${editNoteId ? 'Update' : 'Create'}`;
    return (
        <Button
            aria-label={noteLabel}
            edge="end"
            onClick={createNote}
            variant="outlined"
            color="primary"
            disabled={!noteTitle.length && !noteDesc.length}
            data-testid="create-note-submit"
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
            data-testid="create-note-close"
            style={{color: `${darkMode ? 'lightGrey' : 'black'}`, width: '48%', marginRight: '2%'}}
        >
            {editNoteId ? 'Cancel' : 'Close'}
        </Button>
    );
};

