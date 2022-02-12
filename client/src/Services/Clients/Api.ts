import { NoteItem } from '../Database/NoteClient'
import { setNotes } from '../Reducers/noteSlice'
import { setSyncSequence, setVersion, setWebId } from '../Reducers/settingSlice'
import store from '../Store'

type SyncListItem = NoteItem & { index: number }

export const syncNewList = async (): Promise<void> => {
  const {
    notes: { noteState },
  } = store.getState()
  await postListItems(noteState).then(syncedNotes => postList(syncedNotes))
}

export const postList = async (listItems: NoteItem[]) => {
  const { settings } = store.getState()
  // POST Settings
  const { syncSequence, version, webId } = await new Promise(res =>
    setTimeout(() => {
      const { darkMode, colours, mdMode, previewMode } = settings
      console.log({ darkMode, mdMode, colours, previewMode })

      return res({ syncSequence: 1, version: 1, webId: 1 })
    }, 100),
  )
  // UPDATE STATE
  store.dispatch(setNotes(listItems))
  store.dispatch(setVersion({ version }))
  store.dispatch(setSyncSequence({ syncSequence }))
  store.dispatch(setWebId({ webId }))
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

  return syncedNotes
}
