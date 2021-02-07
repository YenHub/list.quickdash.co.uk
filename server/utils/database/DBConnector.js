const mysql = require('mysql');
require('dotenv').config(); // load everything from `.env` file into the `process.env` variable
const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST } = process.env;

const pool  = mysql.createPool({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    multipleStatements: true
});

const getConnection = function (cb) {
    pool.getConnection(function (err, connection) {
        //if(err) throw err;
        //pass the error to the cb instead of throwing it
        if(err) {
          return cb(err);
        }
        cb(null, connection);
    });
};

module.exports = pool;