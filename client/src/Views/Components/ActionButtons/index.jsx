import Button from '@material-ui/core/Button';

import { getUniqueId } from '../../../Services/UUID';
import { downloadFile } from '../../../Services/BrowserUtils';

const CustomButton = props => (
    <Button
        {...props}
        edge="end"
        variant="outlined"
        fullWidth
    >
        {props['aria-label']}
    </Button>
);

export const DeleteNotes = ({ noteState, setNoteState }) => {

    const clearNotes = () => {
        let shouldDelete = window.confirm('Are you sure you want to delete all your notes?');
        if (!shouldDelete) {
            return false;
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

export const ImportButton = ({ noteState, setNoteState }) => {

    const importNotes = (noteState) => {
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

export const ExportButton = ({ noteState }) => {

    const exportNotes = (noteState) => {
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