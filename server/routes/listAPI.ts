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

router.post('/', get);
router.get('/all', getAll);
router.delete('/', deleteList);
router.delete('/all', deleteAll);
router.post('/create', createList);
router.put('/update', updateList);
router.post('/random', createRandom);

export { router };
