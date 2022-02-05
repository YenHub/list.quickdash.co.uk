import express, { Response } from 'express'
const router = express.Router()

/* GET users listing. */
router.get('/', (_req, res: Response, _next) => res.send('respond with a resource'))

export { router }
