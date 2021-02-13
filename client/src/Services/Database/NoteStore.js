import localForage from 'localforage';

const Store = localForage.createInstance({
    name: "toDos"
});

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

    getNotes = () => Store.getItem(noteStore);

    setNotes = (notes) => Store.setItem(noteStore, notes);

    deleteNotes = () => Store.clear();

    setLegacyNotes = notes => {
        window.localStorage.setItem('listConfig', JSON.stringify(Object.assign({}, [...notes.map(it => it.primary)])));
    };

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