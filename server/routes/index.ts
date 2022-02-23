import express, { Response } from 'express'
const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/', function (_req, res: Response, _next) {
  res.status(200)
  res.render('index', { title: 'Nothing to see here 😁' })
})
export { router }
