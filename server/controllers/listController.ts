import { NextFunction, Request, Response } from 'express'
import sequelize from '../database/DBClient.js'
import {
  cleanUp,
  getListById,
  getNextSyncSequence,
  getNextVersion,
} from '../database/service.js'

import { List } from '../models/list.js'
import { ListItem } from '../models/listItem.js'
import { ResMsgs } from '../utils/constants.js'
import { handleFailure } from '../utils/errorHandler.js'
import { dtNowISO } from '../utils/index.js'

/**
 * CREATE LIST
 *
 * Returns the webId for the list & the syncSequence, which always starts at 1
 * when a new list record gets created at the DB level.
 */
export const createList = (req: Request, res: Response, next: NextFunction) => {
  const { list } = req.body
  if (!list) return res.status(404).send(ResMsgs.NotFound)
  List.create({ ...list, version: 1 })
    .then(list =>
      res
        .status(201)
        .json({ webId: list.getDataValue('id'), syncSequence: 1, version: 1 }),
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
  if (!id) return res.status(404).send(ResMsgs.NotFound)
  getListById(id)
    .then(list => {
      if (!list) return res.status(404).send(ResMsgs.NotFound)
      // We still want to return the list to allow people to restore it
      // Use the response code to indicate this being the case
      if (list.deleted) return res.status(410).json(list)

      return res.status(201).json(list)
    })
    .catch(err => handleFailure(err, res, next))
}

/**
 * UPDATE LIST
 *
 * For every write action, we should always check there has been no superseding delete action
 * if not we bump the version and write the change
 *
 * The version is used in the signal to indicate to other clients they need to update
 * This also means the same client receiving the signal will ignore it
 */
export const updateList = async (req: Request, res: Response, next: NextFunction) => {
  const { property, id } = req.params
  if (!property || !id) return res.status(404).send(ResMsgs.NotFound)
  const { value } = req.body
  /* {0: deleted, -1: not found, 1+: version} */
  const version = await getNextVersion(id)
  // Don't update the list, the client should now treat theirs as a new list
  if (version < 0) return res.status(404).send(ResMsgs.NotFound)
  if (version === 0) return res.status(410).send(ResMsgs.ListDeleted)
  // TODO: Validation
  List.update(
    {
      [property]: value,
      updatedAt: dtNowISO(),
      version,
    },
    { where: { id } },
  )
    .then(rs => {
      if (rs[0] === 0) return res.status(404).send(ResMsgs.NotFound)

      res.status(201).send({ version })
    })
    .catch(err => handleFailure(err, res, next))
}

/* DELETE LIST */
export const softDeleteList = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  if (!id) return res.status(404).send(ResMsgs.NotFound)

  console.log('HasID')

  const syncSequence = await getNextSyncSequence(id)
  if (syncSequence < 0) res.status(404).send(ResMsgs.NotFound)
  if (syncSequence === 0) res.status(410).send(ResMsgs.ListDeleted)
  console.log('hasSyncSequence')

  const version = await getNextVersion(id)
  if (version < 0) return res.status(404).send(ResMsgs.NotFound)
  if (version === 0) return res.status(410).send(ResMsgs.ListDeleted)
  console.log('hasNextVersion')

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

  console.log('destroyedItems')
  /**
   * Now with a clean slate of history we can persist what is left
   * Later this can be either cleaned up or restored by a user revisiting the list
   */
  Promise.all([
    List.update({ ...updateOptions, version }, { where: { id } }),
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
  if (!id) return res.status(404).send(ResMsgs.NotFound)

  /**
   * This oneway street is only used in the cleanup routine
   * We will clean up every 90 days a further 5 days worth of items
   * This method could later be exposed and configured through an admin panel
   */
  Promise.all([
    List.destroy({ where: { id } }),
    ListItem.destroy({ where: { listId: id } }),
  ])
    .then(() => res.status(201).send(ResMsgs.ListDeleted))
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
