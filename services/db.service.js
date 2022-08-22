const mySql = require('mysql');
const config = require('../config');
const logger = require('./logger.service');

let dbConn


module.exports = {
    getDb
}


async function getDb() {
    try {
        const db = await connect()
        return db
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn

    try {
        const db = mySql.createConnection(config.sqlCred)
        db.connect((err) => {
            if (err) throw err
            console.log('Connected to DB');
        });
        dbConn = db
        return dbConn
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw new Error(err)
    }
}




