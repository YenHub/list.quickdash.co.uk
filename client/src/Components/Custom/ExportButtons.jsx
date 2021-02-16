import Button from '@material-ui/core/Button';

export const DeleteNotes = ({ noteState, setNoteState }) => {

    const clearNotes = () => {
        let shouldDelete = window.confirm('Delete All Notes:\n\nAre you sure??');
        if (!shouldDelete) {
            return false;
        }
        setNoteState([]);
    };

    return (
        <Button
            aria-label='Delete Notes'
            edge="end"
            onClick={clearNotes}
            variant="outlined"
            color="primary"
            fullWidth
            disabled={noteState?.length ===0}
        >
            Delete Notes
        </Button>
    );
};