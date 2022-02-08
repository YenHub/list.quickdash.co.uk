import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import createError from 'http-errors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'

import { router as indexRouter } from './routes/index.js'
import { router as listRouter } from './routes/listAPI.js'
import sequelize from './database/DBClient.js'

dotenv.config()

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

// sequelize.sync()
sequelize.sync({ force: false })
// if (process.env.NODE_ENV === 'production') sequelize.sync()
// else sequelize.sync({ force: true })

export { app }
