import mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()
const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST } = process.env

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: Number(DB_PORT),
  multipleStatements: true,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getConnection = function (cb: (...args: any) => void) {
  pool.getConnection(function (err, connection) {
    //if(err) throw err;
    //pass the error to the cb instead of throwing it
    if (err) return cb(err)

    cb(null, connection)
  })
}
