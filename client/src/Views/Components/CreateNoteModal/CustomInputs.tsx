import { TextField, Button } from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import { SetStateAction, ChangeEventHandler, Dispatch } from 'react';

interface ICustomInputs {
    noteTitle: string;
    setNoteTitle: Dispatch<SetStateAction<string>>;
    noteDesc: string;
    darkMode: boolean;
    setNoteDesc: Dispatch<SetStateAction<string>>;
    createNote(evt: any): void;
    editNoteId: string;
    handleClose(): void;
}

export const TitleInput = (
    { noteTitle, setNoteTitle }: Pick<ICustomInputs, 'noteTitle' | 'setNoteTitle'>,
): JSX.Element => {

    const handleTitleChange: ChangeEventHandler<HTMLInputElement> = evt => setNoteTitle(evt.target.value);

    return (
        <TextField
            autoFocus
            fullWidth
            label="Note Title"
            variant="outlined"
            defaultValue={noteTitle}
            onChange={handleTitleChange}
            inputProps={{ 'aria-label': 'Note Title' }}
        />
    );
};

export const DescInput = (
    { noteDesc, setNoteDesc }: Pick<ICustomInputs, 'noteDesc' | 'setNoteDesc'>,
): JSX.Element => {

    const handleDescChange: ChangeEventHandler<HTMLInputElement> = evt => setNoteDesc(evt.target.value);

    return (
        <TextField
            fullWidth
            data-testid="description-input"
            label="Note Description (optional)"
            variant="outlined"
            onChange={handleDescChange}
            multiline
            rows={isMobile ? 6 : 12}
            defaultValue={noteDesc}
            inputProps={{ 'aria-label': 'Note Description' }}
        />
    );
};

export const SubmitButton = (
    { createNote, noteTitle, editNoteId, noteDesc }: Pick<ICustomInputs, 'createNote' | 'noteTitle' | 'editNoteId' | 'noteDesc'>,
): JSX.Element => {
    const noteLabel = `${editNoteId ? 'Update' : 'Create'}`;

    return (
        <Button
            aria-label={noteLabel}
            onClick={createNote}
            variant="outlined"
            color="primary"
            disabled={!noteTitle.length && !noteDesc.length}
            data-testid="create-note-submit"
            style={{ width: '48%', marginLeft: '2%' }}
        >
            {noteLabel}
        </Button>
    );
};

export const CloseButton = (
    { handleClose, editNoteId, darkMode }: Pick<ICustomInputs, 'handleClose' | 'editNoteId' | 'darkMode'>) => {
    return (
        <Button
            aria-label={'Close Note'}
            onClick={handleClose}
            variant="outlined"
            data-testid="create-note-close"
            // color="primary"
            color={darkMode ? 'default' : 'primary'}
            style={{ color: `${darkMode ? 'lightGrey' : 'black'}`, width: '48%', marginRight: '2%' }}
        >
            {editNoteId ? 'Cancel' : 'Close'}
        </Button>
    );
};
