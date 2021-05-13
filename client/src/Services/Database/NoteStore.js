import localForage from 'localforage';

const Store = localForage.createInstance({
    name: "toDos"
});

const DefaultNotes = [{
        id: '4a11b44b-3f04-4f56-b468-ea36c091b03d',
        primary: 'Welcome to QuickList 🚀',
        secondary: '\n  • QuickList is a simple clutter free tool designed to help organise chaos using a good old fashioned list 😎\n' +
            '  • Your list is stored locally on your device, so it\'s secure and available to you anytime, even while you\'re offline\n',
    },
    {
        id: 'bca2f4a9-d510-4d6e-9b47-28c9fcc8ca07',
        primary: 'Use the icons to edit or delete this note 👀',
        secondary: 'Or, create new notes using the ➕ icon\n' +
            'There is also an option to delete all items from the main menu',
    },
    {
        id: 'dca2f4a9-d510-4d6e-9b47-28c9fcc8ca08',
        primary: 'Drag & drop items to rearrange them in the list 🔃',
        secondary: 'New items you create are added to the top of your list',
    },

    {
        id: '13a83e99-ea71-4505-81d0-92de5638a5dg',
        primary: 'Installing the app 💾',
        secondary: '  • Visit using your mobile to add QuickList to your homescreen now\n' +
            '  • If you are visiting using a desktop, you can also install using the link in the address bar\n\n' +
            'Not so old fashioned anymore, hey? 😉',
    },
    {
        id: '03a83e99-ea71-4505-81d0-92de5638a5df',
        primary: 'UPDATE: You can now use markdown in your descriptions! 🎉',
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