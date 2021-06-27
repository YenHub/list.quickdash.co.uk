import express from 'express';
const router = express.Router();
import {
    get,
    getAll,
    deleteAll,
    createList,
    updateList,
    deleteList,
    createRandom,
} from '../controllers/listController';

// READ
router.get('/:id', get);
router.get('/all', getAll);

// DELETE
router.delete('/:id', deleteList);
router.delete('/all', deleteAll);

// CREATE
router.post('/create', createList);
router.post('/random', createRandom);

// UPDATE
router.put('/update/:id', updateList);

export { router };
