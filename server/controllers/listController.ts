import { NextFunction, Request, Response } from 'express'
import { DateTime } from 'luxon'

import { List } from '../models/list.js'
import { ListItem } from '../models/listItem.js'
import { ResMsgs } from '../utils/constants.js'
import { handleFailure } from '../utils/errorHandler.js'
import { dtNowISO } from '../utils/index.js'

/* CREATE LIST */
export const createList = (req: Request, res: Response, next: NextFunction) => {
  const { list } = req.body
  List.create(list)
    .then(list => res.status(201).json({ webId: list.getDataValue('id') }))
    .catch(err => handleFailure(err, res, next))
}

/* READ LIST */
export const getList = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  List.findByPk(id)
    .then(list => {
      if (!list || list.deleted) return res.status(404).send(ResMsgs.NotFound)

      return res.status(201).json(list)
    })
    .catch(err => handleFailure(err, res, next))
}

/* UPDATE LIST */
export const updateList = (req: Request, res: Response, next: NextFunction) => {
  const { property, id } = req.params
  const { value } = req.body
  List.update(
    {
      [property]: value,
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

/* DELETE LIST */
export const softDeleteList = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const updateOptions = {
    deleted: true,
    updatedAt: dtNowISO(),
  }
  Promise.all([
    List.update(updateOptions, { where: { id } }),
    ListItem.update(updateOptions, { where: { listId: id } }),
  ])
    .then(() => res.status(201).send(ResMsgs.Deleted))
    .then(cleanUp)
    .catch(err => handleFailure(err, res, next))
}

/* HARD DELETE LIST */
export const hardDeleteList = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params

  Promise.all([
    List.destroy({ where: { id } }),
    ListItem.destroy({ where: { listId: id } }),
  ])
    .then(() => res.status(201).send(ResMsgs.Deleted))
    .catch(err => handleFailure(err, res, next))
}

/* Clean up any deleted lists  */
const cleanUp = () => {
  const now = DateTime.now()
  const startDate = now.minus({ weeks: 13 }).toISO()
  const endDate = now.minus({ weeks: 12 }).toISO()
  const deleteOptions = {
    deleted: true,
    updatedAt: {
      $between: [startDate, endDate],
    },
  }
  Promise.all([
    List.destroy({ where: deleteOptions }),
    ListItem.destroy({ where: deleteOptions }),
  ])
}
