import { fireEvent, screen } from '@testing-library/react';
import { initApp, openMainMenu } from '../../test-helpers';

describe('Menu Toggles', () => {

    test('Can Toggle DarkMode', async () => {
        await initApp();

        const darkModeActive = () => window.localStorage.getItem('darkMode') === 'true';

        // Test initial value is true
        expect(darkModeActive()).toBeTruthy();

        // Toggle the setting OFF
        openMainMenu() && fireEvent.click(screen.getByTestId('dm-toggle'));

        // Test stored value is now false
        expect(darkModeActive()).toBeFalsy();
    });

    test('Can Toggle Markdown', async () => {
        await initApp();

        const mdModeActive = () => window.localStorage.getItem('mdMode') === 'true';
        expect(mdModeActive()).toBeFalsy();

        // Toggle Setting ON
        openMainMenu() && fireEvent.click(screen.getByTestId('md-toggle'));
        expect(mdModeActive()).toBeTruthy();
    });

});