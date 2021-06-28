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
router.get('/all', getAll);
router.get('/:id', get);

// DELETE
router.delete('/all', deleteAll);
router.delete('/:id', deleteList);

// CREATE
router.post('/create', createList);
router.post('/random', createRandom);

// UPDATE
router.put('/update/:id', updateList);

export { router };
