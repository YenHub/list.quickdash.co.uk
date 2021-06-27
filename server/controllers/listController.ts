import { Response, Request, NextFunction } from 'express';
import { List } from '../models/listModel';
import { handleFailure } from '../utils/errorHandler';
import lorem from '../utils/loremIpsum';

enum ResMsgs {
    NotFound = 'No list found using the ID provided',
    Created = 'List Created',
    Updated = 'List Updated',
    Deleted = 'List Deleted',
    Forbidden = 'Forbidden',
}

// CREATE
export const createList = (req: Request, res: Response, next: NextFunction) => {
    List.create({ list: req.body.list })
        .then(list => res.status(201).json(list))
        .catch(err => handleFailure(err, res, next));
};

export const createRandom = (_req: Request, res: Response, next: NextFunction) => {
    let listItems = new Array(10).fill({});
    listItems = listItems.map(() => {
        const newList = [];
        for (let i = 0, n = 5; i < n; i++) {
            newList.push(lorem.generateSentences(3));
        }

        return { list: newList };
    });
    List.bulkCreate(listItems)
        .then(() => res.status(201).send(ResMsgs.Created))
        .catch(err => handleFailure(err, res, next));
};

// READ
export const get = (req: Request, res: Response, next: NextFunction) => {
    List.findByPk(req.params.id)
        .then(list => list ? res.status(201).json(list) : res.status(404).send(ResMsgs.NotFound))
        .catch(err => handleFailure(err, res, next));
};

export const getAll = (_req: Request, res: Response, next: NextFunction) => {
    List.findAll()
        .then(list => res.status(201).json(list))
        .catch(err => handleFailure(err, res, next));
};

// UPDATE
export const updateList = (req: Request, res: Response, next: NextFunction) => {
    List.update({list: req.body}, {where: {id: req.params.id}})
        .then(rs => {
            if (rs[0] === 0) {
                return res.status(404).send(ResMsgs.NotFound);
            }
            res.status(201).send(ResMsgs.Updated);
        })
        .catch(err => handleFailure(err, res, next));
};

// DELETE
export const deleteList = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Need some sort of public token associated with lists
    // Check the token here to ensure the author using the list
    // There will be a toggle in the front end that turns ON list sharing, not the other way around
    // Lists can then be made private again if the user toggles that setting, thus triggering it to delete here too
    List.destroy({
        where: { id: req.params.id },
    })
        .then( () => { res.status(201).send(ResMsgs.Deleted); })
        .catch(err => handleFailure(err, res, next));
};

export const deleteAll = (_req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).send(ResMsgs.Forbidden);
    }
    List.destroy({
        where: {},
        truncate: true,
    })
        .then(notes => res.status(201).json(notes))
        .catch(err => handleFailure(err, res, next));
};
