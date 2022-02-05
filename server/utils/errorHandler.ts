import { Response, NextFunction } from 'express'
import { MysqlError } from 'mysql'

import { apiError } from './logger.js'

export const apiResponseMessages = {
  success: 'THE API IS NOT A ☕ POT',
  failure: 'THE API IS A ☕ POT',
}

export const handleFailure = (err: MysqlError, res: Response, next: NextFunction) => {
  apiError(JSON.stringify(err))
  res.status(err.code === 'ECONNREFUSED' ? 503 : 500).send(apiResponseMessages.failure)
  next(err)
}
