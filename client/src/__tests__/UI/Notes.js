import { fireEvent, screen } from '@testing-library/react';
import { initApp, openMainMenu, openNoteModal } from '../../test-helpers';

describe('Note Functions', () => {

    test('Can Delete Notes', async () => {
        await initApp();
        fireEvent.click(screen.getAllByRole(/deleteNote/)[0]);
        const welcomeNotes = screen.queryByText(/(Welcome To QuickList)/i);
        expect(welcomeNotes).toBeFalsy();
    });

    test('Cannot create blank notes', async () => {
        await initApp();
        openNoteModal();
        expect(screen.getByTestId('create-note-submit').closest('button')).toBeDisabled();
    });

    test('Can create a note with title', async () => {
        await initApp();
        // Open create note modal
        openNoteModal();
        // Input text into title field
        const titleInput = screen.getByLabelText('Note Title').closest('input');
        fireEvent.change(titleInput, { target: { value: 'Dondollo' } });
        // Submit the note
        const submitButton = screen.getByTestId('create-note-submit').closest('button');
        fireEvent.click(submitButton);
        // Test if a note has been created
        const newNote = screen.queryByText(/(Dondollo)/i);
        expect(newNote).toBeTruthy();
    });

});