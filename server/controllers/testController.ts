import { Response, Request, NextFunction } from 'express';
import { pool as DBConnector } from '../utils/database/DBConnector';
import { apiLog } from '../utils/logger';
import { HttpException } from '../app';
import { MysqlError } from 'mysql';

const messages = {
    success: 'THE API IS NOT A ☕ POT',
    failure: 'THE API IS A ☕ POT',
}

const handleFailure = (err: HttpException | MysqlError, res: Response) => {

    apiLog(`There has been a boo boo...`);
    apiLog(JSON.stringify(err));

    res.status(500).send(messages.failure);

    throw err;
};

const APItestDB = process.env.NODE_ENV === 'production' ? process.env.DB_PREFIX ?? '' + process.env.DB_TEST : process.env.DB_TEST;

export const index = (_req: Request, res: Response, _next: NextFunction) => {

    DBConnector.getConnection((err, con) => {

        if(err) {
            return handleFailure(err, res);
        }

        apiLog(`Connected to pool`);

        let sqlStatement = `CREATE DATABASE IF NOT EXISTS ${APItestDB};
          USE ${APItestDB};
          CREATE TABLE IF NOT EXISTS testTable(
              ID int NOT NULL AUTO_INCREMENT,
              HitCount int,
              PRIMARY KEY (ID)
          );
          INSERT IGNORE INTO testTable SET ID = 1, HitCount = 1;
          UPDATE testTable SET HitCount = HitCount + 1 WHERE ID = 1;
          SELECT HitCount FROM testTable WHERE ID = 1`;

        con.query(sqlStatement, function (err, result) {

            if(err) {
                return handleFailure(err, res);
            }

            apiLog(`CREATED API CALL`);
            apiLog(`Total Successful Test API Calls: ${result.slice(-1)[0][0].HitCount} 🎉`);

            res.status(201).send(`${result.slice(-1)[0][0].HitCount.toString()} Successful API Calls`);

        });

        con.release();

    });

};

export const reset = (_req: Request, res: Response, _next: NextFunction) => {

    DBConnector.getConnection((err, con) => {

        if(err) {
            return handleFailure(err, res);
        }

        apiLog(`Connected to pool`);

        let sqlStatement = `USE ${APItestDB};
          UPDATE testTable SET HitCount = '0' WHERE testTable.ID = 1;
          SELECT HitCount FROM testTable WHERE ID = 1`;

        con.query(sqlStatement, function (err, _result) {

            if(err) {
                return handleFailure(err, res);
            }

            apiLog(`RESET API CALLS`);

            res.status(201).send(`API Calls Reset`);

        });

        con.release();

    });

};

export const testPayload = (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({ status: 'THE API IS NOT A TEAPOT ☕' });
};

export const magicalSpam = (_req: Request, res: Response, _next: NextFunction) => {

    const randomGenerator = () => {

        var randA = (Math.random() * 10) > 1 ?  ( Math.random() * 2e4 ) :  ( Math.random() * 2e2 );
        var randB = ( Math.random() * randA );
        var randC = ( ( randA * randB ) * Math.random() );

        return Number(randC);
    };

    DBConnector.getConnection((err, con) => {

        if(err) {
            return handleFailure(err, res);
        }

        apiLog(`Connected to pool`);

        let sqlStatement = `CREATE DATABASE IF NOT EXISTS ${APItestDB};
          USE ${APItestDB};
          CREATE TABLE IF NOT EXISTS testTable(
              ID int NOT NULL AUTO_INCREMENT,
              HitCount int,
              PRIMARY KEY (ID)
          );
          INSERT IGNORE INTO testTable SET ID = 1, HitCount = 1;
          UPDATE testTable SET HitCount = ${randomGenerator()};
          SELECT HitCount FROM testTable WHERE ID = 1`;

        con.query(sqlStatement, function (err, result) {

            if(err) {
                return handleFailure(err, res);
            }

            apiLog(`CREATED MAGICAL RANDOM NUMBER OF CALLS 😝`);
            apiLog(`Total Successful Test API Calls: ${result.slice(-1)[0][0].HitCount} 🎉`);

            res.status(201).send(`${result.slice(-1)[0][0].HitCount.toString()} Successful API Calls`);

        });

        con.release();

    });

};