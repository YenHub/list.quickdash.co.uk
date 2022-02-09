import { NextFunction, Request, Response } from 'express'
import sequelize from '../database/DBClient.js'

import { List } from '../models/list.js'
import { ListItem } from '../models/listItem.js'
import { ResMsgs } from '../utils/constants.js'
import { handleFailure } from '../utils/errorHandler.js'
import { dtNowISO, getCleanupQueryObject } from '../utils/index.js'

/**
 * CREATE LIST
 *
 * Returns the webId for the list & the syncSequence, which always starts at 1
 * when a new list record gets created at the DB level.
 */
export const createList = (req: Request, res: Response, next: NextFunction) => {
  const { list } = req.body
  List.create(list)
    .then(list =>
      res.status(201).json({ webId: list.getDataValue('id'), syncSequence: 1 }),
    )
    .catch(err => handleFailure(err, res, next))
}

/**
 * READ LIST
 *
 * Returns the top level list item, which contains various settings,
 * but most importantly the syncSequence we use to efficiently sync ListItems
 *
 * A List can be soft deleted, meaning, someone pulled the cord to delete the list.
 * We give the ability to recover if we find a list in this state, otherwise, it's a genuine 404
 */
export const getList = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  List.findByPk(id)
    .then(list => {
      // IGDev: Handle list.deleted -vs- list absent (e.g. perma-deleted)
      if (!list) return res.status(404).send(ResMsgs.NotFound)

      // IGDev: WE ARE HERE
      if (list.deleted) console.log('List Deleted')

      return res.status(201).json(list)
    })
    .catch(err => handleFailure(err, res, next))
}

/* UPDATE LIST */
export const updateList = async (req: Request, res: Response, next: NextFunction) => {
  const { property, id } = req.params
  const { value } = req.body
  const syncSequence = await getNextSyncSequence(id)
  if (syncSequence < 0) return res.status(404).send(ResMsgs.NotFound)
  List.update(
    {
      [property]: value,
      updatedAt: dtNowISO(),
      syncSequence,
    },
    { where: { id, deleted: false } },
  )
    .then(rs => {
      // IGDev: Handle list.deleted -vs- list absent (e.g. perma-deleted)
      // Probably client side for updating a list,
      // e.g. try to update, you're offered to clone the list and merge in diff
      // Any local changes outside content are dropped
      if (rs[0] === 0) return res.status(404).send(ResMsgs.NotFound)

      res.status(201).send({ syncSequence })
    })
    .catch(err => handleFailure(err, res, next))
}

/* DELETE LIST */
export const softDeleteList = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const syncSequence = await getNextSyncSequence(id)
  if (syncSequence < 0) res.status(404).send(ResMsgs.NotFound)
  const updateOptions = {
    deleted: true,
    updatedAt: dtNowISO(),
    syncSequence,
  }
  /**
   * TODO: We're destroying existing history for simplicity on delete here
   * The benefit is we can easily restore an accurate representation of the last list state
   * In todays world, it makes no odds since these would have been inaccessible anyway
   * Later when we implement proper history we can rethink this design decision
   */
  await ListItem.destroy({ where: { listId: id, deleted: true } })
  /**
   * Now with a clean slate of history we can persist what is left
   * Later this can be either cleaned up or restored by a user revisiting the list
   */
  Promise.all([
    List.update(updateOptions, { where: { id } }),
    ListItem.update(updateOptions, { where: { listId: id } }),
  ])
    /**
     * We will still send back the syncSequence for consistency
     * It is possible to restore the list either from a link parameter,
     * or more efficiently; through the syncSequence.
     */
    .then(() => res.status(201).send({ syncSequence }))
    .then(cleanUp)
    .catch(err => handleFailure(err, res, next))
}

/* HARD DELETE LIST */
export const hardDeleteList = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  /**
   * This oneway street is only used in the cleanup routine
   * We will clean up every 90 days a further 5 days worth of items
   * This method could later be exposed and configured through an admin panel
   */
  Promise.all([
    List.destroy({ where: { id } }),
    ListItem.destroy({ where: { listId: id } }),
  ])
    .then(() => res.status(201).send(ResMsgs.Deleted))
    .catch(err => handleFailure(err, res, next))
}

/**
 * HACK: This is a local development hack to wipe & reboot the database
 * Simply call its endpoint
 */
export const resetDb = (_req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'development') {
    sequelize.sync({ force: true })

    return res.status(201).send(ResMsgs.DbReset)
  }
  res.status(404).send(ResMsgs.NotFound)
}

/* UTILS */

/**
 * Clean up any deleted lists & list items
 * The idea here being we will periodically over-time maintain the size of the database
 *
 * // TODO: We might want to throttle or similar here if performance becomes an question
 */
const cleanUp = () => {
  const deleteOptions = getCleanupQueryObject()
  Promise.all([
    List.destroy({ where: deleteOptions }),
    ListItem.destroy({ where: deleteOptions }),
  ])
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

const getListById = async (listId: string) => await List.findByPk(listId)

/**
 * The parent list always points to the greatest syncSequence
 * Every new operation bumps the sync sequence for that record
 * This allows for simple client side sync basing on the current syncSequence
 */
export const getNextSyncSequence = async (listId: string) => {
  const list = await getListById(listId)
  if (!list) return -1

  return list.syncSequence + 1
}

export const getListStatus = async (
  listId: string,
): Promise<{ deleted: boolean; canRecover: boolean }> => {
  const list = await getListById(listId)
  if (!list) return { deleted: true, canRecover: false }

  return { deleted: list.deleted, canRecover: true }
}
