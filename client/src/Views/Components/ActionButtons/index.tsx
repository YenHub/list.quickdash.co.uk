import { SetStateAction, Dispatch } from 'react';

import Button from '@material-ui/core/Button';

import { getUniqueId } from '../../../Services/UUID';
import { downloadFile } from '../../../Services/BrowserUtils';
import { NoteItem } from '../../../Services/Database/NoteStore';

const CustomButton = (props: any) => (
    <Button
        {...props}
        edge="end"
        variant="outlined"
        fullWidth
    >
        {props['aria-label']}
    </Button>
);

interface IActionButtons {
    noteTitle: string,
    setNoteTitle: Dispatch<SetStateAction<string>>,
    noteDesc: string,
    darkMode: boolean,
    setNoteDesc: Dispatch<SetStateAction<string>>,
    createNote: (evt: any) => void,
    editNoteId: string,
    handleClose: () => void,
    noteState: NoteItem[],
    setNoteState: Dispatch<SetStateAction<NoteItem[]>>,
};

export const DeleteNotes = (
    { noteState, setNoteState }: Pick<IActionButtons, "noteState" | "setNoteState">
): JSX.Element => {

    const clearNotes = (): void => {
        let shouldDelete = window.confirm('Are you sure you want to delete all your notes?');
        if (!shouldDelete) {
            return;
        }
        setNoteState([]);
    };

    const buttonProps = {
        'aria-label': 'Delete List',
        onClick: clearNotes,
        disabled: noteState?.length === 0,
        'data-testid': 'delete-all-notes',
        color: 'primary',
    }

    return <CustomButton {...buttonProps}/>;
};

export const ImportButton = (
    { noteState, setNoteState }: Pick<IActionButtons, "noteState" | "setNoteState">
): JSX.Element => {

    const importNotes = (noteState: NoteItem[]) => {
        let currentNotes = [...noteState];
        [
            { primary: 'test', secondary: 'More Text' },
            { primary: 'test Two', secondary: 'More Text again' },
            { primary: 'Three', secondary: '' },
            { primary: 'Four', secondary: 'A bigger description' },
        ].map(item => {
            return currentNotes.push({ ...item, id: getUniqueId(currentNotes) });
        });
        setNoteState([...currentNotes]);
        return;
    };

    const buttonProps = {
        'aria-label': 'Import Notes',
        onClick: () => importNotes(noteState),
        disabled: !noteState,
        type: 'secondary',
    };

    return <CustomButton {...buttonProps}/>;

};

export const ExportButton = (
    { noteState }: Pick<IActionButtons, "noteState">
): JSX.Element => {

    const exportNotes = (noteState: NoteItem[]): void => {
        let exportContent = JSON.stringify(noteState.map(note => ({ primary: note.primary, secondary: note.secondary })));
        downloadFile(exportContent);
    };

    const buttonProps = {
        'aria-label': 'Export Notes',
        onClick: () => exportNotes(noteState),
        disabled: noteState?.length === 0,
        type: 'default',
    };

    return <CustomButton {...buttonProps}/>;
};