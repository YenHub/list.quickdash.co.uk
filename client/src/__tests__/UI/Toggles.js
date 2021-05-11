import { fireEvent, screen } from '@testing-library/react';
import { initApp, openMainMenu } from '../../test-helpers';

describe('Menu Toggles', () => {

    test('Can Toggle DarkMode', async () => {
        await initApp();

        // Test initial value is true
        const darkModeActive = () => window.localStorage.darkMode === 'true';
        expect(darkModeActive()).toBeTruthy();

        // Toggle the setting
        openMainMenu();
        fireEvent.click(screen.getByTestId('dm-toggle'));

        // Test stored value is now false
        expect(darkModeActive()).toBeFalsy();
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