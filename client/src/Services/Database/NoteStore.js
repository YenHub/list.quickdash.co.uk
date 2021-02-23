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

    getNotes = () => this.importLegacyNotes();

    setNotes = (notes) => Store.setItem(noteStore, notes);

    deleteNotes = () => Store.clear();

    importLegacyNotes = async () => {
        const notes = await Store.getItem(noteStore);
        if(notes) {
            return notes;
        } else if(window.localStorage.getItem('listConfig') !== null) {
            const legacyNotes = Object.values(JSON.parse(window.localStorage.getItem('listConfig')));
            const mappedNotes = legacyNotes.map((note, id) => ({ id: `note-${id}`, primary: note, secondary: '' }));
            await this.setNotes(mappedNotes);
            return mappedNotes;
        }
        return [];
    }

    setLegacyNotes = async notes => {
        return window.localStorage.setItem('listConfig', JSON.stringify(Object.assign({}, [...notes.map(it => it.primary)])));
    };

};

// const myStore = new NoteStore();
//
// myStore.importLegacyNotes();

// myStore.createNote('New Note').then( () => myStore.getNotes().then( notes => (console.log(notes), myStore.deleteNotes())) );
// Store.clear();
//
// myStore.createNote({id: 'note-0', primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'}).then( () =>
//     myStore.createNote({id: 'note-1', primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'})
// );

// myStore.createNote('One Final Things');

export default NoteStore;