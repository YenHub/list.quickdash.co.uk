import { Router } from 'express'

import {
  createList,
  deleteList,
  getList,
  updateList,
} from '../controllers/listController.js'
import {
  createListItem,
  deleteListItem,
  getListItems,
  updateListItem,
} from '../controllers/listItemController.js'

const router = Router()

/* LIST */
// CREATE
router.post('/create', createList)
// READ
router.get('/:id', getList)
// UPDATE
router.put('/:id/:property', updateList)
// DELETE
router.delete('/:id', deleteList)

/* LIST ITEM */
// CREATE ITEM
router.post('/item/create', createListItem)
// READ ALL ITEMS
router.get('/item/:listId', getListItems)
// UPDATE ITEM
router.put('/item/:id', updateListItem)
// DELETE ITEM
router.delete('/item/:id', deleteListItem)

export { router }
