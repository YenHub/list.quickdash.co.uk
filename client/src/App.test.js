import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';

test('Header & Welcome List render correctly', async () => {
    await act(async () => render(<App />));
    const pageTitle = screen.getByText(/^QuickList$/i);
    expect(pageTitle).toBeInTheDocument();
    const items = await screen.findAllByText(/(Welcome To QuickList|Use the icons)/i);
    expect(items).toHaveLength(2);
});

test('Menu renders correctly', async () => {
    await act(async () => render(<App />));

    // Click button
    fireEvent.click(screen.getByTestId('menuButton'));

    // Wait for page to update with query text
    const deleteNoteButton = screen.getByText(/(Delete List)/i);
    expect(deleteNoteButton).toBeInTheDocument();
});

test('Note Modal renders correctly', async () => {
    await act(async () => render(<App />));
    fireEvent.click(screen.getByTestId('createNote'));

    const descriptionInput = await screen.findAllByText(/(Note Description)/);
    expect(descriptionInput[0]).toBeInTheDocument();
});

test('Can Delete Notes', async () => {
    await act(async () => render(<App />));

    await fireEvent.click(screen.getAllByRole(/deleteNote/)[0]);

    const welcomeNotes = screen.queryByText(/(Welcome To QuickList)/i);
    expect(welcomeNotes).toBeFalsy();
});