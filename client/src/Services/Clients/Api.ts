import axios from 'axios'

import type { NoteItem } from '../Database/NoteClient'
import { type SettingState, useAppStore } from '../Store'

const baseURL =
  import.meta.env.MODE === 'development'
    ? (import.meta.env.VITE_API_DEV as string)
    : (import.meta.env.VITE_API_PROD as string)

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
  const { settings } = useAppStore.getState()

  const newSettings = await api
    // POST Settings
    .post<SettingState>('/list/create', {
      list: settings,
    })

  return newSettings.data
}

export const createListItems = async (
  settings: SettingState,
): Promise<NoteItem[]> => {
  const syncedNotes: NoteItem[] = []
  const {
    notes: { noteState },
  } = useAppStore.getState()

  // IGDev: Fix the lack of index here, it should live on the list
  for (const [index, note] of Object.entries(noteState))
    await api
      // POST Settings
      .post<{ webId: string; syncSequence: number }>('/list/item/create', {
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

  return syncedNotes
}

export const createListItem = async (
  note: NoteItem,
  listId: string,
): Promise<void> =>
  await api
    // POST Settings
    .post('/list/item/create', {
      listItem: {
        clientId: note.id,
        listId,
        title: note.primary,
        body: note.secondary,
        index: 1,
      },
    })

export const updateListItem = async (
  listId: string,
  note: NoteItem,
  index: number,
): Promise<void> =>
  await api
    // POST Settings
    .put('/list/item', {
      listItem: {
        clientId: note.id,
        listId,
        title: note.primary,
        body: note.secondary,
        index,
      },
    })

export const deleteList = async (): Promise<void> => {
  const {
    settings: { webId },
  } = useAppStore.getState()

  if (!webId) return

  return await api.delete(`/list/${webId}`)
}
