import { screen } from '@testing-library/react';
import {
    initApp,
    openNoteModal,
    setNoteTitle,
    setNoteDesc,
    deleteLastNote,
    closeNoteModal,
    getNoteCount,
    submitNote,
    toggleMD,
} from '../../test-helpers';

beforeEach(async () => {
    await initApp();
});

describe('Note Functions', () => {

    test('Can delete notes', async () => {
        const initialCount = getNoteCount();

        // Run delete note routine
        deleteLastNote();

        // Check a note was deleted
        expect(getNoteCount()).toBe(initialCount - 1);

        // Refresh the window
        global.location.assign('');

        // Check the notes persist a refresh
        expect(getNoteCount()).toBe(initialCount - 1);
    });

    test('Cannot create blank notes', async () => {

        // Open the note modal & check the submit button is disabled
        openNoteModal();
        expect(screen.getByTestId('create-note-submit').closest('button')).toBeDisabled();

        // Check count before > attempt to submit > check count after
        const expectedCount = getNoteCount();

        // Try to submit the blank note anyway
        submitNote();

        // Check the count hasn't changed
        expect(getNoteCount()).toBe(expectedCount);

    });

    test('Can create a note with only a title', async () => {
        const expectedCount = getNoteCount();
        openNoteModal();
        setNoteTitle('Dondollo');
        submitNote();
        // Check modal has closed
        expect(screen.queryByTestId('create-note-submit')).toBeNull();
        // Check the note was created
        expect(screen.queryByText(/(Dondollo)/i)).toBeInTheDocument();
        expect(getNoteCount()).toBe(expectedCount + 1);
    });

    test('Can create a note with only a desc', async () => {
        const expectedCount = getNoteCount();
        openNoteModal();
        setNoteDesc('Only Desc ab123');
        submitNote() && closeNoteModal();
        // Test the modal is closed
        expect(screen.queryByTestId('create-note-submit')).toBeNull();
        // Test if the note has been created
        expect(screen.queryByText(/Only Desc ab123/i)).toBeInTheDocument();
        expect(getNoteCount()).toBe(expectedCount + 1);
    });

    test('Can create a note using Markdown', async () => {

        // Create a new note with a MD <hr> "---"
        const expectedCount = getNoteCount();
        openNoteModal();
        expect(screen.queryByTestId('create-note-submit')).toBeInTheDocument();
        setNoteTitle('MDTitle');
        setNoteDesc('---');
        submitNote();
        expect(getNoteCount()).toBe(expectedCount + 1);

        // Check the note modal has closed
        expect(screen.queryByTestId('create-note-submit')).toBeNull();

        // Enable MD
        toggleMD();

        // Test if a note has been created with a <hr>
        const newNote = document.querySelectorAll('.MuiListItem-container hr');
        expect(newNote.length).toEqual(1);
    });

    test('Markdown Preview Works', async () => {

        const expectedCount = getNoteCount();
        // Create a new note
        openNoteModal();
        expect(screen.queryByTestId('create-note-submit')).toBeInTheDocument();
        setNoteTitle('MDPreviewCheck');
        setNoteDesc('---');

        // Check the preview window is absent & submit the note
        expect(document.querySelectorAll('form hr').length).toEqual(0);
        submitNote();

        // Check the note was created
        expect(getNoteCount()).toBe(expectedCount + 1);

        // Enable MDMode (It's disabled by default)
        toggleMD();

        // Check MDMode & Preview mode are now active
        expect(window.localStorage.mdMode).toEqual('true');
        expect(window.localStorage.previewMode).toEqual('true');

        // Create another note
        openNoteModal();
        expect(screen.queryByTestId('create-note-submit')).toBeInTheDocument();
        setNoteTitle('MDPreviewFinalCheck');
        setNoteDesc('---');

        // Check the preview window is rendering the Markdown
        expect(document.querySelectorAll('form hr').length).toEqual(1);

    });

});
