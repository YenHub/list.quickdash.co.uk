import express from 'express'

import { index, reset, testPayload, magicalSpam } from '../controllers/testController.js'

const router = express.Router()

router.get('/', index)
router.get('/payload', testPayload)
router.get('/magicalSpam', magicalSpam)
router.get('/reset', reset)

export { router }
