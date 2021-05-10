import localForage from 'localforage';

const Store = localForage.createInstance({
    name: "toDos"
});

const DefaultNotes = [{
        id: '4a11b44b-3f04-4f56-b468-ea36c091b03d',
        primary: 'Welcome to QuickList',
        secondary: '• Create your own simple lists to help organise the chaos! \n' +
            '• Your list is stored locally on your device 😎',
    },
    {
        id: 'bca2f4a9-d510-4d6e-9b47-28c9fcc8ca07',
        primary: 'Use the icons to edit or delete this note',
        secondary: 'Or, create new notes using the ➕ icon',
    },
    {
        id: '03a83e99-ea71-4505-81d0-92de5638a5df',
        primary: 'NEW: You can now use markdown in your descriptions! 🎉',
        secondary: 'Head on over to settings to enable the feature 😎',
    }
];

const noteStore = 'notes';

class NoteStore {

    createNote = async (note) => {
        if(note) {
            const notes = await Store.getItem(noteStore);
            if(notes) {
                note.id = `note-${++notes.length}`;
                Store.setItem(noteStore, [...notes, note]);
            } else {
                note.id = `note-0`;
                Store.setItem(noteStore, [note]);
            }
        }
    };

    getNotes = async () => {
        const notes = await Store.getItem(noteStore);
        switch (true) {
            case (notes?.length > 0):
                // Existing Notes Found
                return notes;
            default:
                // First Visit: Default Notes
                return DefaultNotes;
        }
    };

    setNotes = (notes) => Store.setItem(noteStore, notes);

    deleteNotes = () => Store.clear();

};

// const myStore = new NoteStore();

// myStore.createNote('New Note').then( () => myStore.getNotes().then( notes => (console.log(notes), myStore.deleteNotes())) );
// Store.clear();
//
// myStore.createNote({id: 'note-0', primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'}).then( () =>
//     myStore.createNote({id: 'note-1', primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'})
// );

// myStore.createNote('One Final Things');

export default NoteStore;