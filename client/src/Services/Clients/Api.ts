import { NoteItem } from '../Database/NoteClient'
import store from '../Store'

type SyncListItem = NoteItem & { index: number }

export const sendAllItems = async (): Promise<void> => {
  const {
    notes: { noteState },
  } = store.getState()
  await postListItems(noteState)
}

export const postListItems = async (noteState: NoteItem[]) => {
  const syncedNotes: NoteItem[] = []
  for (const [index, note] of Object.entries(noteState)) {
    const syncedNote: SyncListItem = { ...note, index: Number(index) }
    console.log(syncedNote)
    // IGDev: Send note, get webId back and store web ID
    const { syncSequence, webId } = await new Promise(res =>
      setTimeout(() => res({ syncSequence: 1, webId: 'asds' }), 100),
    )
    // const syncSequence = 1
    // const webId = 'abs-123-def'
    syncedNotes.push({
      ...note,
      syncSequence,
      locked: false,
      webId,
    })
  }
  console.log(syncedNotes)

  // once all notes have been stored, we can then commit the new 'synced' state to the notes list
  return
}

export const api = true
