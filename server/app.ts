import path from 'path'
import express from 'express'
import helmet from 'helmet'
import createError from 'http-errors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import { router as indexRouter } from './routes/index.js'
import { router as testRouter } from './routes/testAPI.js'
import { router as listRouter } from './routes/listAPI.js'

export interface HttpException extends Error {
  status: number
}

const app = express()

// view engine setup
app.set('views', path.join(path.resolve(), 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(path.resolve(), 'public')))

app.use('/', indexRouter)
app.use('/testAPI', testRouter)
app.use('/list', listRouter)

// catch 404 and forward to error handler
app.use(function (_req, _res, next: express.NextFunction) {
  next(createError(404))
})

// error handler
app.use(function (err: HttpException, req: express.Request, res: express.Response) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

export { app }
