const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')

module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const queryTxt = 'SELECT * FROM user'
    try {
        const db = await dbService.getDb()
        return new Promise((resolve, reject) => {
            logger.info('getting users')
            db.query(queryTxt, (err, result, fields) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    const queryTxt = `SELECT * FROM user WHERE _id='${userId}'`
    try {
        const db = await dbService.getDb()
        return new Promise((resolve, reject) => {
            db.query(queryTxt, (err, res, fields) => {
                if (err) reject(err)
                const userFull = { ...res[0] }
                resolve(userFull)
            })
        })
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByUsername(username) {
    const queryTxt = `SELECT * FROM user WHERE username="${username}"`
    try {
        const db = await dbService.getDb()
        return new Promise((resolve, reject) => {
            logger.info('getting user')
            db.query(queryTxt, (err, res, fields) => {
                if (err) reject(err)
                resolve({ ...res[0] })
            })
        })
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    const queryTxt = `DELETE * FROM user WHERE _id=${userId}`
    try {
        const db = await dbService.getDb()
        return new Promise((resolve, reject) => {
            logger.info('removing user')
            db.query(queryTxt, (err, res, fields) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user, fields) {
    // peek only updatable fields!
    const queryTxt = `UPDATE user SET ${fields} WHERE _id="${user._id}"`
    try {
        const db = await dbService.getDb()
        return new Promise((resolve, reject) => {
            logger.info('updating user')
            db.query(queryTxt, (err, res, fields) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {

    const queryTxt = `INSERT INTO user (username, password) VALUES (${user.username, user.password})`
    try {
        return new Promise((resolve, reject) => {
            const db = dbService.getDb()
            db.query(queryTxt, ((err, res, fields)=>{
                if(err) reject(err)
                resolve(res)
            }))
        })

    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}


