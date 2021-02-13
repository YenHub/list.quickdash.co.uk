import localForage from 'localforage';

const Store = localForage.createInstance({
    name: "toDos"
});

const noteStore = 'notes';

class NoteStore {

    createNote = async (note) => {
        const notes = await Store.getItem(noteStore);
        if(notes) {
            Store.setItem(noteStore, [...notes, note]);
        } else {
            Store.setItem(noteStore, [note]);
        }
    };

    getNotes = () => Store.getItem(noteStore);

    setNotes = (notes) => Store.setItem(noteStore, notes);

    deleteNotes = () => Store.clear();

};

// const myStore = new NoteStore();

// myStore.createNote('New Note').then( () => myStore.getNotes().then( notes => (console.log(notes), myStore.deleteNotes())) );

// myStore.createNote({primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'});

// myStore.createNote('One Final Things');

// Store.clear();

export default NoteStore;