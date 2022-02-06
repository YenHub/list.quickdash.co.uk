import { NextFunction, Request, Response } from 'express'
import { DateTime } from 'luxon'

import { List } from '../models/list.js'
import { ListItem } from '../models/listItem.js'
import { handleFailure } from '../utils/errorHandler.js'
import lorem from '../utils/loremIpsum.js'

enum ResMsgs {
  NotFound = 'No list found using the ID provided',
  Created = 'List Created',
  Updated = 'List Updated',
  Deleted = 'List Deleted',
  Forbidden = 'Forbidden',
}

const dt = () => new DateTime()
const dateTimeNow = () => dt().toISO()

/* CREATE LIST */
export const createList = (req: Request, res: Response, next: NextFunction) => {
  let webId
  List.create({
    ...req.body,
    createdAt: dateTimeNow(),
  })
    .then(list => {
      webId = list.getDataValue('id')

      return res.status(201).json({ webId })
    })
    .catch(err => handleFailure(err, res, next))
}

/* CREATE LIST ITEM */
export const createListItem = (req: Request, res: Response, next: NextFunction) => {
  let webId
  ListItem.create({ ...req.body })
    .then(listItem => {
      webId = listItem.getDataValue('id')

      return res.status(201).json({ webId })
    })
    .catch(err => handleFailure(err, res, next))
}

/* READ LIST */
export const getList = (req: Request, res: Response, next: NextFunction) => {
  List.findByPk(req.params.id)
    .then(list =>
      list ? res.status(201).json(list) : res.status(404).send(ResMsgs.NotFound),
    )
    .catch(err => handleFailure(err, res, next))
}

/* UPDATE LIST */
export const updateList = (req: Request, res: Response, next: NextFunction) => {
  List.update(
    {
      [req.params.property]: req.body.payload,
      updatedAt: dateTimeNow(),
    },
    { where: { id: req.params.id } },
  )
    .then(rs => {
      if (rs[0] === 0) return res.status(404).send(ResMsgs.NotFound)

      res.status(201).send(ResMsgs.Updated)
    })
    .catch(err => handleFailure(err, res, next))
}

/* CREATE LIST ITEM */
export const updateListItem = (req: Request, res: Response, next: NextFunction) => {
  ListItem.update(
    {
      ...req.body.payload,
      updatedAt: dateTimeNow(),
    },
    { where: { id: req.params.id } },
  )
    .then(rs => {
      if (rs[0] === 0) return res.status(404).send(ResMsgs.NotFound)

      res.status(201).send(ResMsgs.Updated)
    })
    .catch(err => handleFailure(err, res, next))
}

/* DELETE LIST */
export const deleteList = (req: Request, res: Response, next: NextFunction) => {
  List.update(
    {
      deleted: true,
      updatedAt: dateTimeNow(),
    },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.status(201).send(ResMsgs.Deleted)
    })
    .catch(err => handleFailure(err, res, next))
}

export const hardDeleteList = (req: Request, res: Response, next: NextFunction) => {
  destroyList(req.params.id)
    .then(() => {
      res.status(201).send(ResMsgs.Deleted)
    })
    .catch(err => handleFailure(err, res, next))
}

const destroyList = (id: string) =>
  List.destroy({
    where: { id },
  })

/* LEGACY CONTROLLERS */
export const createRandom = (_req: Request, res: Response, next: NextFunction) => {
  let listItems = new Array(10).fill({})
  listItems = listItems.map(() => {
    const newList = []
    for (let i = 0, n = 5; i < n; i++) newList.push(lorem.generateSentences(3))

    return { list: newList }
  })
  List.bulkCreate(listItems)
    .then(() => res.status(201).send(ResMsgs.Created))
    .catch(err => handleFailure(err, res, next))
}

// TODO: Remove for prod
export const getAll = (_req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).send(ResMsgs.Forbidden)
  }
  List.findAll()
    .then(list => res.status(201).json(list))
    .catch(err => handleFailure(err, res, next))
}

// TODO: Remove for prod
export const deleteAll = (_req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).send(ResMsgs.Forbidden)
  }
  List.destroy({
    where: {},
    truncate: true,
  })
    .then(notes => res.status(201).json(notes))
    .catch(err => handleFailure(err, res, next))
}

export const cleanUp = (_req: Request, res: Response, next: NextFunction) => {
  const endDate = dt().minus({ months: 3 }).toISO()
  const startDate = dt().minus({ months: 6 }).toISO()
  List.destroy({
    truncate: true,
    where: {
      deleted: true,
      updatedAt: {
        $between: [startDate, endDate],
      },
    },
  })
    .then(notes => res.status(201).json(notes))
    .catch(err => handleFailure(err, res, next))
}
