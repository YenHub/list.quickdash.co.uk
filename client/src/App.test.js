import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';

// DOM Helpers
const initApp = () => act(async () => render(<App />));
const openNoteModal = () => fireEvent.click(screen.getByTestId('create-note-button'));
const openMainMenu = () => fireEvent.click(screen.getByTestId('menu-button'));

// TESTS
describe('UI Rendering', () => {

    test('Header & Welcome List Renders', async () => {
        await initApp();
        const pageTitle = screen.getByText(/^QuickList$/i);
        expect(pageTitle).toBeInTheDocument();
        const items = await screen.findAllByText(/(Welcome To QuickList|Use the icons)/i);
        expect(items).toHaveLength(2);
    });

    test('Menu Renders', async () => {
        await initApp();
        openMainMenu();
        // Wait for page to update with query text
        const deleteNoteButton = screen.getByText(/(Delete List)/i);
        expect(deleteNoteButton).toBeInTheDocument();
    });

    test('Note Modal Renders', async () => {
        await initApp();
        openNoteModal();
        const descriptionInput = screen.getByTestId('description-input');
        expect(descriptionInput).toBeInTheDocument();
    });

});

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

describe('Menu Toggles', () => {

    test('Can Toggle DarkMode', async () => {
        await initApp();

        // Test initial value
        const darkModeActive = window.localStorage.darkMode === 'true';
        expect(darkModeActive).toBeTruthy();

        // Toggle Setting
        openMainMenu();
        fireEvent.click(screen.getByTestId('dm-toggle'));

        // Test result
        const darkModeDisabled = window.localStorage.darkMode === 'false';
        expect(darkModeDisabled).toBeTruthy();
    });

    test('Can Toggle Markdown', async () => {
        await initApp();

        const mdModeActive = () => window.localStorage.mdMode === 'true';

        // Test initial value
        expect(mdModeActive()).toBeFalsy();

        // Toggle Setting
        openMainMenu() && fireEvent.click(screen.getByTestId('md-toggle'));

        // Check MD is Toggled
        expect(mdModeActive()).toBeTruthy();
    });

});