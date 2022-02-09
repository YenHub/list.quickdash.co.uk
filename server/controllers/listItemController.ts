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
  const { listId } = listItem
  if (!listId) return res.status(404).send(ResMsgs.NotFound)

  const syncSequence = await getNextSyncSequence(listId)
  if (syncSequence < 0) return res.status(404).send(ResMsgs.NotFound)
  if (syncSequence === 0) return res.status(410).send(ResMsgs.Deleted)

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
  if (deleted) {
    if (canRecover) return res.status(410).send(ResMsgs.Deleted)

    return res.status(404).send(ResMsgs.NotFound)
  }
  /**
   * We only soft delete note items. The later plan is to open up list item history.
   *
   * There is a clean-up routine to handle stale items after 3 months of inactivity.
   */
  ListItem.findAll({ where: { listId, deleted: false } })
    .then(listItems =>
      listItems
        ? res.status(201).json(listItems)
        : res.status(404).send(ResMsgs.NotFound),
    )
    .catch(err => handleFailure(err, res, next))
}

/* READ LIST ITEMS */
export const getListItem = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.body
  ListItem.findByPk(id)
    .then(listItem =>
      listItem ? res.status(201).json(listItem) : res.status(404).send(ResMsgs.NotFound),
    )
    .catch(err => handleFailure(err, res, next))
}

/* UPDATE LIST ITEM */
export const updateListItem = async (req: Request, res: Response, next: NextFunction) => {
  const { listItem } = req.body
  const { listId, id } = listItem
  if (!listId) return res.status(404).send(ResMsgs.NotFound)

  const syncSequence = await getNextSyncSequence(listId)
  if (syncSequence < 0) return res.status(404).send(ResMsgs.NotFound)

  ListItem.update(
    {
      ...listItem,
      updatedAt: dtNowISO(),
      syncSequence,
    },
    { where: { id } },
  )
    .then(rs => {
      if (rs[0] === 0) return res.status(404).send(ResMsgs.NotFound)
      updateListSyncSequence(listId, syncSequence).then(() =>
        res.status(201).json({ syncSequence }),
      )
    })
    .catch(err => handleFailure(err, res, next))
}

/* HARD DELETE LIST ITEM */
export const softDeleteListItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id, listId } = req.params
  const syncSequence = await getNextSyncSequence(listId)
  if (syncSequence < 0) return res.status(404).send(ResMsgs.NotFound)

  ListItem.update(
    {
      deleted: true,
      updatedAt: dtNowISO(),
      syncSequence,
    },
    {
      where: { id },
    },
  )
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
