import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';

// DOM Helpers
export const initApp = () => act(async () => render(<App />));
export const openNoteModal = () => fireEvent.click(screen.getByTestId('create-note-button'));
export const openMainMenu = () => fireEvent.click(screen.getByTestId('menu-button'));
export const closeNoteModal = () => fireEvent.click(screen.getByTestId('create-note-close').closest('button'));
export const submitNote = () => fireEvent.click(screen.getByTestId('create-note-submit').closest('button'));
export const getNoteCount = () => document.querySelectorAll('.MuiListItemText-secondary').length;
export const toggleMD = () => openMainMenu() && fireEvent.click(screen.getByTestId('md-toggle'));

export const setNoteTitle = value => {
    const titleInput = screen.getByLabelText('Note Title').closest('input');
    fireEvent.change(titleInput, { target: { value } });
};

export const setNoteDesc = value => {
    const descInput = screen.getByLabelText('Note Description').closest('textarea');
    fireEvent.change(descInput, { target: { value } });
};

export const deleteLastNote = () => {
    const deleteButtons = screen.getAllByRole(/deleteNote/);
    fireEvent.click(deleteButtons[deleteButtons.length-1]);
};

