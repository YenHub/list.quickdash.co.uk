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
            label="Note Description (opt)"
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
    const noteLabel = `${editNoteId ? 'Update' : 'Create'} Note`;
    return (
        <Button
            aria-label={noteLabel}
            edge="end"
            onClick={createNote}
            variant="outlined"
            color="primary"
            fullWidth
            disabled={noteTitle.length === 0}
        >
            {noteLabel}
        </Button>
    );
};