import {
    initApp,
    toggleMD,
    toggleDarkMode,
    toggleMDPreview,
} from '../../test-helpers';
import { Setting } from '../../Services/ReactUtils';

const checkBoolIsTruthy = (storageKey: Setting): boolean => window.localStorage.getItem(storageKey) === 'true';

describe('Menu Toggles', () => {

    test('Can Toggle DarkMode', async () => {
        await initApp();

        const darkModeActive = () => checkBoolIsTruthy('darkMode');

        // Test initial value is true
        expect(darkModeActive()).toBeTruthy();

        // Toggle the setting OFF
        toggleDarkMode();

        // Test stored value is now false
        expect(darkModeActive()).toBeFalsy();

        // Toggle the setting ON
        toggleDarkMode();

        // Test stored value is now false
        expect(darkModeActive()).toBeTruthy();
    });

    test('Can Toggle Markdown', async () => {
        await initApp();

        const mdModeActive = () => checkBoolIsTruthy('mdMode');
        expect(mdModeActive()).toBeFalsy();

        // Toggle MDMode Setting ON
        toggleMD();
        expect(mdModeActive()).toBeTruthy();

        // Toggle MDMode Setting OFF
        toggleMD();
        expect(mdModeActive()).toBeFalsy();
    });

    test('Can Toggle Markdown Preview', async () => {
        await initApp();

        const mdModeActive = () => checkBoolIsTruthy('previewMode');
        expect(mdModeActive()).toBeTruthy();

        // Enable MDMode (It's disabled by default)
        toggleMD();

        // MDPreview is enabled by default
        expect(mdModeActive()).toBeTruthy();

        // Toggle MDPreview Setting OFF
        toggleMDPreview();
        expect(mdModeActive()).toBeFalsy();
    });

});
