import localForage from 'localforage'
import { DefaultNotes } from './DefaultNotes'

export interface NoteItem {
  id: string
  webId?: string
  primary?: string
  secondary?: string
}

const noteStore = 'notes'

const Store = localForage.createInstance({
  name: 'toDos',
})

class NoteClient {
  public createNote = async (note: NoteItem) => {
    if (note) {
      const notes = await Store.getItem<NoteItem[]>(noteStore)
      if (notes) {
        note.id = `note-${++notes.length}`
        Store.setItem(noteStore, [...notes, note])
      } else {
        note.id = 'note-0'
        Store.setItem(noteStore, [note])
      }
    }
  }

  public getNotes = async (): Promise<NoteItem[]> => {
    const storedNotes = (await Store.getItem<NoteItem[]>(noteStore)) || []

    if (!storedNotes.length) return DefaultNotes

    return storedNotes
  }

  public setNotes = async (notes: NoteItem[]): Promise<NoteItem[]> =>
    Store.setItem(noteStore, notes)

  public deleteNotes = (): Promise<void> => Store.clear()
}

// const myStore = new NoteStore();

// myStore.createNote('New Note').then( () => myStore.getNotes().then( notes => (console.log(notes), myStore.deleteNotes())) );
// Store.clear();
//
// myStore.createNote({id: 'note-0', primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'}).then( () =>
//     myStore.createNote({id: 'note-1', primary: 'Do this thing', secondary: 'This is not overly important but should get to it soon'})
// );

// myStore.createNote('One Final Things');

export default NoteClient
