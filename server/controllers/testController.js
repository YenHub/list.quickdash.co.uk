const DBConnector = require('../utils/database/DBConnector');
const { apiLog } = require('../utils/logger');


const success = 'THE API IS NOT A ☕ POT';
const failure = 'THE API IS A ☕ POT';

const handleFailure = (err, res) => {

    apiLog(`There has been a boo boo...`);
    apiLog(JSON.stringify(err));

    res.status(500).send(failure);

    throw err;
};

const APItestDB = process.env.DB_TEST ? process.env.DB_PREFIX + process.env.DB_TEST : 'testDB';

exports.index = (req, res, next) => {

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

exports.reset = (req, res, next) => {

    DBConnector.getConnection((err, con) => {

        if(err) {
            return handleFailure(err, res);
        }

        apiLog(`Connected to pool`);

        let sqlStatement = `USE ${APItestDB};
          UPDATE testTable SET HitCount = '0' WHERE testTable.ID = 1;
          SELECT HitCount FROM testTable WHERE ID = 1`;

        con.query(sqlStatement, function (err, result) {

            if(err) {
                return handleFailure(err, res);
            }

            apiLog(`RESET API CALLS`);

            res.status(201).send(`API Calls Reset`);

        });

        con.release();

    });

};

exports.testPayload = (req, res, next) => {
    res.status(200).json({ status: 'THE API IS NOT A TEAPOT ☕' });
};

exports.magicalSpam = (req, res, next) => {

    const randomGenerator = () => {

        var randA = (Math.random() * 10) > 1 ?  ( Math.random() * 2e4 ) :  ( Math.random() * 2e2 );
        var randB = ( Math.random() * randA );
        var randC = ( ( randA * randB ) * Math.random() );

        return parseInt(randC);
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