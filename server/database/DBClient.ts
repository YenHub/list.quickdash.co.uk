import { Sequelize } from 'sequelize'

import dotenv from 'dotenv'
import { Err, Log, MessageSources } from '../utils/logger.js'

dotenv.config()

const log = Log(MessageSources.DBClient)
const error = Err(MessageSources.DBClient)

const { DB_PORT, DB_SERVICE_USER, DB_SERVICE_USER_PASSWORD, DB_DATABASE, DB_HOST } =
  process.env

const sequelize = new Sequelize({
  database: DB_DATABASE,
  username: DB_SERVICE_USER,
  password: DB_SERVICE_USER_PASSWORD,
  dialect: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
})

sequelize
  .authenticate()
  .then(() => {
    log('Connection Succeeded')
  })
  .catch(err => {
    error('Connection Failed')
    error(err)
  })

export default sequelize
