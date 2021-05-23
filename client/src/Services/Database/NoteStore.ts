import localForage from 'localforage';
import { DefaultNotes } from './DefaultNotes';

export type NoteItem = {
    id: string,
    primary?: string,
    secondary?: string,
}

const noteStore = 'notes';

const Store = localForage.createInstance({
    name: "toDos"
});

class NoteStore {

    createNote = async (note: NoteItem) => {
        if(note) {
            const notes = await Store.getItem<NoteItem[]>(noteStore);
            if(notes) {
                note.id = `note-${++notes.length}`;
                Store.setItem(noteStore, [...notes, note]);
            } else {
                note.id = `note-0`;
                Store.setItem(noteStore, [note]);
            }
        }
    };

    getNotes = async (): Promise<NoteItem[]> => {
        const storedNotes = await Store.getItem<NoteItem[]>(noteStore);
        return storedNotes?.length ? storedNotes : DefaultNotes;
    };

    setNotes = (notes: NoteItem[]) => Store.setItem(noteStore, notes);

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