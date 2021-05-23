import { screen } from '@testing-library/react';
import {
    initApp,
    openNoteModal,
    setNoteTitle,
    setNoteDesc,
    deleteLastNote,
    closeNoteModal,
    getNoteCount,
    toggleMD,
    submitNote,
} from '../../test-helpers';

describe('Note Functions', () => {

    test('Can delete notes', async () => {
        await initApp();
        const initialCount = getNoteCount();
        deleteLastNote();
        expect(getNoteCount()).toBe(initialCount - 1);
        await global.location.assign('');
        expect(getNoteCount()).toBe(initialCount - 1);
    });

    test('Cannot create blank notes', async () => {
        await initApp();
        openNoteModal();
        expect(screen.getByTestId('create-note-submit').closest('button')).toBeDisabled();
        // Check count before > attempt to submit > check count after
        const expectedCount = getNoteCount();
        submitNote()
        expect(getNoteCount()).toBe(expectedCount);
    });

    test('Can create a note with only a title', async () => {
        await initApp();
        openNoteModal();
        setNoteTitle('Dondollo')
        submitNote()
        // Check modal has closed
        expect(screen.queryByTestId('create-note-submit')).toBeNull();
        // Check the note was created
        expect(screen.queryByText(/(Dondollo)/i)).toBeTruthy();
    });

    test('Can create a note with only a desc', async () => {
        await initApp();
        openNoteModal();
        setNoteDesc('Only Desc ab123');
        submitNote() && closeNoteModal();
        // Test the modal is closed
        expect(screen.queryByTestId('create-note-submit')).toBeNull();
        // Test if the note has been created
        expect(screen.queryByText(/Only Desc ab123/i)).toBeInTheDocument();
    });

    test('Can create a note using Markdown', async () => {
        await initApp();
        toggleMD();
        openNoteModal();
        setNoteTitle('MDTitle');
        setNoteDesc('---');
        submitNote() && toggleMD();
        // Test the modal is closed
        expect(screen.queryByTestId('create-note-submit')).toBeNull();
        // Test if a note has been created with a <hr>
        const newNote = document.querySelectorAll('.MuiListItem-container hr');
        expect(newNote.length === 1).toBeTruthy();
    });

});