import { fireEvent, screen } from '../../test-utils';
import {
    initApp,
    toggleMD,
    toggleDarkMode,
    toggleMDPreview,
    openNoteModal,
    setNoteDesc,
} from '../../test-helpers';
import { Setting } from '../../Services/ReactUtils';

const checkBoolIsTruthy = (storageKey: Setting): boolean => window.localStorage.getItem(storageKey) === 'true';

beforeEach(async () => {
    await initApp();
});

describe('Menu Toggles', () => {

    test('Can Toggle DarkMode', async () => {
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
        const mdModeActive = () => checkBoolIsTruthy('mdMode');

        // Test initial value is false
        expect(mdModeActive()).toBeFalsy();

        // Toggle MDMode Setting ON
        toggleMD();
        expect(mdModeActive()).toBeTruthy();

        // Toggle MDMode Setting OFF
        toggleMD();
        expect(mdModeActive()).toBeFalsy();
    });

    test('Can Toggle Markdown Preview', async () => {
        const mdModeActive = () => checkBoolIsTruthy('previewMode');

        // Test initial value is true
        expect(mdModeActive()).toBeTruthy();

        // Enable MDMode (It's disabled by default)
        toggleMD();

        // MDPreview is enabled by default
        expect(mdModeActive()).toBeTruthy();

        // Toggle MDPreview Setting OFF
        toggleMDPreview();
        expect(mdModeActive()).toBeFalsy();
    });

    test('Can Toggle Markdown Preview in Create Note Modal', async () => {
        const mdModeActive = () => checkBoolIsTruthy('mdMode');

        // Enable MDMode (It's disabled by default)
        toggleMD();
        expect(mdModeActive()).toBeTruthy();

        // Open the note modal & create a note with a HR
        openNoteModal();
        setNoteDesc('---');
        const beforeToggle = document.querySelectorAll('form hr');

        // Check the preview is active & HR has rendered
        expect(beforeToggle.length).toEqual(1);

        // Turn off the preview
        fireEvent.click(screen.getByTestId('create-note-md-toggle'));
        const afterToggle = document.querySelectorAll('form hr');

        // Check the HR is now absent
        expect(afterToggle.length).toEqual(0);

        // Toggle MDMode OFF
        toggleMD();
        expect(mdModeActive()).toBeFalsy();

        // Check the toggle is not present
        openNoteModal();
        expect(screen.queryByTestId('create-note-md-toggle')).toBeNull();
    });
});
