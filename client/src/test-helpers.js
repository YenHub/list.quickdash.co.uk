import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';

// DOM Helpers
export const initApp = () => act(async () => render(<App />));
export const openNoteModal = () => fireEvent.click(screen.getByTestId('create-note-button'));
export const openMainMenu = () => fireEvent.click(screen.getByTestId('menu-button'));