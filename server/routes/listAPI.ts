import { Router } from 'express'

import {
  createList,
  getList,
  hardDeleteList,
  resetDb,
  softDeleteList,
  updateList,
} from '../controllers/listController.js'
import {
  createListItem,
  getListItem,
  getListItems,
  softDeleteListItem,
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
router.delete('/:id', softDeleteList)
// DEV
router.post('/reset', resetDb)

/* LIST ITEM */
// CREATE ITEM
router.post('/item/create', createListItem)
// READ ITEM
router.get('/item/by_id/:id', getListItem)
// READ ALL ITEMS
router.get('/item/all/:listId', getListItems)
// UPDATE ITEM
router.put('/item', updateListItem)
// DELETE ITEM
router.delete('/item/:id/:listId', softDeleteListItem)

export { router }
