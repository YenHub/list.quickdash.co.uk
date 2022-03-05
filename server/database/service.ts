import { List } from '../models/list.js'
import { ListItem, NoteWithIndex } from '../models/listItem.js'
import { dtNowISO, getCleanupQueryObject } from '../utils/index.js'

export const createListItem = async ({
  noteItem,
  listId,
}: {
  noteItem: NoteWithIndex
  listId: string
}): Promise<ListItem> => {
  const now = new Date().toISOString()
  const syncSequence = await getNextSyncSequence(listId)
  const { id: clientId, index, primary: title, secondary: body } = noteItem

  return await ListItem.create({
    index,
    clientId,
    title,
    body,
    updatedAt: now,
    syncSequence,
    listId,
  })
}

export const updateListItem = async ({
  noteItem,
  listId,
}: {
  noteItem: NoteWithIndex
  listId: string
}): Promise<ListItem | string> => {
  const listStatus = await getListStatus(listId)
  const { deleted, canRecover } = listStatus
  // IGDev: We can revisit this later when we look at enabling history
  if (deleted && !canRecover) return 'list-deleted'

  // IGDev: If the item is deleted, we will ask the client to delete it
  const item = await ListItem.findByPk(noteItem.webId)
  if (!item || item.deleted) return 'item-deleted'

  if (item.syncSequence !== noteItem.syncSequence) return 'update-conflict'

  const syncSequence = await getNextSyncSequence(listId)

  return item
    .update({
      id: noteItem.webId,
      title: noteItem.primary,
      body: noteItem.secondary,
      updatedAt: dtNowISO(),
      syncSequence,
    })
    .then(res => updateListSyncSequence(res.listId, res.syncSequence).then(() => res))
}

export const getListById = (id: string): Promise<List | null> => List.findByPk(id)

/**
 * Clean up any deleted lists & list items
 * The idea here being we will periodically over-time maintain the size of the database
 *
 * // TODO: We might want to throttle or similar here if performance becomes an question
 * We are indexing basing on these options though..
 */
export const cleanUp = () => {
  const deleteOptions = getCleanupQueryObject()
  /* ListItems are destroyed first due to the relationship between ListItems <> List */
  ListItem.destroy({ where: deleteOptions }).then(() =>
    List.destroy({ where: deleteOptions }),
  )
}

/**
 * Every write operation should trigger a refresh on all clients
 * We will achieve this through websockets and use signals to trigger syncs
 * Having a single source of truth for the sync sequence means we can compare
 * compare only a single value, which is the signal from the websocket itself
 * with the value stored in the client
 */
export const updateListSyncSequence = async (listId: string, syncSequence: number) =>
  await List.update({ syncSequence }, { where: { id: listId } })

/**
 * The parent list always points to the greatest syncSequence
 * Every new operation bumps the sync sequence for that record
 * This allows for simple client side sync basing on the current syncSequence
 *
 * If no list is found we simply return -1 to indicate the absence of the resource
 * If the list has been deleted, we will signal this with a 0
 */
export const getNextSyncSequence = async (listId: string) => {
  const list = await getListById(listId)
  if (!list) return -1
  if (list.deleted) return 0

  return list.syncSequence + 1
}

/**
 * The list carries its own version number, in effect a sync sequence
 *
 * The client listens out on websockets for the UpdateSettings signal,
 * comparing the payload with this version
 *
 * If no list is found we simply return -1 to indicate the absence of the resource
 * If the list has been deleted, we will signal this with a 0
 * */
export const getNextVersion = async (listId: string) => {
  const list = await getListById(listId)
  if (!list) return -1
  if (list.deleted) return 0

  return list.version + 1
}

export const getListStatus = async (
  listId: string,
): Promise<{ deleted: boolean; canRecover: boolean }> => {
  const list = await getListById(listId)
  if (!list) return { deleted: true, canRecover: false }

  return { deleted: list.deleted, canRecover: true }
}
