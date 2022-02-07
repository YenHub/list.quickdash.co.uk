import { NextFunction, Request, Response } from 'express'

import { ListItem } from '../models/listItem.js'
import { ResMsgs } from '../utils/constants.js'
import { handleFailure } from '../utils/errorHandler.js'
import { dtNowISO } from '../utils/index.js'

/* CREATE LIST ITEM */
export const createListItem = (req: Request, res: Response, next: NextFunction) => {
  const { listItem } = req.body
  ListItem.create(listItem)
    .then(listItem => res.status(201).json({ webId: listItem.getDataValue('id') }))
    .catch(err => handleFailure(err, res, next))
}

/* READ LIST ITEMS */
export const getListItems = (req: Request, res: Response, next: NextFunction) => {
  const { listId } = req.params
  ListItem.findAll({ where: { listId } })
    .then(listItems =>
      listItems
        ? res.status(201).json(listItems)
        : res.status(404).send(ResMsgs.NotFound),
    )
    .catch(err => handleFailure(err, res, next))
}

/* UPDATE LIST ITEM */
export const updateListItem = (req: Request, res: Response, next: NextFunction) => {
  const { payload } = req.body
  const { id } = req.params
  ListItem.update(
    {
      ...payload,
      updatedAt: dtNowISO(),
    },
    { where: { id } },
  )
    .then(rs => {
      if (rs[0] === 0) return res.status(404).send(ResMsgs.NotFound)

      res.status(201).send(ResMsgs.Updated)
    })
    .catch(err => handleFailure(err, res, next))
}

/* HARD DELETE LIST ITEM */
export const hardDeleteListItem = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  ListItem.destroy({
    where: { id },
  })
    .then(() => {
      res.status(201).send(ResMsgs.Deleted)
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
