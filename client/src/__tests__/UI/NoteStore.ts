import { initApp, getNoteCount } from '../../test-helpers';

import { noteStore } from '../../Views/Main';

beforeEach(async () => {
    await noteStore.createNote({id: 'note-0', primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'});
    await initApp();
});

describe('Note Store', () => {

    test('Does not overwrite notes persisted in store', async () => {
        const initialCount = getNoteCount();
        expect(initialCount).toBe(1);
    });

});
