import axios from 'axios'

import { NoteItem } from '../Database/NoteClient'
import { SettingState } from '../Reducers/settingSlice'
import store from '../Store'

const { REACT_APP_ENV, REACT_APP_API_DEV, REACT_APP_API_PROD } = process.env

const baseURL = REACT_APP_ENV === 'development' ? REACT_APP_API_DEV : REACT_APP_API_PROD

const api = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: false,
})

export const syncNewList = async (): Promise<CreateListResponse> => {
  const syncedSettings = await createList()
  const syncedNotes = await createListItems(syncedSettings)

  return {
    ...syncedSettings,
    listItems: syncedNotes,
  }
}

type CreateListResponse = {
  listItems: NoteItem[]
} & SettingState

export const createList = async (): Promise<SettingState> => {
  const { settings } = store.getState()

  const newSettings = await api
    // POST Settings
    .post('/list/create', {
      list: settings,
    })

  return newSettings.data
}

export const createListItems = async (settings: SettingState): Promise<NoteItem[]> => {
  const syncedNotes: NoteItem[] = []
  const {
    notes: { noteState },
  } = store.getState()

  for (const [index, note] of Object.entries(noteState)) {
    // IGDev: Fix the lack of index here, it should live on the list
    await api
      // POST Settings
      .post('/list/item/create', {
        listItem: {
          clientId: note.id,
          listId: settings.webId,
          title: note.primary,
          body: note.secondary,
          index,
        },
      })
      .then(({ data: { webId, syncSequence } }) => {
        syncedNotes.push({
          ...note,
          syncSequence,
          webId,
        })
      })
  }

  return syncedNotes
}
