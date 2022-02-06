import express from 'express'
import {
  cleanUp,
  createList,
  createListItem,
  createRandom,
  deleteAll,
  deleteList,
  getAll,
  getList,
  updateList,
} from '../controllers/listController.js'

const router = express.Router()

// READ
router.get('/:id', getList)
router.get('/all', getAll) // IGDev: No prod

// DELETE
router.delete('/:id', deleteList)
router.delete('/clean-up', cleanUp)
router.delete('/all', deleteAll) // IGDev: No prod

// CREATE
router.post('/create', createList)
router.post('/create-item', createListItem)
router.post('/random', createRandom) // IGDev: No prod

// UPDATE
router.put('/:id/:property', updateList)

export { router }
