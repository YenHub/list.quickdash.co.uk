import localForage from 'localforage';

const Store = localForage.createInstance({
    name: "toDos"
});

const Logger = msg => {
    console.log(`%c

    ${msg}

        `, 'color: lightblue;font-weight: bold; font-size: 15px');
}

const noteStore = 'notes';

class NoteStore {

    storeName = 'notes';

    constructor() {
        this.store = Store;
    }

    init = async () => {
        if(!this.store.length()) {

        }
    }

    // updateNote = async (note) => {
    //     const notes = await this.store.getItem(noteStore);
    //
    // }

    createNote = async (note) => {
        const notes = await this.store.getItem(noteStore);
        if(notes) {
            this.store.setItem(noteStore, [...notes, note]);
        } else {
            this.store.setItem(noteStore, [note]);
        }
    };

    getNotes = () => this.store.getItem(noteStore);

    setNotes = (notes) => this.store.setItem(noteStore, notes);

    deleteNotes = () => this.store.clear();

};

// const myStore = new NoteStore();

// myStore.createNote('New Note').then( () => myStore.getNotes().then( notes => (console.log(notes), myStore.deleteNotes())) );

// myStore.createNote({primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'});

// myStore.createNote('One Final Things');

// Store.clear();

export default NoteStore;