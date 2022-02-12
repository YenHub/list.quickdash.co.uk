import { NextFunction, Request, Response } from 'express'

import { ListItem } from '../models/listItem.js'
import { ResMsgs } from '../utils/constants.js'
import { dtNowISO } from '../utils/index.js'
import { handleFailure } from '../utils/errorHandler.js'
import {
  getListStatus,
  getNextSyncSequence,
  updateListSyncSequence,
} from './listController.js'

/* CREATE LIST ITEM */
export const createListItem = async (req: Request, res: Response, next: NextFunction) => {
  const { listItem } = req.body
  if (!listItem) return res.status(404).send(ResMsgs.NotFound)

  const { listId } = listItem
  if (!listId) return res.status(404).send(ResMsgs.NotFound)

  const syncSequence = await getNextSyncSequence(listId)
  if (syncSequence <= 0) return res.status(404).send(ResMsgs.NotFound)

  ListItem.create({ ...listItem, syncSequence })
    .then(({ listId, id, syncSequence }) =>
      updateListSyncSequence(listId, syncSequence).then(() =>
        res.status(201).json({ webId: id, syncSequence }),
      ),
    )
    .catch(err => handleFailure(err, res, next))
}

/* READ LIST ITEMS */
export const getListItems = async (req: Request, res: Response, next: NextFunction) => {
  const { listId } = req.params
  if (!listId) return res.status(404).send(ResMsgs.NotFound)
  const listStatus = await getListStatus(listId)
  const { canRecover, deleted } = listStatus
  // IGDev: We can revisit this later when we look at enabling history
  if (deleted && !canRecover) return res.status(404).send(ResMsgs.NotFound)

  /**
   * We only soft delete note items. The later plan is to open up list item history.
   *
   * There is a clean-up routine to handle stale items after 3 months of inactivity.
   */
  ListItem.findAll({ where: { listId, deleted: false } })
    .then(listItems =>
      listItems
        ? res.status(deleted ? 410 : 201).json(listItems) // IGDev: We could enable note history here later
        : res.status(404).send(ResMsgs.NotFound),
    )
    .catch(err => handleFailure(err, res, next))
}

/* READ LIST ITEMS */
export const getListItem = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body
  if (!id) return res.status(404).send(ResMsgs.NotFound)
  ListItem.findByPk(id)
    .then(listItem => {
      // IGDev: We could enable note history here later
      // The idea is we only want to support fetching when someone is trying to restore a whole
      // list, e.g. with only the URL, therefore, don't have a copy on the client
      if (!listItem || listItem.deleted) return res.status(404).send(ResMsgs.NotFound)

      return res.status(201).json(listItem)
    })
    .catch(err => handleFailure(err, res, next))
}

/* UPDATE LIST ITEM */
export const updateListItem = async (req: Request, res: Response, next: NextFunction) => {
  const { listItem } = req.body
  if (!listItem) return res.status(404).send(ResMsgs.NotFound)
  const { listId, id } = listItem
  if (!listId) return res.status(404).send(ResMsgs.NotFound)

  const listStatus = await getListStatus(listId)
  const { deleted, canRecover } = listStatus
  // IGDev: We can revisit this later when we look at enabling history
  if (deleted && !canRecover) return res.status(404).send(ResMsgs.NotFound)
  if (deleted) return res.status(410).send(ResMsgs.ListDeleted)

  const item = await ListItem.findByPk(id)
  if (!item || item.deleted) return res.status(410).send(ResMsgs.ItemDeleted)

  const syncSequence = await getNextSyncSequence(listId)

  item
    .update({
      ...listItem,
      updatedAt: dtNowISO(),
      syncSequence,
    })
    .then(() => {
      updateListSyncSequence(listId, syncSequence).then(() =>
        res.status(201).json({ syncSequence }),
      )
    })
    .catch(err => handleFailure(err, res, next))
}

/* DELETE LIST ITEM */
export const softDeleteListItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id, listId } = req.params
  if (!id || !listId) return res.status(404).send(ResMsgs.NotFound)

  const listStatus = await getListStatus(listId)
  const { deleted, canRecover } = listStatus
  // IGDev: We can revisit this later when we look at enabling history
  if (deleted && !canRecover) return res.status(404).send(ResMsgs.NotFound)
  if (deleted) return res.status(410).send(ResMsgs.ListDeleted)

  const item = await ListItem.findByPk(id)
  if (!item) return res.status(404).send(ResMsgs.NotFound)
  if (item.deleted) return res.status(410).send(ResMsgs.ItemDeleted)

  const syncSequence = await getNextSyncSequence(listId)

  item
    .update({
      deleted: true,
      updatedAt: dtNowISO(),
      syncSequence,
    })
    .then(() => {
      updateListSyncSequence(listId, syncSequence).then(() =>
        res.status(201).json({ syncSequence }),
      )
    })
    .catch(err => handleFailure(err, res, next))
}

// /* SOFT DELETE LIST ITEM */
// export const deleteListItem = (req: Request, res: Response, next: NextFunction) => {
//   const { id } = req.params
//   ListItem.update(
//     {
//       deleted: true,
//       updatedAt: dtNowISO(),
//     },
//     { where: { id } },
//   )
//     .then(() => {
//       res.status(201).send(ResMsgs.Deleted)
//     })
//     .catch(err => handleFailure(err, res, next))
// }
