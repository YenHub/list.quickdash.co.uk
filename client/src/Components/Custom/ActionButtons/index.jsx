import Button from '@material-ui/core/Button';

import { getUniqueId } from '../../../Services/UUID';
import { downloadFile } from '../../../Services/BrowserUtils';

const CustomButton = ({ ariaLabel, onClick, disabled, type }) => (
    <Button
        aria-label={ariaLabel}
        edge="end"
        onClick={onClick}
        variant="outlined"
        color={type}
        fullWidth
        disabled={disabled}
    >
        {ariaLabel}
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
        ariaLabel: 'Delete Notes',
        onClick: clearNotes,
        disabled: noteState?.length === 0,
        type: 'primary',
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
        ariaLabel: 'Import Notes',
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
        ariaLabel: 'Export Notes',
        onClick: () => exportNotes(noteState),
        disabled: noteState?.length === 0,
        type: 'default',
    };

    return <CustomButton {...buttonProps}/>;
};