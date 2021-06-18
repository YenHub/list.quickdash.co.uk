import { FC, useContext } from 'react';

import Button from '@material-ui/core/Button';

import { getUniqueId } from '../../../Services/UUID';
import { downloadFile } from '../../../Services/BrowserUtils';
import { NoteItem } from '../../../Services/Database/NoteStore';

import { store } from '../../../Services/State/Store';

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

export const DeleteNotes: FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { noteState } = state;

    const clearNotes = (): void => {
        const shouldDelete = window.confirm('Are you sure you want to delete all your notes?');
        if (!shouldDelete) {
            return;
        }
        dispatch({type: 'SetNotes', payload: []});
    };

    const buttonProps = {
        'aria-label': 'Delete List',
        onClick: clearNotes,
        disabled: noteState?.length === 0,
        'data-testid': 'delete-all-notes',
        color: 'primary',
    };

    return <CustomButton {...buttonProps}/>;
};

export const ImportButton: FC = () => {

    const globalState = useContext(store);
    const { state, dispatch } = globalState;
    const { noteState } = state;

    const importNotes = (noteState: NoteItem[]) => {
        const currentNotes = [...noteState];
        [
            { primary: 'test', secondary: 'More Text' },
            { primary: 'test Two', secondary: 'More Text again' },
            { primary: 'Three', secondary: '' },
            { primary: 'Four', secondary: 'A bigger description' },
        ].map(item => {
            return currentNotes.push({ ...item, id: getUniqueId(currentNotes) });
        });
        dispatch({type: 'SetNotes', payload: currentNotes});
    };

    const buttonProps = {
        'aria-label': 'Import Notes',
        onClick: () => importNotes(noteState),
        disabled: !noteState,
        type: 'secondary',
    };

    return <CustomButton {...buttonProps}/>;

};

export const ExportButton: FC = () => {

    const globalState = useContext(store);
    const { state } = globalState;
    const { noteState } = state;

    const exportNotes = (noteState: NoteItem[]): void => {
        const exportContent = JSON.stringify(noteState.map(note => ({ primary: note.primary, secondary: note.secondary })));
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
