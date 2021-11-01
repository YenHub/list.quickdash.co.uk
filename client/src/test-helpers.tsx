import { render, fireEvent, screen } from './test-utils';
import App from './App';
import { act } from 'react-dom/test-utils';

// DOM Helpers
export const initApp = (): Promise<void> => act(async () => { render(<App />); });
export const openNoteModal = (): boolean => fireEvent.click(screen.getByTestId('create-note-button'));
export const openMainMenu = (): boolean => fireEvent.click(screen.getByTestId('menu-button'));
export const closeMainMenu = (): boolean => fireEvent.click(screen.getByTestId('close-menu-button'));
export const closeNoteModal = (): boolean => fireEvent.click(screen.getByTestId('create-note-close').closest('button')!);
export const submitNote = (): boolean => fireEvent.click(screen.getByTestId('create-note-submit').closest('button')!);
export const getNoteCount = (): number => document.querySelectorAll('.MuiListItemText-secondary').length;
export const toggleDarkMode = (): boolean => openMainMenu() && fireEvent.click(screen.getByTestId('dm-toggle')) && closeMainMenu();
export const toggleMD = (): boolean => openMainMenu() && fireEvent.click(screen.getByTestId('md-toggle')) && closeMainMenu();
export const toggleMDPreview = (): boolean => openMainMenu() && fireEvent.click(screen.getByTestId('md-preview-toggle')) && closeMainMenu();
export const acceptActionDialog = (): boolean => fireEvent.click(screen.getByTestId('action-dialog-accept'));
export const deleteAllNotes = (): void => {
    openMainMenu();
    fireEvent.click(screen.getByTestId('delete-all-notes'));
    acceptActionDialog();
    closeMainMenu();
};

export const setNoteTitle = (value: string): void => {
    const titleInput = screen.getByLabelText('Note Title').closest('input');
    fireEvent.change(titleInput!, { target: { value } });
};

export const setNoteDesc = (value: string): void => {
    const descInput = screen.getByLabelText('Note Description').closest('textarea');
    fireEvent.change(descInput!, { target: { value } });
};

export const deleteLastNote = (): void => {
    const deleteButtons = screen.getAllByRole(/deleteNote/);
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    acceptActionDialog();
};
