import { Sequelize } from 'sequelize';
import { Log, MessageSources } from '../utils/logger';
require('dotenv').config(); // load everything from `.env` file into the `process.env` variable

const log = Log(MessageSources.DBClient);

const {
    DB_PORT = '3306',
    DB_USERNAME = 'DBUser',
    DB_PASSWORD = 'DBPass',
    DB_DATABASE = 'testDB',
    DB_HOST = 'localhost',
} = process.env;

const sequelize = new Sequelize({
    database: DB_DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: 'mysql',
    host: DB_HOST,
    port: Number(DB_PORT),
});

sequelize.authenticate().then( () => {
    log('Authentication Succeeded');
});

export default sequelize;